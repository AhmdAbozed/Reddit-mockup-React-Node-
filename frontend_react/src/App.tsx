import React, { useState, useEffect } from "react";
import Head from "./components/Head";
import Sidebar from "./components/sidebar";
import PostsList from "./components/PostsList";
import SubredditsList from "./components/SubredditsList";
import "./css/App.css"
import { Outlet } from "react-router-dom";
import LogInForm from "./components/LogInForm";
const App =  () => {
  const [sidebarState, toggleSidebar] = useState(false);
  const [loginFormState, toggleLoginForm] = useState(false);
  const [subredditState, setSubredditState] = useState(-1)
  const renderSidebar = () => {
    if (sidebarState) {
      return <Sidebar />;
    }
    else return;
  }
  const renderLoginForm = () => {
    if (loginFormState) {
      return <LogInForm toggleLoginForm={toggleLoginForm} loginFormState={loginFormState} />;
    }
    else return;
  }
 

  return (
    <div>

      <Head toggleSidebar={toggleSidebar} toggleLoginForm={toggleLoginForm} sidebarState={sidebarState} subredditId={subredditState} />
      {renderSidebar()}
      {renderLoginForm()}
      <div className="posts-list">
        <Outlet context={[subredditState, setSubredditState]}/>
      </div>

    </div>
  )
}

export default App;
