import React, { useState, useEffect } from "react";
import Head from "./components/Head";
import Sidebar from "./components/sidebar";
import PostsList from "./components/PostsList";
import SubredditsList from "./components/SubredditsList";
import "./css/App.css"
const App =  () => {
  const [sidebarState, toggleSidebar] = useState(false);

  const renderSidebar = () => {
    if (sidebarState) {
      return <Sidebar />;
    }
    else return;
  }
 

  return (
    <body>

      <Head toggleSidebar={toggleSidebar} sidebarState={sidebarState} />
      {renderSidebar()}

      <div className="post-item-list">

        <PostsList/>
      </div>

      <div className="subreddits-list">
        <SubredditsList/>
      </div>

    </body>
  )
}

export default App;
