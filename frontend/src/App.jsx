import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import PostPage from './components/PostPage';
import {createBrowserRouter, RouterProvider} from 'react-router';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <PostPage/>,
    errorElement: <div>404 Not Found</div>
  },
]);

function App() {
  return (
    <div className="app">
      <Header/>
      <main>
        <RouterProvider router={routes} />
      </main>
      <Footer/>
    </div>
  )
}

export default App
