import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <div>
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
