import { useState } from "react";
import '../pages/PostCard.css'

export function LikePost({ postId, isInitiallyLiked, initialLikesCount }) {
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [likeCount, setLikeCount] = useState(initialLikesCount);

  const handleLike = async () => {
    const dir = liked ? 0 : 1;

    setLiked(!liked);
    setLikeCount((prevCount) => liked ? prevCount - 1 : prevCount + 1);

    const likeData = {
      post_id: postId,
      dir: dir,
    };

    try {
      const token = localStorage.getItem('token');

      if (!token) throw new Error("Not authorized");

      const response = await fetch('http://127.0.0.1:8000/like/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(likeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error.. Failed to update Status: ${response.status}`);
      }

    } catch (error) {
      console.error("Failed to like post", error);
      setLiked(liked);
      setLikeCount(likeCount);
    }
  };

  return (
    <div
      className={`post-action like-button ${liked ? 'liked' : 'notliked'}`}
      onClick={handleLike}
    >
      <i className="fa fa-heart"></i>
      <span>{likeCount}</span>
    </div>
  );
}
