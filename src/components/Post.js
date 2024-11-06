import React from "react";

function Post({ post }) {
  const { content, cover, createdAt, summary, title, author } = post;

  // Check if createdAt is valid
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date unavailable"; // Show fallback if no date is available

  return (
    <div className="post bg-white p-4 rounded-lg shadow-md mb-6">
      {/* Cover Image */}
      {cover && (
        <div className="post-cover mb-4">
          <img
            src={`/${cover}`} // Ensure correct path to the image
            alt={title}
            className="w-full h-64 object-contain rounded-lg"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="post-title text-2xl font-bold mb-2 text-gray-800">{title}</h2>

      {/* Created At */}
      <p className="post-date text-sm text-gray-500 mb-2">{formattedDate}</p>

      {/* Author */}
      {author && (
        <p className="post-author text-sm text-gray-600 mb-2">
          <strong>Author:</strong> {author}
        </p>
      )}

      {/* Summary */}
      <p className="post-summary text-gray-700 mb-4">{summary}</p>

      {/* Content */}
      <div className="post-content text-gray-800">
        {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
      </div>
    </div>
  );
}

export default Post;
