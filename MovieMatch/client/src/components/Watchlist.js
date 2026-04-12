// import React, { useState, useEffect } from "react";
// import { getImageUrl } from "../utils/api";
// // 👉 引入后端 API
// import {
//   getWatchlist,
//   toggleWatchedStatus,
//   removeFromWatchlist,
// } from "../utils/backendApi";

// const Watchlist = ({ isOpen, onClose, onCountUpdate }) => {
//   const [watchlist, setWatchlist] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // 当侧边栏打开时，从【真实数据库】拉取数据
//   useEffect(() => {
//     const fetchMovies = async () => {
//       if (isOpen) {
//         setIsLoading(true);
//         try {
//           const movies = await getWatchlist();
//           setWatchlist(movies);
//         } catch (error) {
//           console.error("Failed to load watchlist");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };
//     fetchMovies();
//   }, [isOpen]);

//   // 更新小红点数量（由于现在数据在数据库，我们需要在前端通知 Home.js 更新数量）
//   useEffect(() => {
//     if (onCountUpdate) {
//       onCountUpdate(watchlist.length);
//     }
//   }, [watchlist, onCountUpdate]);

//   // 标记为已看 / 未看
//   const handleToggleWatched = async (id) => {
//     try {
//       // 1. 发送请求给后端更新数据库
//       await toggleWatchedStatus(id);
//       // 2. 更新前端的显示状态 (避免刷新页面)
//       setWatchlist((prev) =>
//         prev.map((m) => (m.id === id ? { ...m, watched: !m.watched } : m)),
//       );
//     } catch (error) {
//       alert("更新状态失败，请重试！");
//     }
//   };

//   // 从收藏夹中移除
//   const handleRemoveMovie = async (id) => {
//     try {
//       // 1. 发送请求给后端删除该条目
//       await removeFromWatchlist(id);
//       // 2. 将电影从前端列表中剔除
//       setWatchlist((prev) => prev.filter((m) => m.id !== id));
//     } catch (error) {
//       alert("删除失败，请重试！");
//     }
//   };

//   const watchedCount = watchlist.filter((m) => m.watched).length;

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
//           onClick={onClose}
//         ></div>
//       )}

//       <aside
//         className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-slate-900 text-slate-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-700 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900">
//           <h2 className="font-[Permanent_Marker] text-3xl -rotate-2 drop-shadow-sm">
//             Watchlist
//           </h2>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/20 hover:bg-slate-900/40 transition-colors font-bold text-lg"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
//           {isLoading ? (
//             <div className="flex justify-center items-center h-40">
//               <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           ) : watchlist.length === 0 ? (
//             <div className="text-center text-slate-500 mt-20">
//               <p className="text-6xl mb-4">🍿</p>
//               <p className="font-bold text-lg">Your watchlist is empty.</p>
//               <p className="text-sm mt-2">Go swipe some movies!</p>
//             </div>
//           ) : (
//             watchlist.map((movie) => (
//               <div
//                 key={movie.id}
//                 className={`flex gap-3 items-start p-2 rounded-xl transition-all border border-slate-800 ${
//                   movie.watched
//                     ? "bg-slate-800/40 opacity-60 grayscale-[50%]"
//                     : "bg-slate-800 hover:bg-slate-700"
//                 }`}
//               >
//                 <img
//                   src={getImageUrl(movie.poster_path, "w200")}
//                   alt={movie.title}
//                   className="w-16 h-24 object-cover rounded-lg shadow-md flex-shrink-0 bg-slate-700"
//                 />

//                 <div className="flex-1 min-w-0 flex flex-col justify-between h-24 py-1">
//                   <div>
//                     <h4
//                       className={`font-bold text-sm leading-tight truncate ${movie.watched ? "line-through text-slate-400" : "text-white"}`}
//                     >
//                       {movie.title}
//                     </h4>
//                     <p className="text-xs text-slate-400 mt-1">
//                       {movie.release_date?.split("-")[0] || "N/A"} •{" "}
//                       <span className="text-yellow-500">
//                         ★ {movie.vote_average?.toFixed(1)}
//                       </span>
//                     </p>
//                   </div>

//                   <div className="flex justify-between items-center mt-auto">
//                     <button
//                       onClick={() => handleToggleWatched(movie.id)}
//                       className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
//                         movie.watched
//                           ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
//                           : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/40"
//                       }`}
//                     >
//                       {movie.watched ? "👁️ Watched" : "To Watch"}
//                     </button>
//                     <button
//                       onClick={() => handleRemoveMovie(movie.id)}
//                       className="text-slate-500 hover:text-red-500 p-1 transition-colors text-lg"
//                       title="Remove"
//                     >
//                       🗑️
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
//           {watchedCount} / {watchlist.length} Movies Watched
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Watchlist;
