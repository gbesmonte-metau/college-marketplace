import "./App.css";
import PostPage from "./components/PostPage";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import { useState, createContext, useEffect } from "react";
import ProfilePage from "./components/ProfilePage";
import RegisterPage from "./components/RegisterPage";
import PostDetails from "./components/PostDetails";
import MyPostsPage from "./components/MyPostsPage";
import OtherProfilePage from "./components/OtherProfilePage";
import LandingPage from "./components/LandingPage";
import ForYouPage from "./components/ForYouPage";
import BudgetBundlesPage from "./components/BudgetBundlesPage";

export const UserContext = createContext();

const routes = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/home",
        element: <PostPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/posts/:id",
        element: <PostDetails />,
      },
      {
        path: "/myposts",
        element: <MyPostsPage />,
      },
      {
        path: "/profile/:id",
        element: <OtherProfilePage />,
      },
      {
        path: "/foryou",
        element: <ForYouPage />,
      },
      {
        path: "/bundles",
        element: <BudgetBundlesPage />,
      },
    ],
  },
]);

function App() {
  const [user, setUser] = useState(null);
  async function getLoggedInUser() {
    const response = await fetch(import.meta.env.VITE_URL + "/user", {
      credentials: "include",
    });
    const result = await response.json();
    if (response.ok) {
      setUser(result);
    }
  }
  useEffect(() => {
    getLoggedInUser();
  }, []);
  return (
    <main>
      <UserContext.Provider value={{ user, setUser }}>
        <RouterProvider router={routes} />
      </UserContext.Provider>
    </main>
  );
}

export default App;
