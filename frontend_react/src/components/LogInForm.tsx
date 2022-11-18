import { useParams } from "react-router-dom"
import React, { useState } from "react";
import "./../css/SignInForm.css"
const SignInForm = (props: {
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
    loginFormState: boolean;
}) => {
    let { id } = useParams();

    return (
        <div id="signin-component">
            <div className="dark-background"/>
            <form id="signin-form">
                <input type="button" id="signin-cancel" onClick={()=>{props.toggleLoginForm(false)}}/>
                <div id="signin-info">
                    <h2>Log In</h2>
                    <p>By continuing, you agree to our <a href="">User Agreement</a> and <a href="">Privacy Policy</a>.</p>
                </div>
                <div className="container-input">
                    <input type="text" className="signin-inputs" id="input-username" required />
                    <span className="custom-placeholder" id="custom-placeholder-username" onClick={() => { console.log("clicked"); document.getElementById("input-username")?.focus() }}>Username</span>
                </div>
                <div className="container-input">
                    <input type="text" className="signin-inputs" id="input-password" required />
                    <span className="custom-placeholder" id="custom-placeholder-password" onClick={() => { console.log("clicked"); document.getElementById("input-password")?.focus() }}>Password</span>
                </div>
                <input type="submit" value="Log In" id="signin-submit" />
                <div id="signup-prompt">New to Reddit? <a href="">Sign up</a></div>
            </form>
        </div>

    )
}

export default SignInForm;