import React, { useEffect, useState } from "react";
import "./../css/Font.css"
import "./../css/Post_Item.css"

const Subreddit_Item = (props:{key: string,ID: string, Title: string, Members: string}) => {

    //href={"/subreddit/"+props.ID}

    return (        
        <div className= "post-item" onClick={(e)=>{if(window.getSelection()?.toString().length === 0)window.location.href = "/subreddit/"+props.ID}}>
            {/*using anchors prevents text selection*/}
            <div className="inline post-item-sub-icon" />
            <div className="post-item-subreddit">r/subreddit</div>
            <div className="post-item-title">r/SUBREDDIT</div>
            <img src="" alt="" className="post-item-img" />
            <div className="post-item-details"></div>
        </div>        
    )
}

export default Subreddit_Item;