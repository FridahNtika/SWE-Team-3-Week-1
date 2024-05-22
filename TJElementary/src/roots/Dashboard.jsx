import React from 'react';
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export const Dashboard = () => {
    // have a section to filter the courses**
    const [courses, setCourses] = useState([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(null);

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "classes"));
            let temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({ id: doc.id, ...doc.data() });
            });
            let coursesArray = [];

            temp.forEach((item) => {
                coursesArray.push(item);
            });
            const total = coursesArray.length;
            setTotal(total);
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
    <div className='header'>
        <a class="school-title" href="/"> Thomas Jefferson Elementary</a><br></br>
        <a class="courses" href="/courseDashboard"> Course Browser</a>
    </div>
    <hr />
    <div id="courseListing">
        <div>
            Listing for: 
            <b> Fall 2024</b>
            ; Total courses offered: 
            <b> {total} </b>
            <hr />
        </div>
        <div>
            {courses.map((course) => (
                <section>
                    <p>{course.Title} ({course['Course Code']}) by {course.Teacher}</p>
                    <p>{course.Description}</p>
                    <p>{course['Current Enrollment']} out of {course['Max Enrollment']} currently enrolled</p>
                    <hr />
                </section>
            ))}
        </div>
    </div>
    </>
    );
};