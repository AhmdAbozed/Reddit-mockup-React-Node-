import { url } from "inspector";
import { useParams } from "react-router-dom"
import React, { useState } from "react"
import cookieUtils from "../util/AccessControl";
import "./../css/Head.css"

const cookieFuncs = new cookieUtils();

export const verifyLogin = (e: any, toggleLogin: any) => {
    if (document.cookie.includes("refreshTokenExists")) {
        return true;
    }
    e.preventDefault()
    toggleLogin(true)
    return false;
}

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
            if (true) {
                return <a href={"/subreddit/" + id + "/createPost"} className="head-item head-button" id="new-post-button" onClick={(e) => verifyLogin(e, props.toggleLoginForm)} />;
            }
        }
        else {
            return;
        }
    }

    //React.MouseEventHandler doesn't work, didn't search it but it's not worth the trouble


    const renderLoginButton = () => {
        if (!(cookieFuncs.hasRefreshToken())) {
            return <input type="button" className="head-item head-button" id="signin-button" aria-label="sign in" value={"Log In"} onClick={
                () => {
                    props.toggleLoginForm(true)
                }
            } />
        }
    }
    const signOut = async () => {
        const options = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
            credentials: "include",
        }
        //@ts-ignore
        const res = await fetch("http://" + window.location.hostname + ":3003/users/signout", options);
        console.log(res.status)
        if (res.status == 200) {
            console.log("Signed Out")
            window.location.reload()
        }
        else {
            console.log("Si")
        }
    }
    const renderSignoutButton = () => {
        if ((cookieFuncs.hasRefreshToken())) {
            return <input type="button" className="head-item head-button" id="signout-button" aria-label="sign in" value={"Sign Out"} onClick={signOut} />
        }

    }

    return (
        <div id="head-parent">
            <header id="head">
                <div className="head-item" id="logo"><a href="/" className="anchor"><span /></a></div>
                <div className="head-item dropdown" id="communities-dropdown" hidden>-communities dropdown-</div>
                <input type="text" className="head-item" id="head-search" placeholder="Search.." />
                <input type="button" className="head-item head-button" id="use-app-button" value={"Use App"} />
                {renderLoginButton()}
                {renderSignoutButton()}
                {renderPostCreation()}
                <input type="button" className="head-item head-button" id="sidebar-button" onClick={
                    () => {

                        document.getElementsByTagName("body")[0].removeAttribute("style")
                        console.log("clicked: " + props.toggleSidebar); props.toggleSidebar(!props.sidebarState)
                    }
                } />
            </header>
        </div>
    )
}

export default Head