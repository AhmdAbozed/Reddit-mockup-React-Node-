import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/CreateForm.css";

const CreatePost = () => {

    let { id } = useParams();

    const [buttonState, setButtonState] = useState([0, 0]);

    useEffect(() => {
        //sees if all fields are filled to enable button or not
        console.log("buttonstate0: " + buttonState[0], "buttonstate1: " + buttonState[1])
        const buttonElements = document.querySelectorAll(".create-form-submit");
        if (buttonState[0] && buttonState[1]) {
            buttonElements.forEach(element => {
                element.removeAttribute("disabled")
            });
        }
        else {
            buttonElements.forEach(element => {
                element.setAttribute("disabled", "true")
            });

        }
    }, [buttonState])

    const submitPost = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("the id inside creatPost is: " + id)
        event.preventDefault();
        const target = event.target as any
        const postImg = (document.getElementById("img-upload")! as any).files[0]

        //const submission = { Title: target.elements.title.value, Text: target.elements.desc.value, }
        const postFormData = new FormData()
        
        postFormData.append('Title', target.elements.title.value)
        postFormData.append('Text', target.elements.desc.value)
        const b = await target.elements.img.files[0]
        console.log(b)
        postFormData.append('Img', await target.elements.img.files[0])
        
        const options = {
            method: "POST",
            credentials: "include",
            body: postFormData
        }
        //@ts-ignore
        const resp = await fetch("http://" + window.location.hostname + ":3003/subreddits/" + id + "/posts", options);
        console.log("about to resp.json")
        if (resp.status == 200) {
            console.log("Created post successfully. 200")
            window.location.href = "/subreddit/"+id
        }
        else if (resp.status == 404 || resp.status == 401) {
            window.location.href = "/login"
            //document.getElementById("result")!.innerHTML = "ERROR" + resp.status
        }
        return resp;
    }

    return (
        <form id="create-form" action="" method="post" onSubmit={submitPost}>
            <div className="gray-border-bottom " id="create-form-head">
                <a id="create-form-cancel" href={"/subreddit/" + id} />
                <div className="gray " id="create-form-title">Text</div>
                <button className="create-form-submit" id="create-form-head-submit" aria-label="submit post" disabled>POST</button>
            </div>
            <div id="create-form-container">
                <div id="create-form-subreddit-icon"></div>
                <div id="post-type-container">
                    <button className="post-type" onClick={() => {

                    }}>Text</button>
                    <button className="post-type active">Image</button>
                </div>
                <div id="img-container" onDrop={(ev) => {
                    //straight from mozilla dev
                    console.log("File(s) dropped");

                    // Prevent default behavior (Prevent file from being opened)
                    ev.preventDefault();

                    if (ev.dataTransfer.items) {
                        // Use DataTransferItemList interface to access the file(s)
                        [...ev.dataTransfer.items].forEach((item, i) => {
                            // If dropped items aren't files, reject them
                            if (item.kind === "file" && item.type.match("^image/")) {
                                const file = item.getAsFile();
                                console.log(`… file[${i}].name = ${file!.name}`);
                                console.log(file!.type)
                                const imgUrl = URL.createObjectURL(file!);
                                console.log("img Url: " + imgUrl)
                                document.getElementById("post-img")?.setAttribute("src", imgUrl);
                            } else console.log("invalid file type")
                        });
                    } else {
                        // Use DataTransfer interface to access the file(s)
                        [...ev.dataTransfer.files].forEach((file, i) => {
                            console.log(`… file[${i}].name = ${file.name}`);
                        });
                    }
                }}
                    onDragOver={(ev) => {
                        console.log("File(s) in drop zone");

                        // Prevent default behavior (Prevent file from being opened)
                        ev.preventDefault();
                    }}
                >
                    <img src="" alt="" id="post-img" />
                </div>

                <div id="inputs-container">
                    <label htmlFor="img-upload" className="button-label-container">
                        <input type={"file"} id="img-upload" className="input-button" name="img" onChange={(event) => {
                            const imgfile = event.target.files;
                            console.log(imgfile)
                            console.log("testingimgInput")
                            if (imgfile![0]) {
                                const imgUrl = URL.createObjectURL(imgfile![0]);
                                console.log("img Url: " + imgUrl)
                                document.getElementById("post-img")?.setAttribute("src", imgUrl);
                                //URL.revokeObjectURL(imgUrl)
                            }
                        }}>
                        </input>
                    </label>
                    <input aria-label="title" className="create-form-item"
                        type={"text"} name="title"
                        id="create-form-title-input"
                        placeholder="Add an interesting title"
                        onChange={(e) => {
                            if (e.target.value != "") setButtonState([1, buttonState[1]]);
                            else setButtonState([0, buttonState[1]]);
                        }}
                    >
                    </input>
                    <textarea aria-label="description" className="create-form-item"
                        cols={1} rows={1}
                        name="desc" form="create-form"
                        id="create-form-desc-input"
                        placeholder="Add your text..."

                        onChange={(e) => {
                            if (e.target.value != "") setButtonState([buttonState[0], 1])
                            else setButtonState([buttonState[0], 0]);
                        }}
                    >
                    </textarea>
                    <label htmlFor="img-upload" className="button-label-container">
                        <input type={"submit"} id="post-button" className="input-button create-form-submit" value={"POST"}></input>
                    </label>
                </div>
            </div>
            <div data-testid="testElement" id="result">hoo</div>
        </form>
    )
}

export default CreatePost