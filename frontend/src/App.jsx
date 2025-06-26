import './App.css'
import PostPage from './components/PostPage';
import {createBrowserRouter, RouterProvider} from 'react-router';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import {useState, createContext, useEffect} from 'react';
import ProfilePage from './components/ProfilePage';

export const UserContext = createContext();

const routes = createBrowserRouter([
  {
    element: <Layout/>,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        path: '/',
        element: <PostPage/>
      },
      {
        path: '/profile',
        element: <ProfilePage/>
      },
      {
        path: '/login',
        element: <LoginPage/>
      },
      {
        path: '/register',
        element: <div>register</div>
      }
    ]
  },
]);

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      <main>
        <UserContext.Provider value={{user, setUser}}>
        <RouterProvider router={routes} />
        </UserContext.Provider>
      </main>
    </div>
  )
}

export default App
