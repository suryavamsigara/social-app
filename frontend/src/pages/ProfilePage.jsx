import { PostCard } from './PostCard';
import './ProfilePage.css';

const userProfile = {
  name: "Surya",
  username: "surya123",
  bio: "Exploring unique UI/UX patterns. This is my new magazine-style profile page!",
  following: 150,
  followers: 275,
  avatarUrl: "https://placehold.co/150x150/4A5568/E2E8F0?text=S",
  featuredPosts: [
    { id: 'f1', imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop" },
    { id: 'f2', imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop" },
    { id: 'f3', text: "The position: sticky CSS property is incredibly powerful..." }
  ]
};

const userPosts = [
    { id: 1, name: userProfile.name, username: userProfile.username, avatarUrl: userProfile.avatarUrl, timestamp: "5m", text: "Here's the first post on the new profile layout. What do you all think?", comments: 18, reposts: 2, likes: 53 },
    { id: 2, name: userProfile.name, username: userProfile.username, avatarUrl: userProfile.avatarUrl, timestamp: "2h", text: "The position: sticky CSS property is incredibly powerful for creating layouts like this where one panel stays fixed while the other scrolls.", comments: 22, reposts: 8, likes: 91 },
];


export function ProfilePage() {
  return (
    <div className="profile-page-container">
      <div className="profile-hero">
        <div className="hero-item-large" style={{ backgroundImage: `url(${userProfile.featuredPosts[0].imageUrl})` }}></div>
        <div className="hero-item-small" style={{ backgroundImage: `url(${userProfile.featuredPosts[1].imageUrl})` }}></div>
        <div className="hero-item-text">
            <p>"{userProfile.featuredPosts[2].text}"</p>
        </div>
        
        <div className="hero-user-info">
            <img src={userProfile.avatarUrl} alt="User avatar" className="hero-avatar" />
            <div>
                <h1 className="hero-name">{userProfile.name}</h1>
                <p className="hero-username">@{userProfile.username}</p>
            </div>
        </div>
      </div>

      <div className="profile-infobar">
        <p className="infobar-bio">{userProfile.bio}</p>
        <div className="infobar-stats">
          <span><span className="stat-number">{userProfile.following}</span> Following</span>
          <span><span className="stat-number">{userProfile.followers}</span> Followers</span>
        </div>
        <button className="infobar-button">Edit Profile</button>
      </div>

      <div className="profile-content-area">
        <div className="profile-tabs">
          <div className="profile-tab active-tab">Posts</div>
          <div className="profile-tab">Media</div>
          <div className="profile-tab">Likes</div>
        </div>
        <div className="profile-posts-list">
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}


























/*
import { PostCard } from './PostCard';
import './ProfilePage.css';

const userProfile = {
  name: "Surya",
  username: "surya123",
  bio: "I am Surya Vamsi. I am building a social media app",
  following: 150,
  followers: 275,
  avatarUrl: "https://placehold.co/150x150/4A5568/E2E8F0?text=S",
  bannerUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop"
};

const userPosts = [
  {
    id: 1,
    avatarUrl: userProfile.avatarUrl,
    name: userProfile.name,
    username: userProfile.username,
    timestamp: "5m",
    text: "This is my first post. This is my first post. This is my first post. This is my first post.",
    imageUrl: null,
    comments: 12,
    reposts: 5,
    likes: 400,
  },
  {
    id: 3,
    avatarUrl: userProfile.avatarUrl,
    name: userProfile.name,
    username: userProfile.username,
    timestamp: "2h",
    text: "It's taking a looooooottttt of time to fix the CSS lol",
    imageUrl: null,
    comments: 287,
    reposts: 8,
    likes: 1289,
  },
];

export function ProfilePage() {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={userProfile.bannerUrl} alt="Profile banner" className="profile-banner" />
        <div className="profile-details">
          <div className="profile-avatar-container">
            <img src={userProfile.avatarUrl} alt="User avatar" className="profile-avatar" />
          </div>
          <div className="profile-actions">
            <button className="edit-profile-button">Edit Profile</button>
          </div>
          <div className="profile-user-info">
            <span className="profile-user-name">{userProfile.name}</span>
            <span className="profile-user-username">@{userProfile.username}</span>
          </div>
          <p className="profile-bio">{userProfile.bio}</p>
          <div className="profile-stats">
            <span><span className="stat-number">{userProfile.following}</span> Following</span>
            <span><span className="stat-number">{userProfile.followers}</span> Followers</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="profile-tab active-tab">Posts</div>
        <div className="profile-tab">Replies</div>
        <div className="profile-tab">Likes</div>
      </div>

      <div className="profile-posts-feed">
        {userPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
*/