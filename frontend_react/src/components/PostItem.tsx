import React, { useEffect, useState } from "react";
import "./../css/Font.css"
import "./../css/Post_Item.css"

const Post_Item = (props:{key: string,Id: string, Title: string, Text: string, Votes: number, Op_id: number, Op: string}) => {
    
    const [voteState, setVote] = useState("neutral");
    const [voteCount, setCount] = useState(()=>{return props.Votes})
    
    useEffect(()=>{(document.getElementById(props.Id+"votecount") as HTMLDivElement).innerHTML = JSON.stringify(voteCount);}, [voteCount])

    function voteChange(event:React.MouseEvent<HTMLElement>){
        
        document.getElementById(props.Id+"upvote")?.classList.replace("filled", "hollow")
        document.getElementById(props.Id+"downvote")?.classList.replace("filled", "hollow")

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
            <div className="post-item-op">{"u/"+props.Op}</div>
            
            <div className="post-item-title">{props.Title}</div>
            <img src="" alt="" className="post-item-img" />
            <div className="post-item-details">
                <input type={"button"} className="inline small-icon upvote hollow" id={props.Id + "upvote"} onClick={voteChange}/>
                <div className="inline vote-count" id={props.Id + "votecount"}></div>
                <div className="inline small-icon downvote hollow" id={props.Id + "downvote"} onClick={voteChange}></div>
                <div className="inline awards-icon">|+|</div>
            </div>
        </div>        
    )
}

export default Post_Item;