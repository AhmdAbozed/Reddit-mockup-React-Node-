import React, { useState, useEffect } from "react";
import Head from "./components/Head";
import Sidebar from "./components/sidebar";
import "./css/App.css"
import { Outlet } from "react-router-dom";
import LogInForm from "./components/LogInForm";
import { createContext } from 'react';

//without any I get Dispatch<Setstate...> at toggle. Using an interface with boolean and dispatch also works
export const loginContext = createContext<any>({
  loginFormState: false,

  toggleLoginForm: ()=>{}
})

const App = ({ loginOn = false }) => {
  const [sidebarState, toggleSidebar] = useState(false);
  const [loginFormState, toggleLoginForm] = useState(loginOn);
  const [subredditState, setSubredditState] = useState(-1)
  const renderSidebar = () => {
    if (sidebarState) {
      return <Sidebar />;
    }
    else return;
  }
  const renderLoginForm = () => {
    if (loginFormState) {
      if(document.cookie.includes("refreshTokenExists"))return
      return <LogInForm toggleLoginForm={toggleLoginForm} loginFormState={loginFormState} />;
    }
    else return;
  }


  return (
    <div id="app-container">

      <Head toggleSidebar={toggleSidebar} toggleLoginForm={toggleLoginForm} sidebarState={sidebarState} subredditId={subredditState} />
      {renderSidebar()}
      {renderLoginForm()}
      <loginContext.Provider value={{loginFormState, toggleLoginForm}}>
        <div>
          <Outlet context={[subredditState, setSubredditState]} />
        </div>
        </loginContext.Provider>
    </div>
  )
}

export default App;
