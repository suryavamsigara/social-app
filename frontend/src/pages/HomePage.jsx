import './HomePage.css'
import { PostsFeed } from './PostsFeed';

export function HomePage({ posts, onDeletePost, currentUser }) {
  return (
    <>
      <title>Social App</title>
      <PostsFeed
        posts={posts}
        onDeletePost={onDeletePost}
        currentUser={currentUser}
      />
    </>
  );
}