import { PostCard } from './PostCard'

export function PostsFeed({ posts, onDeletePost, currentUser }) {

  posts.map((item) => {
    item.Post.avatarUrl = "https://placehold.co/48x48/CBD5E0/4A5568?text=V";
  })

  return (
    <div className="posts-feed">
      {posts.map((item) => (
        <PostCard key={item.Post.id} postData={item} onDeletePost={onDeletePost} currentUser={currentUser} />
      ))}
    </div>
  );
}