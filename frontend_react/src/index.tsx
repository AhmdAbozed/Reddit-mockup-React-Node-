import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CreatePost from './components/CreatePost';
import reportWebVitals from './reportWebVitals';
import {  createBrowserRouter, RouterProvider, Route  } from "react-router-dom";
import PostsList from './components/PostsList';
import SubredditsList from './components/SubredditsList';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path: "/",
        element: <SubredditsList/>
      },
      {
        path: "/subreddit/:id",
        element: <PostsList/>
      }
    ]
  },  
  {
    path: "/subreddit/:id/createPost",
    element: <CreatePost/>
  },
  
]);


const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>  
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals()
