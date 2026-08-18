import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronUp, ChevronDown, Send, Clock, X, Plus, TrendingUp } from "lucide-react";
import { useAuth } from "../Auth/AuthContext.jsx";
import Nav from "../Home/Nav.jsx";

const mockPosts = [
  {
    post_id: 1,
    content: "The new library hours are a lifesaver! Finally can study in peace after school. Thank you to whoever made this happen.",
    upvote_count: 24,
    downvote_count: 2,
    score: 22,
    comment_count: 5,
    created_at: "2026-08-10T14:30:00",
  },
  {
    post_id: 2,
    content: "Can we get a water cooler on the 3rd floor? Walking all the way to the ground floor during breaks is exhausting, especially in this heat.",
    upvote_count: 45,
    downvote_count: 3,
    score: 42,
    comment_count: 12,
    created_at: "2026-08-09T10:15:00",
  },
  {
    post_id: 3,
    content: "Mid-term exam schedule seems a bit too packed. Three subjects back-to-back on the same day? That's brutal for students.",
    upvote_count: 38,
    downvote_count: 5,
    score: 33,
    comment_count: 8,
    created_at: "2026-08-08T16:45:00",
  },
  {
    post_id: 4,
    content: "Shoutout to the canteen staff for adding new menu items! The pasta is amazing. More vegetarian options would be great though.",
    upvote_count: 19,
    downvote_count: 1,
    score: 18,
    comment_count: 3,
    created_at: "2026-08-07T12:00:00",
  },
  {
    post_id: 5,
    content: "Is anyone else confused about the new grading system? The announcement was unclear. Would appreciate a detailed breakdown.",
    upvote_count: 31,
    downvote_count: 0,
    score: 31,
    comment_count: 7,
    created_at: "2026-08-06T09:30:00",
  },
  {
    post_id: 6,
    content: "The science fair idea is incredible this year. Sustainability theme is very relevant. Already working on my project!",
    upvote_count: 15,
    downvote_count: 2,
    score: 13,
    comment_count: 4,
    created_at: "2026-08-05T11:20:00",
  },
];

const mockComments = {
  1: [
    { comment_id: 1, comment: "Agreed! The extended hours have been so helpful for exam prep.", created_at: "2026-08-10T15:00:00" },
    { comment_id: 2, comment: "The new reference section is also really good.", created_at: "2026-08-10T15:30:00" },
  ],
  2: [
    { comment_id: 3, comment: "Yes! Especially near the science labs.", created_at: "2026-08-09T11:00:00" },
    { comment_id: 4, comment: "I've written to the admin about this too.", created_at: "2026-08-09T11:30:00" },
    { comment_id: 5, comment: "Third floor student here. Can confirm, it's terrible.", created_at: "2026-08-09T12:00:00" },
  ],
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function PostCard({ post, onOpen, onVote, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-white rounded-xl border border-[#E7E4DB] overflow-hidden transition-all duration-300 hover:shadow-[0_4px_16px_rgba(31,36,64,0.06)]"
    >
      <div className="flex">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 px-3 py-4 bg-[#FAF9F6]">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onVote(post.post_id, "up"); }}
            className="p-1.5 rounded-lg hover:bg-[#4B7A5A]/10 text-gray-400 hover:text-[#4B7A5A] transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
          <span className={`text-sm font-bold ${post.score > 0 ? "text-[#4B7A5A]" : post.score < 0 ? "text-[#A6402F]" : "text-gray-400"}`}>
            {post.score}
          </span>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onVote(post.post_id, "down"); }}
            className="p-1.5 rounded-lg hover:bg-[#A6402F]/10 text-gray-400 hover:text-[#A6402F] transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 cursor-pointer" onClick={() => onOpen(post)}>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {post.content}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(post); }}
              className="flex items-center gap-1.5 hover:text-[#1F2440] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {post.comment_count} {post.comment_count === 1 ? "comment" : "comments"}
            </button>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(post.created_at)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CommentModal({ post, onClose }) {
  const [comments, setComments] = useState(mockComments[post.post_id] || []);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      comment_id: Date.now(),
      comment: newComment.trim(),
      created_at: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden border border-[#E7E4DB]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#1F2440] font-serif-display">
            Discussion
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Post content */}
        <div className="p-5 border-b border-gray-100 bg-[#FAF9F6]">
          <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <ChevronUp className="w-3.5 h-3.5 text-[#4B7A5A]" />
              {post.score} points
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(post.created_at)}
            </span>
          </div>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {comments.length > 0 ? (
            comments.map((c) => (
              <motion.div
                key={c.comment_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-[#1F2440] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-white">A</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{c.comment}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{timeAgo(c.created_at)}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>

        {/* Add comment */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2440]/15 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addComment}
              disabled={!newComment.trim()}
              className="p-2.5 rounded-lg bg-[#1F2440] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2C3359] transition-colors"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Discuss() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [sortBy, setSortBy] = useState("top");

  const student = user?.student || null;
  const handleLogout = async () => { await logout(); navigate("/login"); };

  const handleVote = (postId, type) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.post_id !== postId) return p;
        if (type === "up") {
          return { ...p, upvote_count: p.upvote_count + 1, score: p.score + 1 };
        }
        return { ...p, downvote_count: p.downvote_count + 1, score: p.score - 1 };
      })
    );
  };

  const addPost = () => {
    if (!newPostContent.trim()) return;
    const post = {
      post_id: Date.now(),
      content: newPostContent.trim(),
      upvote_count: 0,
      downvote_count: 0,
      score: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    setNewPostContent("");
    setShowNewPost(false);
  };

  const sorted = [...posts].sort((a, b) => {
    if (sortBy === "top") return b.score - a.score;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav student={student} onLogout={handleLogout} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1F2440]/[0.06]">
              <MessageCircle className="w-6 h-6 text-[#1F2440]" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2440] font-serif-display">
                Discuss
              </h1>
              <p className="text-sm text-gray-400">Anonymous student discussions</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewPost(!showNewPost)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F2440] text-white text-sm font-semibold hover:bg-[#2C3359] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </motion.button>
        </motion.div>

        {/* New post form */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-xl border border-[#E7E4DB] p-5">
                <textarea
                  placeholder="Share something anonymously..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#FAF9F6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F2440]/15 resize-none transition-all"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">Posts are anonymous. Be respectful.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowNewPost(false); setNewPostContent(""); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addPost}
                      disabled={!newPostContent.trim()}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#1F2440] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2C3359] transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortBy("top")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              sortBy === "top" ? "bg-[#1F2440] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-[#1F2440]/30"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Top
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortBy("new")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              sortBy === "new" ? "bg-[#1F2440] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-[#1F2440]/30"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            New
          </motion.button>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {sorted.map((post, i) => (
            <PostCard key={post.post_id} post={post} onOpen={setSelectedPost} onVote={handleVote} index={i} />
          ))}
        </div>

        {sorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center py-16"
          >
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <MessageCircle className="w-7 h-7 text-gray-300" />
            </motion.div>
            <p className="text-gray-400 font-medium">No discussions yet</p>
            <p className="text-sm text-gray-300 mt-1">Be the first to start a conversation!</p>
          </motion.div>
        )}
      </div>

      {/* Comment modal */}
      <AnimatePresence>
        {selectedPost && (
          <CommentModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
