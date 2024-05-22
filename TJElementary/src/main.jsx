import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout";
import { Root } from "./roots/Root.jsx";
//import { Calendar } from "./roots/Calendar.jsx";
import { TeacherDirectory } from "./roots/TeacherDirectory.jsx";
import { StudentDirectory } from "./roots/StudentDirectory.jsx";
import { Grades } from "./roots/Grades.jsx";
import { Dashboard } from "./roots/Dashboard.jsx";
import { ClassPage } from "./roots/ClassPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <Root />
            </Layout>
        ),
    },
    /*{
        path: "/calendar",
        element: (
            <Layout>
                <Calendar />
            </Layout>
        ),
    },*/
    {
        path: "/teacherdirectory",
        element: (
            <Layout>
                <TeacherDirectory />
            </Layout>
        ),
    },
    {
        path: "/studentDirectory",
        element: (
            <Layout>
                <StudentDirectory />
            </Layout>
        ),
    },
    {
        path: "/grades",
        element: (
            <Layout>
                <Grades />
            </Layout>
        ),
    },
    {
        path: "/courseDashboard",
        element: (
            <Layout>
                <Dashboard />
            </Layout>
        ),
    },
    {
        path: "/courseDashboard/:id",
        element: (
            <Layout>
                <ClassPage />
            </Layout>
        ),
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
