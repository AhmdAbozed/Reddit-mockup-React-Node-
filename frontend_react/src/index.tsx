import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CreatePost from './components/CreatePost';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PostsList from './components/PostsList';
import SubredditsList from './components/SubredditsList';
import {AccessControl} from './util/AccessControl';
import cookieUtils from './util/AccessControl';
const cookieFuncs = new cookieUtils();
//See below for a different routing method with same results
const appChildren: Array<object> = [
  {
    path: "",
    element: <SubredditsList/>
  },
  {
    path: "subreddit/:id",
    element: <PostsList/>
  }
] 
const router = createBrowserRouter([
  {
    path: "/",
    element: <App loginOn={false}/>,
    children:appChildren
  },
  {
    path: "/login",
    element: <App loginOn={true}/>,
    children:appChildren
  },  
  {
    path: "/subreddit/:id/createPost",
    element: <AccessControl child = {<CreatePost/>}/>
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals()

export default router

/*
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}>
        <Route path="/" element={<SubredditsList/>}/>
        <Route path='/subreddit/:id' element={<PostsList/>}/>
      </Route>
      <Route path='/subreddit/:ids/createPost' element={<CreatePost/>}/>
    </Route>
  )
);
*/