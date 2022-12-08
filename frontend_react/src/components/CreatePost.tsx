import React, { useState, useEffect,  } from "react";
import { useParams } from "react-router-dom";
import "../css/CreatePost.css";
const CreatePost = () => {
    
    let { id } = useParams();
    console.log("the id inside creatPost is: " + id)  
    const [buttonState, setButtonState] = useState([0,0]);

    useEffect(()=>{
        //sees if all fields are filled to enable button or not
        const buttonElement = document.getElementById("create-post-submit");
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
        console.log("createpost url is: " + window.location.href)
        event.preventDefault();
        const target = event.target as any
        console.log("LOGGING TARGET!!!"+target.elements.desc.value)
        const submission = {Title: target.title.value, Text: target.elements.desc.value}
        
        const options = {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        }

        const resp = await fetch("http://" + window.location.hostname + ":3003/subreddits/"+id+"/posts", options);
        console.log("THE RESPONSE " + JSON.stringify(resp))
        if(resp.status == 200){
            console.log("Mission success. 200")
        }
        return resp;
    }
  
    return (
        <form id="create-post" action="" method="post" onSubmit={submitPost}>
            <div className="create-post-item" id="create-post-head">
                <a id="create-post-cancel" href="/"/>
                <div id="create-post-title">Text</div>
                <button id="create-post-submit" aria-label="submit post" disabled>POST</button>
            </div>
            <div id="create-post-item-container">
                <div id="create-post-subreddit-icon"></div>
                <div className="create-post-item" id="create-post-subreddit">r/subreddit</div>
                <textarea aria-label="description" className="create-post-item"
                 cols={1} rows={1}
                 name="desc" form="create-post" 
                 id="create-post-desc-input"
                 placeholder="Add your text..."
                 value="hmmsss" 
                 onChange={(e)=>{
                    if(e.target.value !="")setButtonState([buttonState[0], 1])
                    else setButtonState([buttonState[0], 0]);
                 }}
                >
                </textarea>

                <input aria-label="title" className="create-post-item"
                 type={"text"} name="title"
                 id="create-post-title-input"
                 placeholder="Add an interesting title"
                 onChange={(e)=>{
                    if(e.target.value !="")setButtonState([1, buttonState[1]]);
                    else setButtonState([0, buttonState[1]]);}}
                >
                </input>

                
            </div>
            <div data-testid="testElement" onClick={(e)=>{const target = e.target as any; target.innerHTML = "hii"}}>hoo</div>
        </form>
    )
}

export default CreatePost