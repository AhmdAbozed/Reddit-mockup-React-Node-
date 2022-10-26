import React, { useEffect, useState } from "react";
import "./../css/Sidebar.css"
const Sidebar = () => {

    const filler_sidebar =  [ <div className="sidebar-item">
                                <div className="icon" id="filler-icon"/>
                                <input type="button" className="sidebar-item sidebar-button" id="" value={"Filler"}/>
                              </div>
                            ]
    
    return (
    
        <div id="sidebar" className="sidebar">
            {/*<div className="head-item" id="logo"></div>*/}
            <input type="text" className="sidebar-item" id="sidebar-search" placeholder="Search.."/>
            
            <div className="sidebar-item">
                <div className="icon" id="mail-icon"/>
                <input type="button" className="sidebar-item sidebar-button" id="" value={"Inbox"}/>
            </div>
            <div className="sidebar-item">
                <div className="icon" id="avatar-icon"/>
                <input type="button" className="sidebar-item sidebar-button" id="" value={"Filler"}/>
            </div>
            {filler_sidebar}
            {filler_sidebar}
            {filler_sidebar}
            {filler_sidebar}
            {filler_sidebar}
            {filler_sidebar}
            {filler_sidebar}
            {filler_sidebar}
            {filler_sidebar}
            {filler_sidebar}
          </div>


    )
}

export default Sidebar