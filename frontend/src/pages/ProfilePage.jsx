import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { useParams } from 'react-router-dom';
import './ProfilePage.css';

export function ProfilePage({ currentUser }) {
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

  // Getting username from the url
  const { username } = useParams();

  // for current user
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profileResponse = await fetch(`http://127.0.0.1:8000/users/${username}`, {
          headers: {'Authorization': `Bearer ${token}`}
        });
        const postsResponse = await fetch(`http://127.0.0.1:8000/posts/user/${username}`, {
          headers: {'Authorization': `Bearer ${token}`}
        })

        if (!profileResponse.ok || !postsResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const profileData = await profileResponse.json();
        const postsData = await postsResponse.json();

        setProfile(profileData);
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch profile data: ", error)
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]); // re runs if the username in the url changes

  if (loading) {
    return <div className="profile-page-container">Loading...</div>;
  }
  
  if (!profile) {
    return <div className="profile-page-container">User not found</div>;
  }

  const isOwnProfile = currentUser && currentUser.username === profile.username;

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
                <h1 className="hero-name">{profile.name}</h1>
                <p className="hero-username">@{profile.username}</p>
            </div>
        </div>
      </div>

      <div className="profile-infobar">
        <p className="infobar-bio">{profile.bio}</p>
        <div className="infobar-stats">
          <span><span className="stat-number">{userProfile.following}</span> Following</span>
          <span><span className="stat-number">{userProfile.followers}</span> Followers</span>
        </div>
        {isOwnProfile ? (
          <button className="infobar-button">Edit Profile</button>
        ) : (
          <button className="infobar-button follow-button">Follow</button>
        )}
      </div>

      <div className="profile-content-area">
        <div className="profile-tabs">
          <div className="profile-tab active-tab">Posts</div>
          <div className="profile-tab">Media</div>
          <div className="profile-tab">Likes</div>
        </div>
        <div className="profile-posts-list">
          {posts.map(postData => (
            <PostCard key={postData.Post.id} postData={postData} />
          ))}
        </div>
      </div>
    </div>
  );
}

