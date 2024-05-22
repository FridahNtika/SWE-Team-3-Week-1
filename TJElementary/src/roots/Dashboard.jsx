import React from 'react';
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export const Dashboard = () => {
    /* iterate through each course printing out the:
    1. current enrolment
    2. title 
    3. teacher */
    // have a section to filter the courses**
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "classes"));
            let coursesArray = [];
            querySnapshot.forEach((doc) => {
                coursesArray.push({ id: doc.id, ...doc.data() });
            });
            console.log(coursesArray);
            setCourses(coursesArray);
        } catch (error) {
            console.error("Error fetching courses: ", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
    <>
    <h2>Course Browser</h2>
    <div id="courseListing">
        <div>
            Listing for: 
            <b> Fall 2024</b>
            ; Total courses offered: 
            <b> 56*</b>
        </div>
    </div>
    </>
    );
};