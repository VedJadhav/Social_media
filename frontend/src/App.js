import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Ensure this matches your FastAPI backend URL

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ user: "", content: "" });
  const [commentTexts, setCommentTexts] = useState({}); // Store all comment inputs in an object

  // Fetch posts from FastAPI when component loads
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("Failed to fetch posts. Check if backend is running.");
    }
  };

  // Handle adding a new post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.user || !newPost.content) {
      alert("Fields cannot be empty!");
      return;
    }
    try {
      await axios.post(`${API_URL}/posts`, newPost);
      setNewPost({ user: "", content: "" }); // Reset form
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Error adding post. Check backend logs.");
    }
  };

  // Handle Like Function
  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_URL}/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Error liking post. Check backend logs.");
    }
  };

  // Handle Comment Function
  const handleComment = async (postId) => {
    if (!commentTexts[postId]?.trim()) return;
    try {
      await axios.post(`${API_URL}/posts/${postId}/comment`, {
        user: "Guest",
        text: commentTexts[postId],
      });
      setCommentTexts({ ...commentTexts, [postId]: "" }); // Clear input for this post
      fetchPosts();
    } catch (error) {
      
      console.error("Error adding comment:", error);
      alert("Error adding comment. Check backend logs.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Social Media Platform</h1>

      {/* New Post Form */}
      <form onSubmit={handlePostSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Your Name"
          value={newPost.user}
          onChange={(e) => setNewPost({ ...newPost, user: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <textarea
          placeholder="What's on your mind?"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        ></textarea>
        <button type="submit" style={{ padding: "10px 15px", cursor: "pointer" }}>
          Add Post
        </button>
      </form>

      {/* Posts Section */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <h3>{post.user}</h3>
            <p>{post.content}</p>
            <p>❤️ {post.likes} Likes</p>

            {/* Like Button */}
            <button onClick={() => handleLike(post.id)} style={{ marginRight: "10px", cursor: "pointer" }}>
              Like
            </button>

            {/* Comment Section */}
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentTexts[post.id] || ""}
                onChange={(e) =>
                  setCommentTexts({ ...commentTexts, [post.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment(post.id);
                  }
                }}
                style={{ width: "80%", padding: "5px" }}
              />
            </div>

            {/* Display Comments */}
            {post.comments && post.comments.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <h4>Comments:</h4>
                {post.comments.map((comment, index) => (
                  <p key={index} style={{ margin: "5px 0" }}>
                    <strong>{comment.user}:</strong> {comment.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No posts yet. Add a post above!</p>
      )}
    </div>
  );
};

export default App;
