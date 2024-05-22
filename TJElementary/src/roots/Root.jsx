import React from "react";
import logo from "../assets/logo.jpg"; 
import "./Root.css";

export const Root = () => {
  return (
    <div className="root-container">
      <img src={logo} alt="Logo" className="logo" />
    </div>
  );
};