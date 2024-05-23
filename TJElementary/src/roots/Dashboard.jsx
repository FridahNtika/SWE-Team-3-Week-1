import React from 'react';
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

export const Dashboard = () => {
    // have a section to filter the courses**
    const [courses, setCourses] = useState([]);
    const [total, setTotal] = useState(0);
    //const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [teacher, setTeacher] = useState('');
    const [max, setMax] = useState(0);

    //read operation
    //gets all courses in the database and prints them out
    const fetchCourses = async () => {
        try {
            const data = await getDocs(collection(db, "classes"));
            let temp = [];
            data.forEach((doc) => {
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
            console.error("Error reading the courses: ", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    //create operation
    //allows an administrator to add a new course
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "classes"), {
                Title: title,
                Description: description,
                'Course Code': code,
                Teacher: teacher,
                'Max Enrollment': max
            });
            console.log(docRef);
            setCode('');
            setDescription('');
            setMax(0);
            setTeacher('');
            setTitle('');
        } catch (error) {
            console.error("Error adding the course: ", error);
        }
        fetchCourses();
    };

    return (
    <>
    <section>
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
                        <a href={`/courseDashboard/:${course.id}`}>{course.Title} ({course['Course Code']}) by {course.Teacher}</a>
                        <p>{course.Description}</p>
                        <p>{course['Current Enrollment']} out of {course['Max Enrollment']} currently enrolled</p>
                        <hr />
                    </section>
                ))}
            </div>
        </div>
    </section>
    <br></br>
    <section>
        <div className='addCourse'>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend> Add a new course </legend>
                    <label>Course Name: <input type='text' id='courseName' value={title} 
                    onChange={(evt) => setTitle(evt.target.value)}>
                    </input></label><br></br>
                    <label>Course Code: <input type='text' id='courseCode' value={code} 
                    onChange={(evt) => setCode(evt.target.value)}>
                    </input></label><br></br>
                    <label>Course Description: <input type='text' id='courseDescription' value={description} 
                    onChange={(evt) => setDescription(evt.target.value)}>
                    </input></label><br></br>
                    <label>Course Instructor: <input type='text' id='courseInstructor' value={teacher} 
                    onChange={(evt) => setTeacher(evt.target.value)}>
                    </input></label><br></br>
                    <label>Course Maximum Enrollment: <input type='number' id='courseMax' value={max} 
                    onChange={(evt) => setMax(evt.target.value)}>
                    </input></label><br></br>
                    <button type='submit'>Add</button>
                </fieldset>
            </form>
        </div>
    </section>
    <br></br>
    </>
    );
};