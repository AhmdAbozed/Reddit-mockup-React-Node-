import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CreatePost from './components/CreatePost';
import reportWebVitals from './reportWebVitals';
import {  createBrowserRouter, RouterProvider, Route  } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/test",
    element: <CreatePost/>
  }
]);

const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false }
];


const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>  
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals()
