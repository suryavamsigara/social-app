import './HomePage.css'
import { PostsFeed } from './PostsFeed';
import { QuirkyAi } from '../components/ai/QuirkyAi';

export function HomePage({ posts, onDeletePost, currentUser, view, onChangeView }) {
  return (
      view === 'feed'
        ? <PostsFeed
            posts={posts}
            onDeletePost={onDeletePost}
            currentUser={currentUser}
          />
        : <QuirkyAi onClose={() => onChangeView('feed')} />
  );
}