import React from "react";
import { Link } from "react-router-dom";

export const Root = () => {
	return (
		<div>
			<h1>Root Page</h1>
            <Link to={"/teachers"}>Go to teacher directory page</Link>
		</div>
        
	);
};