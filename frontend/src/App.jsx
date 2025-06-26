import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import PostPage from './components/PostPage';
import {createBrowserRouter, RouterProvider} from 'react-router';

export const category = {
  "All": 0,
  "Electronics": 1,
  "Transportation": 2,
  "Kitchen": 3,
  "Bedroom": 4,
  "Toys/Collectibles": 5,
  "Bathroom": 6,
  "Clothing": 7,
  "Furniture": 8,
  "Decor": 9,
  "Other": 10,
}
export const categoryArr = Object.keys(category);

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
