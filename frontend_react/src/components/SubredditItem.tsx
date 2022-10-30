import { count } from "console";
import e from "express";
import React, { useEffect, useState } from "react";
import "./../css/Font.css"
import "./../css/Post_Item.css"

const Subreddit_Item = (props:{key: string,ID: string, Title: string, Members: string}) => {
    
    const [voteState, setVote] = useState("neutral");
    const [voteCount, setCount] = useState(()=>{return 99})

    useEffect(()=>{(document.getElementById(props.ID+"votecount") as HTMLDivElement).innerHTML = JSON.stringify(voteCount);}, [voteCount])

    
    return (
        <div className= "post-item">
            <div  className="inline post-item-sub-icon" />
            <div className="post-item-subreddit">r/subreddit</div>
            <div className="post-item-title">r/SUBREDDIT</div>
            <img src="" alt="" className="post-item-img" />
            <div className="post-item-details"></div>
        </div>        
    )
}

export default Subreddit_Item;