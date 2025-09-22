import './PostCard.css'

export function PostCard({post}) {
    return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.avatarUrl} alt={`${post.name}'s avatar`} className="post-avatar" />
        <div className="post-author">
          <span className="post-author-name">{post.name}</span>
          <span className="post-author-username">@{post.username} · {post.timestamp}</span>
        </div>
      </div>

      <div className="post-body">
        <p>{post.text}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="post-image" />}
      </div>

      <div className="post-footer">
        <div className="post-action">
          <i className="fa fa-comment"></i>
          <span>{post.comments}</span>
        </div>
        <div className="post-action">
          <i className="fa fa-share"></i>
        </div>
        <div className="post-action">
          <i className="fa fa-retweet"></i>
          <span>{post.reposts}</span>
        </div>
        <div className="post-action">
          <i className="fa fa-heart"></i>
          <span>{post.likes}</span>
        </div>
      </div>
    </div>
  );
}