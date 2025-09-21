import './HomePage.css'
import { Header } from '../components/Header'
import { SideBar } from '../components/SideBar';

export function HomePage() {
  return (
    <>
      <title>Social App</title>

      <Header />
      <SideBar />
    </>
  );
}