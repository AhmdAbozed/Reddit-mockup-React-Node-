import { url } from "inspector";
import {useParams} from "react-router-dom"
import React, { useState } from "react";
import "./../css/Head.css"
const Head = (props: { 
    toggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarState: boolean;
    subredditId: number;
     }) => {
    let { id } = useParams();  
    const renderHead = () => {
        if (Number(id)) {
            return <a href={"/subreddit/"+id+"/createPost"} className="head-item head-button" id="new-post-button" />;
        }
        else {
            return;
        }

    }

    return (
        <div id="head-parent">
            <header id="head">
                <div className="head-item" id="logo"><a href="/" className="anchor"><span/></a></div>
                <div className="head-item dropdown" id="communities-dropdown" hidden>-communities dropdown-</div>
                <input type="button" className="head-item head-button" id="use-app-button" value={"Use App"} />
                <input type="button" className="head-item head-button" id="signin-button" aria-label="sign in" value={"Log In"} onClick={
                    () => {
                        console.log("clicked: " + props.toggleLoginForm); props.toggleLoginForm(true)
                    }
                }/>
                {renderHead()}
                <input type="button" className="head-item head-button" id="sidebar-button" onClick={
                    () => {
                        console.log("clicked: " + props.toggleSidebar); props.toggleSidebar(!props.sidebarState)
                    }
                }/>  
            </header>
        </div>
    )
}

export default Head