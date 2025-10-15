import { useState } from 'react';
import { LikePost } from '../../options/LikePost';
import { MenuModal } from '../../options/MenuModal';
import { TimeAgo } from '../TimeAgo';
import './PostCard.css';

export function PostCard({postData, currentUser, onDeletePost}) {
  const { Post, likes, reposts, liked_by_user } = postData;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOwner = currentUser && Number(currentUser.id) === Number(Post.owner_id);
  
  return (
    <div className="post-card">
      <div className="post-header">
        <img src={postData.Post.avatarUrl} alt={`${Post.owner.name}'s avatar`} className="post-avatar" />
        <div className="post-author">
          <span className="post-author-name">{Post.owner.name}</span>
          <span className="post-author-username">@{Post.owner.username} · {<TimeAgo timestamp={Post.created_at} />}</span>
        </div>
        <div className="post-menu-container">
          <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
            <i className="fa">&#xFE19;</i>
          </button>

          {isMenuOpen && (
            <MenuModal
              postId={Post.id}
              postOwner={isOwner}
              onClose={() => setIsMenuOpen(false)}
              onDelete={onDeletePost}
            />
          )}
        </div>
      </div>

      <div className="post-body">
        <p>{Post.content}</p>
        {Post.imageUrl && <img src={Post.imageUrl} alt="Post content" className="post-image" />}
      </div>

      <div className="post-footer">
        <div className="post-action">
          <i className="fa fa-comment"></i>
          <span>{2}</span>
        </div>
        <div className="post-action">
          <i className="fa fa-share"></i>
        </div>
        <div className="post-action">
          <i className="fa fa-retweet"></i>
          <span>{reposts}</span>
        </div>
        <LikePost
          postId={Post.id}
          isInitiallyLiked={liked_by_user}
          initialLikesCount={likes}
        />
      </div>
    </div>
  );
}