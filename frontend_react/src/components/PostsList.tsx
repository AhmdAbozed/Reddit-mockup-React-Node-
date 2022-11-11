import React, { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import PostItem from "./PostItem";


const PostsList = () => {

  let { id } = useParams();
  
  type post = {

    id?: Number;
    op: string;
    title: string;
    text: string;
    img: string;
    votes: Number;

  }

  const [postElementsState, setPostElements] = useState();
  
  console.log("outlet whatever"+useOutletContext())
  console.log()



  useEffect(() => {


    const getPosts = async () => {

      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/subreddits/"+ id + "/posts", options);
      const data = await resp.json()

      console.log(data);
      return data;
    }

    const renderPosts = async () => {

      const posts = await getPosts();
      console.log("RETURNING POST ELEMENTS")
      const postElements = posts.map((post: post) => (<PostItem key={JSON.stringify(post.id)} ID={JSON.stringify(post.id)} Title={post.title} Text={post.text} />))
      setPostElements(postElements)
      console.log("logging postelements" + postElements)
    }

    renderPosts()


  }, [])

  return (
    <>
      {postElementsState}
    </>
  )
}

export default PostsList;