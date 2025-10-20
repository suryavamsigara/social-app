import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostCard } from './PostCard.jsx';
import './DisplayPost.css';

export function DisplayPost({currentUser, onDeletePost}) {
  const {post_id} = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      setPost(null);
      try {
        const postResponse = await fetch(`http://127.0.0.1:8000/posts/post/${post_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!postResponse.ok) {
          const errorData = await postResponse.json();
          throw new Error(errorData.detail || `Failed to fetch the post: ${postResponse.status}`);
        }

        const postData = await postResponse.json();
        setPost(postData);
        
      } catch (error) {
        console.error("Failed to fetch the post: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [post_id]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error loading post: {error}</div>
  }

  if (!post) {
    return <div>Post is not found</div>
  }

  return (
    <div className="display-post-container">
      <PostCard postData={post} currentUser={currentUser} onDeletePost={onDeletePost} />
      <div className="comments-section-header">Comments</div>
    </div>
  );
}