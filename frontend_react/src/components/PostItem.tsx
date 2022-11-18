import { count } from "console";
import e from "express";
import React, { useEffect, useState } from "react";
import "./../css/Font.css"
import "./../css/Post_Item.css"

const Post_Item = (props:{key: string,ID: string, Title: string, Text: string, Votes: number}) => {
    
    const [voteState, setVote] = useState("neutral");
    const [voteCount, setCount] = useState(()=>{return props.Votes})
    const [render, setrender] = useState(1);

    useEffect(()=>{(document.getElementById(props.ID+"votecount") as HTMLDivElement).innerHTML = JSON.stringify(voteCount);}, [voteCount])

    function voteChange(event:React.MouseEvent<HTMLElement>){
        
        document.getElementById(props.ID+"upvote")?.classList.replace("filled", "hollow")
        document.getElementById(props.ID+"downvote")?.classList.replace("filled", "hollow")

        const voteElement = (event.target as HTMLButtonElement);
        if(voteElement.classList.contains("upvote")){   
            switch(voteState){
                case "neutral": setCount(voteCount+1); voteElement.classList.replace("hollow", "filled"); setVote("upvoted");break;
                case "upvoted": setCount(voteCount-1); voteElement.classList.replace("filled", "hollow"); setVote("neutral");break;
                case "downvoted": setCount(voteCount+2); voteElement.classList.replace("hollow", "filled"); setVote("upvoted");
            }
        }
        if(voteElement.classList.contains("downvote")){      
            switch(voteState){    
                case "neutral": setCount(voteCount-1); voteElement.classList.replace("hollow", "filled"); setVote("downvoted");break;
                case "upvoted": setCount(voteCount-2);voteElement.classList.replace("hollow", "filled"); setVote("downvoted");break;
                case "downvoted": setCount(voteCount+1); voteElement.classList.replace("filled", "hollow"); setVote("neutral");
            }
        }
    }   
    return (
        <div className= "post-item">
            <div  className="inline post-item-sub-icon" />
            <div className="post-item-subreddit">r/subreddit</div>
            <div className="post-item-title">{props.Title}</div>
            <img src="" alt="" className="post-item-img" />
            <div className="post-item-details">
                <input type={"button"} className="inline small-icon upvote hollow" id={props.ID + "upvote"} onClick={voteChange}/>
                <div className="inline vote-count" id={props.ID + "votecount"}></div>
                <div className="inline small-icon downvote hollow" id={props.ID + "downvote"} onClick={voteChange}></div>
                <div className="inline awards-icon">|+|</div>
            </div>
        </div>        
    )
}

export default Post_Item;