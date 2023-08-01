import React, { useState, useEffect, Children, ReactElement, useContext } from "react";
import { useParams } from "react-router-dom";
import { comment } from "./PostPage";
import "../css/CreateForm.css";
import { submitComment } from "../util/utilFuncs";
import { loginContext } from "../App";

const Comment = (props: { ID: number, parent_id: number | null, text: string, commentsData: Array<comment>, voteStatus: number, votes: number }) => {
    const [buttonState, setButtonState] = useState([0, 0]);
    const [replyVisibilityState, setReplyVisibility] = useState(true)
    const [repliesState, setRepliesState] = useState<Array<ReactElement>>()
    const [voteCount, setCount] = useState(props.votes)

    const [voteState, setVote] = useState(props.voteStatus);
    console.log("votestate " + voteState)
    const { loginFormState, toggleLoginForm } = useContext(loginContext);
    let { id, post_id } = useParams();
    if (voteState == 1) { document.getElementById(props.ID + "commentUpvote")?.classList.replace("hollow", "filled"); }
    else if (voteState == -1) { document.getElementById(props.ID + "commentDownvote")?.classList.replace("hollow", "filled") }


    useEffect(() => {
        //        const replies = props.commentsData.map((reply: comment) => {

        const replies: Array<comment> = [];
        props.commentsData.forEach(reply => {
            if (props.ID == reply.parent_id)
                replies.push(reply);
        })
        const replyElements = replies.map((reply: comment) => {
            return <Comment key={JSON.stringify(reply.id)} ID={reply.id} parent_id={reply.parent_id} text={reply.text} commentsData={props.commentsData} voteStatus={reply.voteStatus} votes={reply.votes} />
        })
        setRepliesState(replyElements)
    }, [])
    useEffect(() => {
        (document.getElementById(props.ID + "commentVotecount") as HTMLDivElement).innerHTML = JSON.stringify(voteCount);

    }, [voteCount])
    const vote = async (vote: number) => {
        if (!document.cookie.includes("refreshTokenExists")) {
            toggleLoginForm(true);
            return;
        }
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const user_id = decodeURIComponent(document.cookie)[decodeURIComponent(document.cookie).lastIndexOf("user_id") + 9]
        console.log("props.ID: " + props.ID)
        const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/subreddits/" + id + "/posts/" + post_id + "/comments/vote?user_id=" + user_id + "&vote=" + vote + "&comment_id=" + props.ID, options);
        const data = await resp.json()
        if (resp.status == 200) {

            console.log("Voted, 200")
        }
        //const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/members?"+ new URLSearchParams({member_id: }), options);
        //const data = await resp.json()
    }

    function voteChange(event: React.MouseEvent<HTMLElement>) {
        if (!document.cookie.includes("refreshTokenExists")) {
            console.log("NOT LOGGED IN")
            toggleLoginForm(true);
        }
        const voteElement = (event.target as HTMLButtonElement);


        document.getElementById(props.ID + "commentUpvote")?.classList.replace("filled", "hollow")
        document.getElementById(props.ID + "commentDownvote")?.classList.replace("filled", "hollow")

        //update vote state on the client-side, send the applied vote state to the backend to update using vote()
        if (voteElement.classList.contains("upvote")) {
            console.log("you clicked upvote " + "Initial vote: " + voteState)
            //you clicked upvote
            switch (voteState) {
                case 0: vote(1); setCount(voteCount + 1); voteElement.classList.replace("hollow", "filled"); setVote(1); break;
                case 1: vote(0); setCount(voteCount - 1); voteElement.classList.replace("filled", "hollow"); setVote(0); break;
                case -1: vote(1); setCount(voteCount + 2); voteElement.classList.replace("hollow", "filled"); setVote(1);//2
            }
        }
        if (voteElement.classList.contains("downvote")) {
            //you clicked downvote
            console.log("you clicked downvote " + "Initial vote: " + voteState)
            switch (voteState) {
                case 0: vote(-1); setCount(voteCount - 1); voteElement.classList.replace("hollow", "filled"); setVote(-1); break;//1
                case 1: vote(-1); setCount(voteCount - 2); voteElement.classList.replace("hollow", "filled"); setVote(-1); break;
                case -1: vote(0); setCount(voteCount + 1); voteElement.classList.replace("filled", "hollow"); setVote(0);
            }
        }


    }

    return (

        <div className={"comment p" + props.parent_id} id={`${props.ID}`}>
            <div className="inline post-item-sub-icon" />

            <div className="post-item-op">{"u/"}</div>

            <div className="post-item-title">{props.text}</div>

            <div className="post-item-details">
                <input type={"button"} className="inline small-icon upvote hollow" id={props.ID + "commentUpvote"} onClick={voteChange} />
                <div className="inline vote-count" id={props.ID + "commentVotecount"}></div>
                <input type={"button"} className="inline small-icon downvote hollow" id={props.ID + "commentDownvote"} onClick={voteChange} />
                <div className="inline awards-icon">|+|</div>
                <button id="replyButton" onClick={() => { setReplyVisibility(false) }}>Reply</button>
                <form id="replyForm" hidden={replyVisibilityState} onSubmit={async (e) => {

                    const result = await submitComment(e, props.ID, Number(id), Number(post_id))
                    if (result) {

                        (e.target as HTMLFormElement).children[0].innerHTML = "Failed to submit reply";
                        //e.target as HTMLElement).setAttribute("hidden", "true");
                        setReplyVisibility(true)
                    } else {
                        (e.target as HTMLFormElement).children[0].innerHTML = "Failed to submit reply"
                    }
                }}>
                    <div></div>
                    <input type="text" id="replyInput" name="comment" placeholder="Type your Reply..." />
                    <div id="replyButtonsWrapper">
                        <input type="submit" className="replyInputButton" id="replySubmit" value={"Submit"} ></input>
                        <input type="button" className="replyInputButton" id="replyCancel" value={"Cancel"} onClick={() => { setReplyVisibility(true) }}></input>
                    </div>
                </form>
            </div>
            {repliesState}
        </div>
    )
}

export default Comment