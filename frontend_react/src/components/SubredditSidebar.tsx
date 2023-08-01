import React, { useState } from "react";

import "../css/SubredditHome.css"
import { loginContext } from "../App";
import { join} from "../util/utilFuncs"
import { useContext } from "react";
import { verifyLogin } from "./Head";
import { subreddit } from "./PostsList";


const SubredditSidebar = (props:{subData: subreddit, memberStatus: boolean, user_id: number}) => {
    const { loginFormState, toggleLoginForm } = useContext(loginContext);

    return (
        <div id="subreddit-sidebar">
            <div className="subreddit-sidebar-item" id="subreddit-sidebar-title">Welcome to {props.subData.title}</div>
            <hr className="subreddit-sidebar-hr" />
            <div className="subreddit-sidebar-item">Created: {new Date(props.subData.creation_date).toLocaleDateString()}</div>
            <div className="subreddit-sidebar-item">Members: {props.subData.members}</div>
            <hr className="subreddit-sidebar-hr" />
            <button className="subreddit-sidebar-button button" id="sidebar-post" onClick={(e) => { if (verifyLogin(e, toggleLoginForm)) window.location.href = "/subreddit/" + props.subData.id! + "/createPost" }}>Create Post</button>
            <button className="subreddit-sidebar-button button join" id="sidebar-join" onClick={() => { 
                if (!document.cookie.includes("refreshTokenExists")) {
                    toggleLoginForm(true)
                    return;
                }
                join(props.subData.id!, props.user_id ) 
                }}>Join</button>
        </div>
    )
}

export default SubredditSidebar;