import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, ChevronDown, ChevronUp, Search } from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../Server/adminService";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPosts();
      setPosts(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDeletePost = async (id) => {
    const result = await Swal.fire({ title: "Delete post?", icon: "warning", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
    if (!result.isConfirmed) return;
    try {
      await adminService.deletePost(id);
      Swal.fire("Deleted", "Post removed", "success");
      setExpandedPost(null);
      fetchPosts();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const handleToggleComments = async (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      setComments([]);
      return;
    }
    setExpandedPost(postId);
    setLoadingComments(true);
    try {
      const res = await adminService.getPostComments(postId);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({ title: "Delete comment?", icon: "warning", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
    if (!result.isConfirmed) return;
    try {
      await adminService.deleteComment(commentId);
      Swal.fire("Deleted", "Comment removed", "success");
      setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Anonymous Posts</h1>
        <p className="text-gray-400 text-sm mt-1">Manage anonymous discussion posts</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all"
          placeholder="Search posts..."
        />
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-gray-700/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No posts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {filteredPosts.map((post) => (
              <div key={post.post_id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>👍 {post.upvote_count || 0}</span>
                      <span>👎 {post.downvote_count || 0}</span>
                      <span>Score: {post.score || 0}</span>
                      {post.created_at && <span>{new Date(post.created_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleComments(post.post_id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#818CF8] hover:bg-[#6366F1]/10 transition-colors"
                      title="View comments"
                    >
                      {expandedPost === post.post_id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.post_id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedPost === post.post_id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pl-4 border-l-2 border-gray-700 space-y-2">
                        {loadingComments ? (
                          <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : comments.length === 0 ? (
                          <p className="text-xs text-gray-500 py-2">No comments</p>
                        ) : (
                          comments.map((c) => (
                            <div key={c.comment_id} className="flex items-start justify-between gap-2 py-1.5">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-300">{c.comment}</p>
                                {c.commenter_id && (
                                  <p className="text-[10px] text-gray-600 mt-0.5">By: {c.commenter_id}</p>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteComment(c.comment_id)}
                                className="p-1 rounded text-gray-500 hover:text-[#EF4444] transition-colors shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
