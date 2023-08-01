import React, { useEffect, useState } from "react";
import "./../css/Font.css"
import "./../css/Post_Item.css"
import { loginContext } from "../App";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import cookieUtils from "../util/AccessControl";
const cookieFuncs = new cookieUtils();

const Post_Item = (props:{key: string,Id: string, Title: string, Text: string, Votes: number, Op_id: number, Op: string, Subreddit: string, voteStatus: number}) => {
    let { id } = useParams();
    console.log("VOTESTATUS: "+ props.voteStatus)
    const [voteState, setVote] = useState(props.voteStatus);
    const [voteCount, setCount] = useState(()=>{return props.Votes})
    const { loginFormState, toggleLoginForm } = useContext(loginContext);
     if(voteState == 1) {document.getElementById(props.Id+"upvote")?.classList.replace("hollow", "filled"); }
    else if(voteState == -1) {document.getElementById(props.Id+"downvote")?.classList.replace("hollow", "filled")}
 


    useEffect(()=>{
        (document.getElementById(props.Id+"votecount") as HTMLDivElement).innerHTML = JSON.stringify(voteCount);
            
    }, [voteCount])
    const vote = async (vote:number)=>{
        if(!document.cookie.includes("refreshTokenExists")){
          toggleLoginForm(true);
          return;
        }
        const options = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
        }
        const user_id = decodeURIComponent(document.cookie)[decodeURIComponent(document.cookie).lastIndexOf("user_id")+9]
        const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/subreddits/"+id+"/posts/"+ props.Id+"/vote?user_id="+user_id+"&vote="+vote, options);
        const data = await resp.json()
        if(resp.status == 200){
          
          console.log("Voted, 200")
        }
        //const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/members?"+ new URLSearchParams({member_id: }), options);
        //const data = await resp.json()
      }
    
    //Vote request is sent to the backend, but vote count is updated by the client code independently.
    //On refresh the updated vote count is fetched from the backend
    //This keeps voting responsive without needing to wait for response. (I also added client code long before backend code)
    function voteChange(event:React.MouseEvent<HTMLElement>){
        if (!document.cookie.includes("refreshTokenExists")) {
            console.log("NOT LOGGED IN")
            toggleLoginForm(true);            
        }
        const voteElement = (event.target as HTMLButtonElement);
        const initialCount = voteCount;
        

        document.getElementById(props.Id+"upvote")?.classList.replace("filled", "hollow")
        document.getElementById(props.Id+"downvote")?.classList.replace("filled", "hollow")

        //update vote state on the client-side, send the applied vote state to the backend to update using vote()
        if(voteElement.classList.contains("upvote")){
            console.log("you clicked upvote "+ "Initial vote: " + voteState)
            //you clicked upvote
            switch(voteState){
                case 0: vote(1); setCount(voteCount+1); voteElement.classList.replace("hollow", "filled"); setVote(1);break;
                case 1: vote(0);setCount(voteCount-1); voteElement.classList.replace("filled", "hollow"); setVote(0);break;
                case -1: vote(1);setCount(voteCount+2); voteElement.classList.replace("hollow", "filled"); setVote(1);//2
            }
        }
        if(voteElement.classList.contains("downvote")){      
            //you clicked downvote
            console.log("you clicked downvote "+ "Initial vote: " + voteState)
            switch(voteState){    
                case 0: vote(-1);setCount(voteCount-1); voteElement.classList.replace("hollow", "filled"); setVote(-1);break;//1
                case 1: vote(-1);setCount(voteCount-2);voteElement.classList.replace("hollow", "filled"); setVote(-1);break;
                case -1: vote(0);setCount(voteCount+1); voteElement.classList.replace("filled", "hollow"); setVote(0);
            }
        }


    }   
    return (
        <div className= "post-item colored" id= {props.Id}>
            <div className="post-item-overlay" onClick={(e)=>{window.location.href =  id+"/post/"+props.Id; }}/>
            <div  className="inline post-item-sub-icon" />
            <div className="post-item-subreddit">r/{props.Subreddit}</div>
            <div className="post-item-op">{"u/"+props.Op}</div>
            
            <div className="post-item-title">{props.Title}</div>
            <img src="" alt="" className="post-item-img" />
            <div className="post-item-details">
                <input type={"button"} className="inline small-icon upvote hollow" id={props.Id + "upvote"} onClick={voteChange}/>
                <div className="inline vote-count" id={props.Id + "votecount"}></div>
                <input type={"button"} className="inline small-icon downvote hollow" id={props.Id + "downvote"} onClick={voteChange}/>
                <div className="inline awards-icon">|+|</div>
            </div>
        </div>        
    )
}

export default Post_Item;