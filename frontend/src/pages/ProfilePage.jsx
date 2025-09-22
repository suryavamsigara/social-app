import { PostCard } from './PostCard';
import './ProfilePage.css';

const userProfile = {
  name: "Surya",
  username: "surya123",
  bio: "I am Vamsi. I am into AI/ML and full stack web development",
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
    { id: 2, name: userProfile.name, username: userProfile.username, avatarUrl: userProfile.avatarUrl, timestamp: "2h", text: "It is taking a lot of time to adjust the CSS properly lol", comments: 22, reposts: 8, likes: 91 },
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

