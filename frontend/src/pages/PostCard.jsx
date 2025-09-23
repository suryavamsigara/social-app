import { TimeAgo } from '../components/TimeAgo';
import './PostCard.css'

export function PostCard({postData}) {
  const { Post, likes, reposts } = postData;
  return (
    <div className="post-card">
      <div className="post-header">
        <img src={postData.Post.avatarUrl} alt={`${Post.owner.name}'s avatar`} className="post-avatar" />
        <div className="post-author">
          <span className="post-author-name">{Post.owner.name}</span>
          <span className="post-author-username">@{Post.owner.email} · {<TimeAgo timestamp={Post.created_at} />}</span>
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
        <div className="post-action">
          <i className="fa fa-heart"></i>
          <span>{likes}</span>
        </div>
      </div>
    </div>
  );
}