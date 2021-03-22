import { Button } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";
import "../styles/Login.css";
import db, { auth, provider } from "./Firebase";
function Login() {
  const [{ user }, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // console.log(result.additionalUserInfo.profile.picture);
        // console.log(result.user.displayName);
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });

        // db.collection("rooms").add({
        //   name: result.user.displayName,
        // });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://img.icons8.com/fluent/240/000000/whatsapp.png"
          alt="logo-whatsapp"
        />

        <div className="login__text">
          <h1>Sign in to Whatsapp</h1>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
