import { useParams } from "react-router-dom"
import React, { useState } from "react";
import "./../css/LogInForm.css"
const SignInForm = (props: {
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
    loginFormState: boolean;
}) => {
  
    const [formState, setForm] = useState("login");
    const [emailState, setEmail] = useState("");
    
    const submitForm = async (event: React.FormEvent<HTMLFormElement>)=>{

        event.preventDefault();
        const target = event.target as any
        const submission = {Username: target.elements.username.value, Password: target.elements.password.value, Email: emailState}
        const regex = /^\w{4,20}$/
        const userValidation = regex.exec(submission.Username)
        const passValidation = regex.exec(submission.Password)
        
        let endpoint;
        console.log(target.id)
        if(target.id == "signin-form"){endpoint = "users/signin"}
        else {endpoint = "users/signup"}
        
        if(userValidation&&passValidation){
            const options = {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submission)
            }
            
            const res = await fetch("http://" + window.location.hostname + ":3003/"+endpoint, options);
            console.log(res.status)
            const resJSON = await res.json()
            console.log("resJSON" + JSON.stringify(resJSON))
            if(res.status == 200 ){
                console.log("Mission success. 200")
                document.getElementById("result")!.innerHTML = "200. Response recieved"
            }
            else{
                document.getElementById("result")!.innerHTML = resJSON    
            }
            return res;
        }
        else{
            if(!userValidation){
                document.getElementById("invalid-username-prompt")!.hidden = false;
                document.getElementById("input-username")?.classList.add("invalid-input")
            } else {
                document.getElementById("invalid-username-prompt")!.hidden = true;
                document.getElementById("input-username")?.classList.remove("invalid-input")
                
            } 
            if(!passValidation){
                document.getElementById("invalid-password-prompt")!.hidden = false;
                document.getElementById("input-password")?.classList.add("invalid-input")
            } else{
                document.getElementById("invalid-password-prompt")!.hidden = true;
                document.getElementById("input-password")?.classList.remove("invalid-input")
            
            } 
        }
        
    }

    const formHandler = ()=> {
        const renderLogIn = ()=>{
            return <form className="user-form" id="signin-form" onSubmit={submitForm}>
                <input type="button" id="signin-cancel" onClick={()=>{props.toggleLoginForm(false)}}/>
                
                <div id="signin-info">
                    <h2>Log In</h2>
                    <p>By continuing, you agree to our <a href="">User Agreement</a> and <a href="">Privacy Policy</a>.</p>
                </div>
                
                <div className="container-input">
                    <input key="1" type="text" name="username" className="signin-inputs" id="input-username" required />
                    <label
                     htmlFor="input-username" 
                     className="custom-placeholder" 
                     id="custom-placeholder-username" 
                     onClick={() => { console.log("clicked"); document.getElementById("input-username")?.focus() }}
                    >Username</label>
                </div>

                <div className="container-input">
                    <input type="text" name="password" className="signin-inputs" id="input-password" required />
                    <label
                     htmlFor="input-password"
                     className="custom-placeholder"
                     id="custom-placeholder-password" 
                     onClick={() => { console.log("clicked"); document.getElementById("input-password")?.focus() }}
                     >Password</label>
                </div>

                <div id="invalid-prompts-container">
                    <div id="invalid-username-prompt" className="invalid-prompt" hidden>Username must be 4-20 non-special characters</div>
                    <div id="invalid-password-prompt" className="invalid-prompt" hidden>Password must be 4-20 non-special characters</div>
                </div>
                
                <input type="submit" value="Log In" id="signin-submit" aria-label="signin submit" />
                <div id="signup-prompt" >New to Reddit? <a href="" aria-label="sign up" onClick={(e)=>{e.preventDefault();setForm("emailsignup")}}>Sign up</a></div>
                <div data-testid="result" id="result">
                    placeholder for testing
                </div>
            </form>
        }

        const renderEmailSignUp = ()=>{
           return <form className="user-form">
                <input key="2" type="button" id="signin-cancel" onClick={()=>{props.toggleLoginForm(false)}}/>
                
                <div data-testid="result" id="result">
                    placeholder for testing
                </div>

                <div className="container-input">
                        <input type="text" className="signin-inputs" id="input-email" required />
                    <label htmlFor="input-email" className="custom-placeholder" id="custom-placeholder-email" onClick={() => { console.log("clicked"); document.getElementById("input-email")?.focus() }}>Email</label>
                </div>
                <div id="invalid-email-prompt" hidden>Invalid Email.</div>
                
                <input type="submit" value="Continue" id="signin-submit" aria-label="submit email" onClick={(e)=>{
                    e.preventDefault();
                    const emailRegex = /^(\w+)\@\w+.com$/
                    const validation = emailRegex.exec((document.getElementById("input-email") as HTMLInputElement).value)
                    console.log(validation)
                    if(validation){
                        setEmail((document.getElementById("input-email") as HTMLInputElement).value);
                        setForm("signup")
                    }
                    else{
                        document.getElementById("invalid-email-prompt")!.hidden = false;
                    }
                    }
                    } />
                <div id="signup-prompt">Already a Redditor? <a href="" onClick={(e)=>{e.preventDefault();setForm("login")}}>Log In</a></div>
            </form>
        }

        const renderSignUp = ()=>{
            return <form className="user-form" id="signup-form" onSubmit={submitForm}>
                <input type="button" id="signin-cancel" onClick={()=>{props.toggleLoginForm(false)}}/> 
                
                <div id="signin-info">
                    <h2>Sign Up</h2>
                    <p>By creating an account, you agree to our <a href="">User Agreement</a> and <a href="">Privacy Policy</a>.</p>
                </div>

                <div className="container-input">
                    <input key="3" type="text" className="signin-inputs" id="input-username" name="username" required />
                    <label htmlFor="input-username" className="custom-placeholder" id="custom-placeholder-username" onClick={() => { console.log("clicked"); document.getElementById("input-username")?.focus() }}>Username</label>
                </div>
               
                <div className="container-input">
                    <input key="4" type="password" className="signin-inputs" id="input-password" name="password" required />
                    <label htmlFor="input-password" className="custom-placeholder" id="custom-placeholder-password" onClick={() => { console.log("clicked"); document.getElementById("input-password")?.focus() }}>Password</label>
                </div>
                <div id="invalid-prompts-container">
                    <div id="invalid-username-prompt" className="invalid-prompt" hidden>Username must be 4-20 non-special characters</div>
                    <div id="invalid-password-prompt" className="invalid-prompt" hidden>Password must be 4-20 non-special characters</div>
                </div>
                <input type="submit" value="Sign Up" id="signin-submit" aria-label="signup submit" />
                <div id="signup-prompt">Already a Redditor? <a href="" onClick={(e)=>{e.preventDefault();setForm("login")}}>Log In</a></div>
                <div data-testid="result" id="result">
                    placeholder for testing
                </div>
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