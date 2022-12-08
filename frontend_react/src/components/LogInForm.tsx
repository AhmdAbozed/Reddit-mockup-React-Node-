import { useParams } from "react-router-dom"
import React, { useState } from "react";
import "./../css/SignInForm.css"
const SignInForm = (props: {
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
    loginFormState: boolean;
}) => {
  
    const [formState, setForm] = useState("login");
    
    const formHandler = ()=> {
        const renderLogIn = ()=>{
            return <form id="signin-form">
                <input type="button" id="signin-cancel" onClick={()=>{props.toggleLoginForm(false)}}/>
                <div id="signin-info">
                    <h2>Log In</h2>
                    <p>By continuing, you agree to our <a href="">User Agreement</a> and <a href="">Privacy Policy</a>.</p>
                </div>
                <div className="container-input">
                    <input key="1" type="text" className="signin-inputs" id="input-username" required />
                    <span className="custom-placeholder" id="custom-placeholder-username" onClick={() => { console.log("clicked"); document.getElementById("input-username")?.focus() }}>Username</span>
                </div>
                <div className="container-input">
                    <input type="text" className="signin-inputs" id="input-password" required />
                    <span className="custom-placeholder" id="custom-placeholder-password" onClick={() => { console.log("clicked"); document.getElementById("input-password")?.focus() }}>Password</span>
                </div>
                <input type="submit" value="Log In" id="signin-submit" />
                <div id="signup-prompt" >New to Reddit? <a href="" onClick={(e)=>{e.preventDefault();setForm("emailsignup")}}>Sign up</a></div>
            </form>
        }

        const renderEmailSignUp = ()=>{
           return <form id="signin-form">
                <input key="2" type="button" id="signin-cancel" onClick={()=>{props.toggleLoginForm(false)}}/>
                <div id="signin-info">
                    <h2>Sign Up</h2>
                    <p>By creating an account, you agree to our <a href="">User Agreement</a> and <a href="">Privacy Policy</a>.</p>
                </div>
                <div className="container-input">
                    <input type="text" className="signin-inputs" id="input-email" required />
                    <span className="custom-placeholder" id="custom-placeholder-email" onClick={() => { console.log("clicked"); document.getElementById("input-email")?.focus() }}>Email</span>
                </div>
                <input type="submit" value="Continue" id="signin-submit" onClick={(e)=>{e.preventDefault();setForm("signup")}} />
                <div id="signup-prompt">Already a Redditor? <a href="" onClick={(e)=>{e.preventDefault();setForm("login")}}>Log In</a></div>
            </form>
        }

        const renderSignUp = ()=>{
            return <form id="signin-form">
                <input type="button" id="signin-cancel" onClick={()=>{props.toggleLoginForm(false)}}/>
                <div id="signin-info">
                    <h2>Sign Up</h2>
                    <p>By creating an account, you agree to our <a href="">User Agreement</a> and <a href="">Privacy Policy</a>.</p>
                </div>
                <div className="container-input">
                    <input key="3" type="text" className="signin-inputs" id="input-username" required />
                    <span className="custom-placeholder" id="custom-placeholder-username" onClick={() => { console.log("clicked"); document.getElementById("input-username")?.focus() }}>Username</span>
                </div>
                <div className="container-input">
                    <input key="4" type="text" className="signin-inputs" id="input-password" required />
                    <span className="custom-placeholder" id="custom-placeholder-password" onClick={() => { console.log("clicked"); document.getElementById("input-password")?.focus() }}>password</span>
                </div>
                
                <input type="submit" value="Sign Up" id="signin-submit" />
                <div id="signup-prompt">Already a Redditor? <a href="" onClick={(e)=>{e.preventDefault();setForm("login")}}>Log In</a></div>
            </form>
        }

        switch(formState){
            case "login": return renderLogIn();break;
            case "emailsignup": return renderEmailSignUp();break;
            case "signup": return renderSignUp();
        }

        }
    return (
        <div id="signin-component">
            <div className="dark-background"/>
            {formHandler()}
        </div>

    )
}

export default SignInForm;