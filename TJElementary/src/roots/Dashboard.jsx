import React from 'react';
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export const Dashboard = () => {
    // get the courses from the database
    /* iterate through each course printing out the:
    1. current enrolment
    2. title 
    3. teacher */
    // have a section to filter the courses**
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    const getCourses = async () => {
        try {
            const allDocs = await getDocs(collection(db, 'classes'));
            let courseArray = [];
            //allDocs.forEach((doc) => console.log(doc.data()))
            allDocs.forEach((doc) => 
                courseArray.push(doc.data()));
            setCourses(courseArray);
            console.log(courses);
        } catch (error) {
            setError(error.message);
        };
    }

    useEffect(() => {
        getCourses();
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
        {/* iterate through each course here */}
        {courses.map((course) => (
            <section>
                <div key={course}>
                    <p>{course[0].title}</p>
                    <p>{course.descr}</p>
                    <p>{course.teacher}</p>
                    <p>Current enrollment: {course.current}</p>
                    <p>Max enrollment: {course.max}</p>
                </div>
            </section>
        ))}
    </div>
    </>
    );
};