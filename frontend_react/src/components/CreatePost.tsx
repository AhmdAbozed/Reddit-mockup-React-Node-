import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/CreateForm.css";

const CreatePost = () => {
    
    let { id } = useParams();
    
    const [buttonState, setButtonState] = useState([0,0]);

    useEffect(()=>{
        //sees if all fields are filled to enable button or not
        const buttonElement = document.getElementById("create-form-submit");
        if(buttonState[0] == 1 && buttonState[1] == 1){
            buttonElement!.removeAttribute("disabled")
            buttonElement!.setAttribute("style", "background-color: rgb(110,110,110)")
        }
        else{
            buttonElement!.toggleAttribute("disabled")
            buttonElement!.setAttribute("style", "background-color: rgb(222, 222, 222)")    
        }
    },[buttonState])

    const submitPost = async (event: React.FormEvent<HTMLFormElement>)=>{
        console.log("the id inside creatPost is: " + id)  
        console.log("createpost url is: " + window.location.href)
        event.preventDefault();
        const target = event.target as any
        const submission = {Title: target.elements.title.value, Text: target.elements.desc.value}
        
        const options = {
            method: "POST",
            credentials: "include",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        }
        //@ts-ignore
        const resp = await fetch("http://" + window.location.hostname + ":3003/subreddits/"+id+"/posts", options);
        console.log("about to resp.json")
        if(resp.status == 200){
            console.log("Created post successfully. 200")
            document.getElementById("result")!.innerHTML = "200. Response recieved"
        }
        else if(resp.status == 404 || resp.status == 401){
            window.location.href = "/login"
            //document.getElementById("result")!.innerHTML = "ERROR" + resp.status
        }
        return resp;
    }
  
    return (
        <form id="create-form" action="" method="post" onSubmit={submitPost}>
            <div className="create-form-item gray-border-bottom " id="create-form-head">
                <a id="create-form-cancel" href={"/subreddit/" + id}/>
                <div className="gray " id="create-form-title">Text</div>
                <button id="create-form-submit" aria-label="submit post" disabled>POST</button>
            </div>
            <div id="create-form-item-container">
                <div id="create-form-subreddit-icon"></div>
                <div className="create-form-item" id="create-form-subreddit">r/subreddit</div>
                <textarea aria-label="description" className="create-form-item"
                 cols={1} rows={1}
                 name="desc" form="create-form" 
                 id="create-form-desc-input"
                 placeholder="Add your text..."
                 
                 onChange={(e)=>{
                    if(e.target.value !="")setButtonState([buttonState[0], 1])
                    else setButtonState([buttonState[0], 0]);
                 }}
                >
                </textarea>

                <input aria-label="title" className="create-form-item"
                 type={"text"} name="title"
                 id="create-form-title-input"
                 placeholder="Add an interesting title"
                 onChange={(e)=>{
                    if(e.target.value !="")setButtonState([1, buttonState[1]]);
                    else setButtonState([0, buttonState[1]]);}}
                >
                </input>

                
            </div>
            <div data-testid="testElement" id="result">hoo</div>
        </form>
    )
}

export default CreatePost