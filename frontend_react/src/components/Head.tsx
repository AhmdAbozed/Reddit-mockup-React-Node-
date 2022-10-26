import React, { useState } from "react";
import "./../css/Head.css"
const Head = (props:  { toggleSidebar: React.Dispatch<React.SetStateAction<boolean>>; sidebarState: boolean}) => {
    return (
        <div id="head-parent">
            <div id="head">
                <div className="head-item" id="logo"></div>
                <div className="head-item dropdown" id="communities-dropdown" hidden>-communities dropdown-</div>
                <input type="button" className="head-item head-button" id="use-app-button" value={"Use App"}/>
                <a href="/test" className="head-item head-button" id="new-post-button" />
                
                <input type="button" className="head-item head-button" id="sidebar-button" onClick={
                    ()=>{
                            console.log("clicked: "+ props.toggleSidebar);props.toggleSidebar(!props.sidebarState)
                        }
                    } 
                />


            </div>
        </div>
    )
}

export default Head