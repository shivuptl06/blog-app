import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Post from "../components/Post";

function Home() {
  const navigate = useNavigate();
  const { username, posts, fetchPosts } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Log posts to verify data
  console.log("Posts in UserContext:", posts); // Debugging line

  async function onEdit(postId, updatedPost) {
    try {
      const response = await axios.post("http://localhost:5000/edit", {
        id: postId,
        ...updatedPost,
      });
      console.log("Post updated successfully:", response.data);
      fetchPosts(); // Refetch posts after updating
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  async function handleDelete(_id, author) {
    if (username !== author) {
      setIsAuthorized(false);
      setModalMessage("You are not authorized to delete posts of other users");
      setIsModalOpen(true);
      return;
    }

    setPostToDelete(_id);
    setIsAuthorized(true);
    setModalMessage("Are you sure you want to delete this post?");
    setIsModalOpen(true);
  }

  async function confirmDelete() {
    setIsModalOpen(false);
    console.log("Attempting to delete post with ID:", postToDelete); // Debugging line
    
    try {
      const response = await axios.post("http://localhost:5000/delete", {
        id: postToDelete,
      });
      console.log("Post deleted successfully:", response.data);
      fetchPosts(); // Refetch posts after deleting
      setPostToDelete(null); // Reset postToDelete state after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      setIsModalOpen(false);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col items-center">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-w-lg mx-auto">
            <h2 className="text-lg font-semibold text-center mb-4">
              {modalMessage}
            </h2>
            <div className="flex justify-around">
              {isAuthorized ? (
                <>
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded w-full sm:w-auto sm:px-6 mb-2 sm:mb-0"
                    onClick={confirmDelete}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-gray-500 text-white px-6 py-2 rounded w-full sm:w-auto sm:px-6"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="bg-gray-500 text-white px-6 py-2 rounded w-full sm:w-auto sm:px-6"
                  onClick={closeModal}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
