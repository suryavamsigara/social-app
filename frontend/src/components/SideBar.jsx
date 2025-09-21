import './SideBar.css';

export function SideBar() {
  return (
    <>
      <div className="left-sidebar">
        <div>Home</div>
        <div>Notifications</div>
        <div>Messages</div>
        <div>Profile</div>
      </div>

      <div className="right-sidebar">
        <div>Hey</div>
        <div>Hello</div>
      </div>
    </>
  );
}