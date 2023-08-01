import React, { useState, useEffect, ReactHTMLElement } from "react";
import { useParams } from "react-router-dom";
import PostItem from "./PostItem";
import "../css/SubredditHome.css"
import { loginContext } from "../App";
import { useContext } from "react";
import cookieUtils from "../util/AccessControl";
import { verifyMember, getSubreddit } from "../util/utilFuncs"
import SubredditSidebar from "./SubredditSidebar";
const cookieFuncs = new cookieUtils();
export type subreddit = {
  id?: number;
  title: string;
  members: number;
  creation_date: Date;
}
const PostsList = () => {



  type post = {

    id?: number;
    op_id: number;
    op: string;
    title: string;
    text: string;
    img: string;
    votes: number;
    voteStatus: number;

  }

  const defSub: subreddit = { id: -1, title: "", members: 0, creation_date: new Date() }
  const { loginFormState, toggleLoginForm } = useContext(loginContext);
  const [postElementsState, setPostElements] = useState(<></>);
  const [memberState, setMemberState] = useState(false);
  const [subredditState, setSubredditState] = useState(defSub);
  let { id } = useParams();

  const user_id = decodeURIComponent(document.cookie)[decodeURIComponent(document.cookie).lastIndexOf("user_id") + 9]

  useEffect(() => { //"Effects run at the end of a commit after the screen updates" outside of the rendering calculations

    if (!Number(id)) {
      setPostElements(<div>Invalid Url: sub Id is not a number</div>)
      return
    }
    const renderPosts = async (subTitle: string) => {
      //adds posts to postelements state, which is what component renders
      //I get all posts and all votes made by the user on this subreddit
      //If post id and vote instance id are equal, I add the vote status
      const posts = await getPosts();
      const votes = await getVotes();

      if (document.cookie.includes("refreshTokenExists")) {
        posts.forEach((post: post) => {
          post.voteStatus = 0;
          votes.forEach((voteInstance: any) => {
            if (post.id == voteInstance.post_id) { post.voteStatus = voteInstance.vote; return; }
          });
        });
      }


      console.log("sub title in renderposts: " + subredditState.title)
      const postElements = posts.map((post: post) => (<PostItem key={JSON.stringify(post.id)} Id={JSON.stringify(post.id)} Op_id={post.op_id} Op={post.op} Title={post.title} Text={post.text} Votes={Number(post.votes)} Subreddit={subTitle as string} voteStatus={post.voteStatus} />))
      setPostElements(postElements)
    }


    const getPosts = async () => {

      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/subreddits/" + id + "/posts", options);
      const data = await resp.json()

      console.log(data);
      return data;
    }
    const getVotes = async () => {

      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/subreddits/" + id + "/posts/votes?user_id=" + user_id, options);
      const data = await resp.json()

      console.log("user votes: " + JSON.stringify(data));
      return data;
    }



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
      renderPosts(subredditData.title)
    }

    checkMember()
    setSubredditData()

  }, []) //empty array(no state dependencies) means to only run after initial mount
  
  const renderSideBar = () => {
    return <SubredditSidebar subData={subredditState} memberStatus={memberState} user_id={Number(user_id)} />
  }

  const join = async () => {
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
    const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/members?subreddit_id=" + id + "&member_id=" + user_id, options);
    const data = await resp.json()
    if (resp.status == 200) {

      console.log("member added, 200")
      window.location.reload()
    }
    //const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/members?"+ new URLSearchParams({member_id: }), options);
    //const data = await resp.json()
  }


  return (
    <div>
      <div id="subreddit-head">

        <div id="subreddit-background"/>
        <div id="subreddit-title-container">
          <img src="/resources/subreddit-icon.png" id="subreddit-icon" />
          <div id="subreddit-title"> {subredditState.title} Subreddit</div>
          <button className="button join" id="subreddit-title-button" onClick={() => { join()}}>Join</button>
        </div>
      </div>
      <div id="posts-container">
        <div id="posts-body">

          <div id="posts-list">
            {postElementsState}
          </div>
          <div id="subreddit-sidebar-container">
            {renderSideBar()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostsList;