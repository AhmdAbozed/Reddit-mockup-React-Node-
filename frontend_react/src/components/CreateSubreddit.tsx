import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/CreateForm.css";

const CreateSubreddit = () => {

    const [buttonState, setButtonState] = useState([0, 0]);

    useEffect(() => {
        //sees if all fields are filled to enable button or not
        const buttonElement = document.getElementById("create-form-submit");
        if (buttonState[0] == 1 && buttonState[1] == 1) {
            buttonElement!.removeAttribute("disabled")
            buttonElement!.setAttribute("style", "background-color: rgb(110,110,110)")
        }
        else {
            buttonElement!.toggleAttribute("disabled")
            buttonElement!.setAttribute("style", "background-color: rgb(222, 222, 222)")
        }
    }, [buttonState])

    const radioChecked = (e: any) => {
        setButtonState([buttonState[0], 1])
    }

    const submitPost = async (event: React.FormEvent<HTMLFormElement>) => {
       
        console.log("createpost url is: " + window.location.href)
        event.preventDefault();
        const target = event.target as any
        console.log("the id inside creatPost is: " + target.elements.subtype.value)
        const submission = { Title: target.elements.title.value, Type: target.elements.subtype.value }

        const options = {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        }
        //@ts-ignore, following error is fixed by adding object directly, rather than through a variable. 
        const resp = await fetch("http://" + window.location.hostname + ":3003/subreddits/", options);

        if (resp.status == 200) {
            console.log("Created post successfully. 200")
            document.getElementById("result")!.innerHTML = "200. Response recieved"
        }
        else if (resp.status == 404 || resp.status == 401) {
            window.location.href = "/login"
            console.log("internal server" + resp.status)
        }
        
        console.log("internal server" + resp.status)
        return resp;
        
    }

    return (
        <form id="create-form" action="" method="post" onSubmit={submitPost}>
            <div className="create-form-item gray-border-bottom " id="create-form-head">
                <a id="create-form-cancel" href={"/"} />
                <div className="gray " id="create-form-title">Create Subreddit</div>
                <button id="create-form-submit" aria-label="create subreddit" disabled>CREATE</button>
            </div>
            <div id="create-form-item-container">
                <div id="create-form-subreddit-icon"></div>

                <input aria-label="title" className="create-form-item gray-border-bottom "
                    type={"text"} name="title"
                    id="create-form-title-input"
                    placeholder="Add an interesting title"
                    required
                    autoComplete="off"
                    onChange={(e) => {
                        if (e.target.value != "") setButtonState([1, buttonState[1]]);
                        else setButtonState([0, buttonState[1]]);
                    }}
                >
                </input>
                <br />
                <br />

                <strong className="gray create-form-item" onClick={() => console.log(
                    //@ts-ignore
                    document.getElementById("private-sub")!.value)}>Subreddit Type</strong>
                <div className="gray-border-bottom">
                    <div className="create-form-radio">
                        <input type="radio" id="public-sub" name="subtype" value="public" onClick={radioChecked} autoComplete="off"  required/>
                        <label htmlFor="public-sub">Public</label>
                        <small className="gray"> Anyone can view, post, and comment to this community</small>

                    </div>
                    <div className="create-form-radio">
                        <input type="radio" id="private-sub" name="subtype" value="private" onClick={radioChecked} autoComplete="off" />
                        <label htmlFor="private-sub">Private</label>
                        <small className="gray"> Only approved users can view and submit to this community</small>
                    </div>
                    <div className="create-form-radio">
                        <input type="radio" id="restricted-sub" name="subtype" value="restricted" onClick={radioChecked} autoComplete="off" />
                        <label htmlFor="restricted-sub">Restricted</label>
                        <small className="gray">  Anyone can view this community, but only approved users can post</small>

                    </div>
                </div>

            </div>
            <div data-testid="testElement" id="result">hoo</div>
        </form>
    )
}

export default CreateSubreddit