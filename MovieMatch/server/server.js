const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const Watchlist = require("./models/Watchlist");

const app = express();

app.use(cors());
app.use(express.json());

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not Authorized" });
  }
};

app.post("/api/auth/signup", async (req, res) => {
  console.log("📝 Account Signup Request Received:", req.body.username);
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username Taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    const defaultList = new Watchlist({
      name: "My Watchlist",
      owner: user._id,
      movies: [],
    });
    await defaultList.save();

    console.log("✅ Sign Up Successfully:", username);
    res.status(201).json({ message: "Sign Up Successfully" });
  } catch (error) {
    console.error("❌ Sign Up Error:", error);
    res.status(500).json({ message: "Server Interior Error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  console.log("🔑 Login Request:", req.body.username);
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ message: "Incorrect Username or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Incorrect Username or Password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("✅ Login Successfully Token:", username);

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/watchlists", protect, async (req, res) => {
  try {
    const lists = await Watchlist.find({ owner: req.user.userId });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: "Fail to Fetch Watchlists" });
  }
});

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
    res.status(500).json({ error: "Fail to Create Watchlist" });
  }
});

app.post("/api/watchlist", protect, async (req, res) => {
  try {
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
    if (exists)
      return res.status(400).json({ message: "Movie Already in Watchlist" });

    userList.movies.push(req.body);
    await userList.save();
    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).json({ error: "Fail to Add Movie" });
  }
});

app.post("/api/watchlists/move", protect, async (req, res) => {
  const { movieId, fromListId, toListId } = req.body;
  try {
    const fromList = await Watchlist.findById(fromListId);
    const toList = await Watchlist.findById(toListId);

    if (!fromList || !toList)
      return res.status(404).json({ message: "Watchlist Does Not Exist" });

    const movieIndex = fromList.movies.findIndex((m) => m.id === movieId);
    if (movieIndex === -1)
      return res.status(404).json({ message: "Movie Not in Watchlist" });

    const [movieToMove] = fromList.movies.splice(movieIndex, 1);

    if (toList.movies.find((m) => m.id === movieId)) {
      return res
        .status(400)
        .json({ message: "Movie Already Exist in Target Watchlist" });
    }

    toList.movies.push(movieToMove);

    await fromList.save();
    await toList.save();

    res.json({ message: "Move Success" });
  } catch (error) {
    res.status(500).json({ error: "Move Fail" });
  }
});

app.get("/api/watchlists/:id", protect, async (req, res) => {
  try {
    const list = await Watchlist.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!list)
      return res.status(404).json({ message: "Watchlist Does Not Exist" });
    res.json(list.movies);
  } catch (error) {
    res.status(500).json({ error: "Fail to Fetch Summary" });
  }
});

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
      res.json({ message: "Delete Success" });
    } catch (error) {
      res.status(500).json({ error: "Delete Fail" });
    }
  },
);

app.put(
  "/api/watchlists/:listId/movies/:movieId/watched",
  protect,
  async (req, res) => {
    try {
      const { listId, movieId } = req.params;

      const list = await Watchlist.findOne({
        _id: listId,
        owner: req.user.userId,
      });

      if (!list) {
        return res.status(404).json({ message: "Cannot Find Such Watchlist" });
      }

      const movieIndex = list.movies.findIndex(
        (m) => m.id.toString() === movieId.toString(),
      );

      if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie Not in Watchlist" });
      }

      list.movies[movieIndex].watched = !list.movies[movieIndex].watched;

      list.markModified("movies");
      await list.save();

      res.json({
        message: "Update Success",
        watched: list.movies[movieIndex].watched,
      });
    } catch (error) {
      console.error("❌ Update Watched Status Error:", error);
      res.status(500).json({ error: "Fail to Update Watch Status" });
    }
  },
);

app.get("/api/community/watchlists", protect, async (req, res) => {
  try {
    const publicLists = await Watchlist.find({ isPublic: true })
      .populate("owner", "username")
      .sort({ createdAt: -1 });

    res.json(publicLists);
  } catch (error) {
    res.status(500).json({ error: "Cannot Fetch Public Channel" });
  }
});

app.put("/api/watchlists/:id/share", protect, async (req, res) => {
  try {
    const list = await Watchlist.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!list)
      return res.status(404).json({ message: "Cannot Find Such Watchlist" });

    list.isPublic = !list.isPublic;
    await list.save();

    res.json({
      message: list.isPublic ? "Published to Public Channel" : "Set as Private",
      isPublic: list.isPublic,
    });
  } catch (error) {
    res.status(500).json({ error: "Fail to Switch" });
  }
});

app.put("/api/community/watchlists/:id/like", protect, async (req, res) => {
  try {
    const list = await Watchlist.findById(req.params.id);
    if (!list)
      return res.status(404).json({ message: "Cannot Find Such Watchlist" });

    const userId = req.user.userId;
    const hasLiked = list.likes.includes(userId);

    if (hasLiked) {
      list.likes = list.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      list.likes.push(userId);
    }

    await list.save();
    res.json({ likesCount: list.likes.length, hasLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ error: "Fail to Like" });
  }
});

app.put("/api/watchlists/:id/rename", protect, async (req, res) => {
  const { name } = req.body;
  try {
    const list = await Watchlist.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!list)
      return res.status(404).json({ message: "Cannot find watchlist" });
    if (list.name === "My Watchlist")
      return res
        .status(400)
        .json({ message: "Cannot rename the default watchlist" });

    list.name = name;
    await list.save();

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Fail to rename watchlist" });
  }
});

app.delete("/api/watchlists/:id", protect, async (req, res) => {
  try {
    const list = await Watchlist.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!list)
      return res.status(404).json({ message: "Cannot find watchlist" });
    if (list.name === "My Watchlist")
      return res
        .status(400)
        .json({ message: "Cannot delete the default watchlist" });

    // 完全删除该清单
    await Watchlist.deleteOne({ _id: req.params.id });

    res.json({ message: "Watchlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Fail to delete watchlist" });
  }
});

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Successfully COnnect to MongoDB Atlas Cloud Database！");

    await Watchlist.collection
      .dropIndex("movies.id_1")
      .catch((err) => console.log("Old Lock Removed"));

    app.listen(PORT, () => {
      console.log(`🚀 Server is Running in Port ${PORT} ...`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Fail:", err.message);
  });
