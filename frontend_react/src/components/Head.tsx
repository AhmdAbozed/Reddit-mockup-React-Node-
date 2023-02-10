import { url } from "inspector";
import {useParams} from "react-router-dom"
import React, { useState } from "react"
import cookieUtils from "../util/AccessControl";
import "./../css/Head.css"

 const cookieFuncs = new cookieUtils();

const Head = (props: { 
    toggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarState: boolean;
    subredditId: number;
     }) => {
    let { id } = useParams();  
    const renderPostCreation = () => {
        if (Number(id)) {
        console.log()
            if(true){
            return <a href={"/subreddit/"+id+"/createPost"} className="head-item head-button" id="new-post-button" />;
            }
        }
        else {
            return;
        }

    }

    const renderLoginButton = ()=>{
        if(!(cookieFuncs.hasRefreshToken())){
            return   <input type="button" className="head-item head-button" id="signin-button" aria-label="sign in" value={"Log In"} onClick={
            () => {
                props.toggleLoginForm(true)
            }
        }/>
    }
      
    }

    return (
        <div id="head-parent">
            <header id="head">
                <div className="head-item" id="logo"><a href="/" className="anchor"><span/></a></div>
                <div className="head-item dropdown" id="communities-dropdown" hidden>-communities dropdown-</div>
                <input type="text" className="head-item" id="head-search" placeholder="Search.."/>
                <input type="button" className="head-item head-button" id="use-app-button" value={"Use App"} />
                {renderLoginButton()}
                {renderPostCreation()}
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