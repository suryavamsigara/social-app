import './MenuModal.css';

export function MenuModal({ postId, postOwner, onClose, onDelete }) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Not authenticated");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/posts/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        console.log(`Post with id: ${postId} deleted`);
        onDelete(postId);
        onClose();
      } else {
        throw new Error(`Failed to delete post. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay-menu" onClick={onClose}>
      <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
        {postOwner && (
          <>
            <button className="menu-item">Edit</button>
            <button className="menu-item" onClick={handleDelete}>Delete</button>
          </>
        )}
        <button className="menu-item">Bookmark</button>
        <button className="menu-item">Report</button>
      </div>
    </div>
  );
}