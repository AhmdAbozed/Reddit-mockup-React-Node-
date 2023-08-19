import React, { useState } from "react";
import Head from "./components/Head";
import Sidebar from "./components/sidebar";
import "./css/App.css"
import { Outlet } from "react-router-dom";
import LogInForm from "./components/LogInForm";
import { createContext } from 'react';
//comment
//without any I get Dispatch<Setstate...> at toggle. Use an interface with boolean and dispatch also works
export const loginContext = createContext<any>({
  loginFormState: false,

  toggleLoginForm: () => { }
})

const App = ({ loginOn = false }) => {
  const [sidebarState, toggleSidebar] = useState(false);
  const [loginFormState, toggleLoginForm] = useState(loginOn);
  const [subredditState, setSubredditState] = useState(-1)
  console.log(process.env.NODE_ENV)
  const renderSidebar = () => {
    if (sidebarState) {
      //at head component sidebar button reverses this
      document.getElementsByTagName("body")[0].setAttribute("style", "overflow-y: hidden")
      return <Sidebar />;
    }
    else return;
  }
  const renderLoginForm = () => {
    if (loginFormState) {
      if (document.cookie.includes("refreshTokenExists")) return
      return <LogInForm toggleLoginForm={toggleLoginForm} loginFormState={loginFormState} />;
    }
    else return;
  }


  return (
    <div id="app-container">

      <div>
        <Head toggleSidebar={toggleSidebar} toggleLoginForm={toggleLoginForm} sidebarState={sidebarState} subredditId={subredditState} />
        {renderSidebar()}
        {renderLoginForm()}
        <loginContext.Provider value={{ loginFormState, toggleLoginForm }}>
          <div>
            <Outlet context={[subredditState, setSubredditState]} />
          </div>
        </loginContext.Provider>
      </div>
      <footer>
        
      </footer>
    </div>
  )
}

export default App;
