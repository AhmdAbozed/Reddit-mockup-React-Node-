import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostItem from "./PostItem";
import  "../css/SubredditHome.css"

const PostsList = () => {

  let { id } = useParams();

  type post = {

    id?: number;
    op_id: number;
    op: string;
    title: string;
    text: string;
    img: string;
    votes: number;

  }
  type subreddit = {
    id?: number;
    title: string;
    members: number;
    creation_date: Date;
  }

  

  const [postElementsState, setPostElements] = useState(<></>);
  const [subredditState, setSubredditState] = useState({id: -1, title: null, members: 0, creation_date: 0/0/0});


  useEffect(() => { //prevents rendering on state change
    if (!Number(id)) {
      setPostElements(<div>Invalid Url: sub Id is not a number</div>)
      return
    }
    const renderPosts = async (subTitle: string) => { //adds posts to postelements state, which is what component returns

      const posts = await getPosts();
      console.log("sub title in renderposts: "+ subredditState.title)
      const postElements = posts.map((post: post) => (<PostItem key={JSON.stringify(post.id)} Id={JSON.stringify(post.id)} Op_id={post.op_id} Op={post.op} Title={post.title} Text={post.text} Votes={Number(post.votes)} Subreddit={subTitle as string} />))
      setPostElements(postElements)
    }
    const getSubreddit = async () => {

      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/subreddits/" + id, options);
      const data = await resp.json()
      setSubredditState(data);
      renderPosts(data.title)
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

    

    getSubreddit()
    
    

  }, [])

  return (
    <div>
      <div id="subreddit-head">
        
        <div id="subreddit-background"/>
        <div id="subreddit-title-container">
          <img src="/resources/subreddit-icon.png" id="subreddit-icon"/>
          <div id="subreddit-title"> {subredditState.title} Subreddit</div>
          <button className="button" id="subreddit-title-button">Join</button>
        </div>
      </div>
      <div id="posts-container">
        <div id="posts-body">

          <div id="posts-list">
            {postElementsState}
          </div>
          <div id="subreddit-sidebar-container">
            <div id="subreddit-sidebar">
              <div className="subreddit-sidebar-item" id="subreddit-sidebar-title">Welcome to {subredditState.title}</div>
              <hr className="subreddit-sidebar-hr"/>
              <div className="subreddit-sidebar-item">Created: {new Date(subredditState.creation_date).toLocaleDateString()}</div>
              <div className="subreddit-sidebar-item">Members: {subredditState.members}</div>
              <hr className="subreddit-sidebar-hr"/>
              <button className="subreddit-sidebar-button button" id="sidebar-post" onClick={()=>{window.location.href="/subreddit/"+id+"/createPost"}}>Create Post</button> 
              <button className="subreddit-sidebar-button button" id="sidebar-join">Join</button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostsList;