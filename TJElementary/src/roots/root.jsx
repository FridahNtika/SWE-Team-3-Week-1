import React from "react";
import { Link } from "react-router-dom";

export const Root = () => {
    return (
        <>
            <h1>Welcome to TJ Elementary</h1>
            <Link to={"/teachers"}>Go to teacher directory page</Link>
            <br />
            <Link to={"/teachers"}>Go to teacher directory page</Link>
        </>
    );
};
