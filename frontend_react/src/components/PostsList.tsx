import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";


  const PostsList = () => {
    type post = {

        id?: Number;
        op:string;
        title: string;
        text: string;
        img: string;
        votes: Number;
    
      }
    
      const [postElementsState, setPostElements] = useState();
    
    
      const getPosts = async () => {
    
        console.log("inside getPosts")
    
        const options = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        }
        const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/posts", options);
        const data = await resp.json()
    
        console.log(data);
        return data;
      }
    

    
    
      useEffect(  ()=>{
        const renderPosts = async ()=>{
    
            const posts = await getPosts();
            console.log("RETURNING POST ELEMENTS")
            const postElements =  posts.map((post:post)=>(<PostItem key={JSON.stringify(post.id)} ID={JSON.stringify(post.id)} Title ={post.title} Text={post.text}/>))
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