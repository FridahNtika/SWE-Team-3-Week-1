import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Root } from "./roots/Root.jsx";

import { TeacherDirectory } from "./roots/TeacherDirectory.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
	},

	{
		path: "/teachers",
		element: <TeacherDirectory />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);