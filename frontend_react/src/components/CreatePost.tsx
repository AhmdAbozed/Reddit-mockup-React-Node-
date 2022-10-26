import React, { useState } from "react";
import "./../css/CreatePost.css"
const CreatePost = () => {
    
    const submitPost = async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const target = event.target as any
        const submission = {Title: target.title.value, Text: target.text.value}
        const options = {
            method: "POST",
            headers:{
    
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        }
        const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/posts", options);
        if(resp.status == 200){
            console.log("Mission success. 200")
        }
    }

    const togglePostButton = ()=>{
        
    }

    return (
        <form id="create-post" action="" method="post" onSubmit={submitPost}>
            <div className="create-post-item" id="create-post-head">
                <a id="create-post-cancel" href="/"/>
                <div id="create-post-title">Text</div>
                <button id="create-post-submit">POST</button>
            </div>
            <div id="create-post-item-container">
                <div id="create-post-subreddit-icon"></div>
                <div className="create-post-item" id="create-post-subreddit">r/subreddit</div>
                <input className="create-post-item" type={"text"} name="title" id="create-post-title-input" placeholder="Add an interesting title"></input>
                <textarea className="create-post-item" cols={1} rows={1} name="text" id="create-post-desc-input" placeholder="Add your text..."></textarea>
            </div>
        </form>
    )
}

export default CreatePost