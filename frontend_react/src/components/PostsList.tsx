import React, { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import PostItem from "./PostItem";


const PostsList = () => {

  let { id } = useParams();
  
  type post = {

    id?: number;
    op_id: number;
    op:string;
    title: string;
    text: string;
    img: string;
    votes: number;

  }

  const [postElementsState, setPostElements] = useState(<></>);
  
  console.log("outlet whatever"+useOutletContext())
  console.log()



  useEffect(() => {
    if(!Number(id)){
      setPostElements(<div>Invalid Url</div>)
      return
    }

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

    const renderPosts = async () => { //adds posts to postelements state, which is what component returns

      const posts = await getPosts();
      console.log("RETURNING POST ELEMENTS")
      const postElements = posts.map((post: post) => (<PostItem key={JSON.stringify(post.id)} Id={JSON.stringify(post.id)} Op_id={post.op_id} Op={post.op} Title={post.title} Text={post.text} Votes={Number(post.votes)}/>))
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