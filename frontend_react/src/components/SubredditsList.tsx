import React, { useState, useEffect, ReactElement } from "react";
import SubredditItem from "./SubredditItem";

const SubredditsList = () => {
  type subreddit = {

    id?: Number;
    title: string;
    members: Number;

  }

  const [subredditElementsState, setSubredditElements] = useState<ReactElement>();


  const getSubreddits = async () => {
    try {


      console.log("inside getsubreddits")

      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const resp = await fetch("http://" + window.location.hostname + ":" + 3003 + "/subreddits", options);
      const data = await resp.json()

      console.log(data)
      return data;
    } 
    catch (error) {
      console.log(error)
    }
  }




  useEffect(() => {
    const renderSubreddits = async () => {

      const subreddits = await getSubreddits();
      console.log("RETURNING SUBREDDIT ELEMENTS")
      if(subreddits){
        const subredditElements = subreddits.map((subreddit: subreddit) => (<SubredditItem key={JSON.stringify(subreddit.id)} ID={JSON.stringify(subreddit.id)} Title={subreddit.title} Members={JSON.stringify(subreddit.members)} />))
        setSubredditElements(subredditElements)
        console.log("logging subredditelements" + JSON.stringify(subredditElements))
          
      }
      else{
        setSubredditElements(<p>500: failed to reach server</p>)
      }
    }

    renderSubreddits()
  }, [])

  return (
    <>
      {subredditElementsState}
    </>
  )
}

export default SubredditsList;