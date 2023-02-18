import React from "react"
import { Navigate } from "react-router-dom";
class cookieUtils {
    //See backend for why there are "fake" cookies
    hasAccessToken() {
        console.log(document.cookie.includes("accessToken") + " result of cookie check inside hastoken")

        console.log(document.cookie + " result of cookie inside hastoken")
        if (document.cookie.includes("accessTokenExists")) {
            return true;
        }
        else return false;
    }

    hasRefreshToken() {
        console.log(document.cookie + " result of cookie inside hastoken")
        if (document.cookie.includes("refreshTokenExists")) {
            return true;
        }
        else return false;
    }
}

export const AccessControl = ({child}:{child:React.ReactElement})=>{
    const cookieFuncs = new cookieUtils()
    if(cookieFuncs.hasRefreshToken()){
     
         return child
     }
     else{
         return <Navigate replace to="/login" />
     }
 }

export default cookieUtils