import { PostCard } from './PostCard'

export function PostsFeed({ posts }) {
  /*
  const feedPosts = [
    {
      id: 1,
      avatarUrl: "https://placehold.co/48x48/A0AEC0/4A5568?text=S",
      name: "Surya",
      username: "surya123",
      timestamp: "5m",
      text: "This is my first post. This is my first post. This is my first post. This is my first post. This is my first post.",
      imageUrl: null,
      comments: 12,
      reposts: 5,
      likes: 47,
    },
    {
      id: 2,
      avatarUrl: "https://placehold.co/48x48/CBD5E0/4A5568?text=V",
      name: "Vamsi",
      username: "vamsi123",
      timestamp: "32m",
      text: "This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post.",
      imageUrl: null,
      comments: 28,
      reposts: 11,
      likes: 109,
    },
    {
      id: 3,
      avatarUrl: "https://placehold.co/48x48/A0AEC0/4A5568?text=S",
      name: "Surya",
      username: "surya123",
      timestamp: "5m",
      text: "This is my first post. This is my first post. This is my first post. This is my first post. This is my first post.",
      imageUrl: null,
      comments: 7,
      reposts: 12,
      likes: 50,
    },
    {
      id: 4,
      avatarUrl: "https://placehold.co/48x48/CBD5E0/4A5568?text=V",
      name: "Vamsi",
      username: "vamsi123",
      timestamp: "32m",
      text: "This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post.",
      imageUrl: null,
      comments: 20,
      reposts: 2,
      likes: 253,
    },
    {
      id: 5,
      avatarUrl: "https://placehold.co/48x48/A0AEC0/4A5568?text=S",
      name: "Surya",
      username: "surya123",
      timestamp: "5m",
      text: "This is my first post. This is my first post. This is my first post. This is my first post. This is my first post.",
      imageUrl: null,
      comments: 124,
      reposts: 76,
      likes: 490,
    },
    {
      id: 6,
      avatarUrl: "https://placehold.co/48x48/CBD5E0/4A5568?text=V",
      name: "Vamsi",
      username: "vamsi123",
      timestamp: "32m",
      text: "This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post. This is my second post.",
      imageUrl: null,
      comments: 7,
      reposts: 4,
      likes: 18,
    }
  ];
  */

  posts.map((item) => {
    item.Post.avatarUrl = "https://placehold.co/48x48/CBD5E0/4A5568?text=V";
  })

  return (
    <div className="posts-feed">
      {posts.map((item) => (
        <PostCard key={item.Post.id} postData={item} />
      ))}
    </div>
  );
}