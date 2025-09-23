import './HomePage.css'
import { Header } from '../components/Header'
import { SideBar } from '../components/SideBar';
import { PostsFeed } from './PostsFeed';

export function HomePage({ posts }) {
  return (
    <>
      <title>Social App</title>
      <PostsFeed posts={posts} />
    </>
  );
}