import './HomePage.css'
import { PostsFeed } from './PostsFeed';

export function HomePage({ posts }) {
  return (
    <>
      <title>Social App</title>
      <PostsFeed posts={posts} />
    </>
  );
}