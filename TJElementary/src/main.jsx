import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Root } from "./roots/Root.jsx";
import { Calander } from "./roots/Calander.jsx";
import { TeacherDirectory } from "./roots/TeacherDirectory.jsx";
import { StudentDirectory } from "./roots/StudentDirectory.jsx";
import { Grades } from "./roots/Grades.jsx";
import { Dashboard } from "./roots/Dashboard.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
    },
    {
        path: "/calander",
        element: <Calander />,
    },
    {
        path: "/teacherdirectory",
        element: <TeacherDirectory />,
    },
    {
        path: "/studentDirectory",
        element: <StudentDirectory />,
    },
    {
        path: "/grades",
        element: <Grades />,
    },
    {
        path: "/courseDashboard",
        element: <Dashboard />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
