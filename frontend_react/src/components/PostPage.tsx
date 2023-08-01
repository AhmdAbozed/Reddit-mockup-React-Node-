import React, { useState, useEffect, ReactElement } from "react";
import { useParams } from "react-router-dom";
import "../css/PostPage.css"
import { loginContext } from "../App";
import { useContext } from "react";
import cookieUtils from "../util/AccessControl";
import { verifyMember, getSubreddit, submitComment } from "../util/utilFuncs"
import SubredditSidebar from "./SubredditSidebar";
import { subreddit } from "./PostsList";
import Comment from "./Comment";
const cookieFuncs = new cookieUtils();
export type comment = {
  id: number
  parent_id: number | null
  text: string
  user_id: number
  votes: number
  voteStatus: number
}
const PostPage = () => {

  const defSub: subreddit = { id: -1, title: "", members: 0, creation_date: new Date() }

  const { loginFormState, toggleLoginForm } = useContext(loginContext);

  const [memberState, setMemberState] = useState(false);
  const [subredditState, setSubredditState] = useState(defSub);
  const [commentsState, setComments] = useState<Array<ReactElement>>();

  let { id, post_id } = useParams();
  const user_id = decodeURIComponent(document.cookie)[decodeURIComponent(document.cookie).lastIndexOf("user_id") + 9]
  console.log("post id" + post_id)
  useEffect(() => {

    const checkMember = async () => {
      const MemberStatus = await verifyMember(Number(id), Number(user_id))
      if (MemberStatus) {
        setMemberState(true)
        document.querySelectorAll(".join").forEach(e => { e.setAttribute("hidden", "true") })
      }
      else {
        console.log("Not a member")
        setMemberState(false)
        document.querySelectorAll(".join").forEach(e => { e.removeAttribute("hidden") })
      }
    }

    const setSubredditData = async () => {
      const subredditData = await getSubreddit(Number(id));
      setSubredditState(subredditData)
    }
    const getVotes = async () => {

      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/subreddits/" + id + "/posts/" + post_id + "/comments/votes?user_id=" + user_id, options);
      const data = await resp.json()

      console.log("user votes: " + JSON.stringify(data));
      return data;
    }

    const getComments = async () => {
      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const resp = await fetch("http://" + window.location.hostname + ":3003/subreddits/" + id + "/posts/" + post_id + "/comments", options);
      const data = await resp.json()
      if (resp.status == 200) {
        return data
      }
    }

    const renderComments = async () => {
      const comments = await getComments()

      if (comments) {
        if (document.cookie.includes("refreshTokenExists")) {
          const votes = await getVotes()
          comments.forEach((comment: comment) => {
            comment.voteStatus = 0;
            votes.forEach((voteInstance: any) => {
              if (comment.id == voteInstance.comment_id) { comment.voteStatus = voteInstance.vote; return; }
            });
          });
        }

        const commentElements = comments.map((comment: comment) => {
          if (!comment.parent_id) return (<Comment key={JSON.stringify(comment.id)} ID={comment.id} parent_id={comment.parent_id} text={comment.text} commentsData={comments} voteStatus={comment.voteStatus} votes={comment.votes} />)
        })
        setComments(commentElements)
      }
      else {
        setComments([<p>500: failed to reach server</p>])
      }
    }

    checkMember()
    setSubredditData()
    renderComments()
  }, [])
  const renderSideBar = () => {
    return <SubredditSidebar subData={subredditState} memberStatus={memberState} user_id={Number(user_id)} />
  }


  return (
    <div id="posts-container">
      <div id="posts-body">

        <div id="posts-list">
          <div id="post-container">
            <img id="post-img" src={"https://f004.backblazeb2.com/file/abozedbucket/"+post_id+".png"} />
            <form action="/sub" method="post" id="comment-form" onSubmit={async (e) => {
              e.preventDefault()
              if (!document.cookie.includes("refreshTokenExists")) {
                console.log("NOT LOGGED IN")
                toggleLoginForm(true);
              }
              if ((e.target as any).elements.comment.value == "") {
                (e.target as any).elements[0].placeholder = "Comment can't be empty.";
                
              } else {
                const result = await submitComment(e, null, Number(id), Number(post_id))
                if (result) {
                  (e.target as any).elements[0].value = "";

                  (e.target as any).elements[0].placeholder = "Comment added successfully.";
                }
              }

            }}>
              <textarea aria-label="description"
                cols={1} rows={1}
                name="comment" form="comment-form"
                id="comment-input"
                placeholder="Type your comment.." />
              <input type="submit" value="Submit" id="comment-submit" />

            </form>
          </div>
          <div id="comments-list">
            {commentsState}
          </div>
        </div>
        <div id="subreddit-sidebar-container">
          {renderSideBar()}
        </div>
      </div>
    </div>
  )
}

export default PostPage;