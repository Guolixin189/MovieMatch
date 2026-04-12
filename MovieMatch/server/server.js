const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 引入数据库模型
const User = require("./models/User");
const Watchlist = require("./models/Watchlist");

const app = express();

// 1. 无敌版 CORS
app.use(cors());
// 2. 允许解析 JSON 数据
app.use(express.json());

// ==========================================
// 🛡️ 身份验证中间件 (保安)
// ==========================================
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "未授权：缺少通行证" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 验证通过，把用户 ID 挂载到请求上
    next();
  } catch (error) {
    return res.status(401).json({ message: "未授权：通行证无效或已过期" });
  }
};

// ==========================================
// 🔑 身份验证路由 (Auth Routes)
// ==========================================

// 1. 用户注册
app.post("/api/auth/signup", async (req, res) => {
  console.log("📝 收到【注册】请求账号:", req.body.username);
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "用户名已被注册" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    // 注册成功时，自动为该用户创建一个默认的空收藏夹
    const defaultList = new Watchlist({
      name: "My Watchlist",
      owner: user._id,
      movies: [],
    });
    await defaultList.save();

    console.log("✅ 注册成功:", username);
    res.status(201).json({ message: "注册成功" });
  } catch (error) {
    console.error("❌ 注册报错:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
});

// 2. 用户登录
app.post("/api/auth/login", async (req, res) => {
  console.log("🔑 收到【登录】请求账号:", req.body.username);
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "用户名或密码错误" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "用户名或密码错误" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("✅ 登录成功发放 Token:", username);

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error("❌ 登录报错:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
});

// 1. 获取当前用户的收藏夹
// ==========================================
// 🍿 电影收藏夹路由 (多清单升级版)
// ==========================================

// 1. 获取用户所有的清单列表 (用于侧边栏显示)
app.get("/api/watchlists", protect, async (req, res) => {
  try {
    const lists = await Watchlist.find({ owner: req.user.userId });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: "获取清单列表失败" });
  }
});

// 2. 新建一个自定义清单
app.post("/api/watchlists", protect, async (req, res) => {
  try {
    const { name } = req.body;
    const newList = new Watchlist({
      name: name || "New List",
      owner: req.user.userId,
      movies: [],
    });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: "新建清单失败" });
  }
});

// 3. 默认添加电影 (依然存入 "My Watchlist")
app.post("/api/watchlist", protect, async (req, res) => {
  try {
    // 强制找到那个叫 "My Watchlist" 的默认清单
    let userList = await Watchlist.findOne({
      owner: req.user.userId,
      name: "My Watchlist",
    });

    if (!userList) {
      userList = new Watchlist({
        name: "My Watchlist",
        owner: req.user.userId,
        movies: [],
      });
    }

    const exists = userList.movies.find((m) => m.id === req.body.id);
    if (exists) return res.status(400).json({ message: "电影已在收藏夹中" });

    userList.movies.push(req.body);
    await userList.save();
    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).json({ error: "添加失败" });
  }
});

// 4. 移动电影 (从一个清单移动到另一个清单)
app.post("/api/watchlists/move", protect, async (req, res) => {
  const { movieId, fromListId, toListId } = req.body;
  try {
    const fromList = await Watchlist.findById(fromListId);
    const toList = await Watchlist.findById(toListId);

    if (!fromList || !toList)
      return res.status(404).json({ message: "清单不存在" });

    // 1. 从原清单找到电影并移除
    const movieIndex = fromList.movies.findIndex((m) => m.id === movieId);
    if (movieIndex === -1)
      return res.status(404).json({ message: "电影不在原清单中" });

    const [movieToMove] = fromList.movies.splice(movieIndex, 1);

    // 2. 检查目标清单是否已存在
    if (toList.movies.find((m) => m.id === movieId)) {
      return res.status(400).json({ message: "目标清单已存在该电影" });
    }

    // 3. 存入目标清单
    toList.movies.push(movieToMove);

    await fromList.save();
    await toList.save();

    res.json({ message: "移动成功" });
  } catch (error) {
    res.status(500).json({ error: "移动失败" });
  }
});

// 5. 获取特定清单内的电影 (用于点击左侧标签切换内容)
app.get("/api/watchlists/:id", protect, async (req, res) => {
  try {
    const list = await Watchlist.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!list) return res.status(404).json({ message: "清单不存在" });
    res.json(list.movies);
  } catch (error) {
    res.status(500).json({ error: "获取详情失败" });
  }
});

// 6. 从特定清单删除电影 (保持不变，但增加 listId)
app.delete(
  "/api/watchlists/:listId/movie/:movieId",
  protect,
  async (req, res) => {
    try {
      const list = await Watchlist.findById(req.params.listId);
      list.movies = list.movies.filter(
        (m) => m.id !== parseInt(req.params.movieId),
      );
      await list.save();
      res.json({ message: "删除成功" });
    } catch (error) {
      res.status(500).json({ error: "删除失败" });
    }
  },
);

// ==========================================
// 🌍 社區與社交路由 (Public Channel)
// ==========================================

// 1. 獲取所有公開的收藏夾 (廣場大廳)
app.get("/api/community/watchlists", protect, async (req, res) => {
  try {
    // 找出所有 isPublic 為 true 的清單
    // populate('owner', 'username') 是 Mongoose 的魔法，它會自動把 owner 的 ID 替換成該用戶的名字！
    const publicLists = await Watchlist.find({ isPublic: true })
      .populate("owner", "username")
      .sort({ createdAt: -1 }); // 最新發布的排在最前面

    res.json(publicLists);
  } catch (error) {
    res.status(500).json({ error: "無法獲取公共頻道數據" });
  }
});

// 2. 切換清單的公開/私密狀態 (分享按鈕)
app.put("/api/watchlists/:id/share", protect, async (req, res) => {
  try {
    const list = await Watchlist.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!list) return res.status(404).json({ message: "找不到該清單" });

    list.isPublic = !list.isPublic; // 反轉狀態
    await list.save();

    res.json({
      message: list.isPublic ? "已公開到大廳" : "已轉為私密",
      isPublic: list.isPublic,
    });
  } catch (error) {
    res.status(500).json({ error: "狀態切換失敗" });
  }
});

// 3. 點讚 / 取消點讚
app.put("/api/community/watchlists/:id/like", protect, async (req, res) => {
  try {
    const list = await Watchlist.findById(req.params.id);
    if (!list) return res.status(404).json({ message: "找不到該清單" });

    // 檢查當前用戶是否已經點過讚了
    const userId = req.user.userId;
    const hasLiked = list.likes.includes(userId);

    if (hasLiked) {
      // 如果點過了，就取消點讚 (從陣列中移除)
      list.likes = list.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      // 如果沒點過，就加入點讚陣列
      list.likes.push(userId);
    }

    await list.save();
    res.json({ likesCount: list.likes.length, hasLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ error: "點讚操作失敗" });
  }
});

// ==========================================
// 🚀 数据库连接与启动
// ==========================================
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ 成功连接到 MongoDB Atlas 云端数据库！");

    await Watchlist.collection
      .dropIndex("movies.id_1")
      .catch((err) => console.log("旧锁已拆除"));

    app.listen(PORT, () => {
      console.log(`🚀 服务器正在端口 ${PORT} 上运行...`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB 连接失败:", err.message);
  });
