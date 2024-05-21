import React from "react";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
// import "./App.css";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export const TeacherDirectory = () => {
    const [teachers, setTeachers] = useState([]);

    const fetchTeachers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "teachers"));
            let teachersArray = [];
            querySnapshot.forEach((doc) => {
                teachersArray.push({ id: doc.id, ...doc.data() });
            });
            setTeachers(teachersArray);
        } catch (error) {
            console.error("Error fetching teachers: ", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <div>
            <h1>Teacher Directory</h1>
            <ul>
                {teachers.map((teacher) => (
                    <li key={teacher.id}>
                        <h2>{teacher.name}</h2>
                        <p>Subject: {teacher.subject}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
