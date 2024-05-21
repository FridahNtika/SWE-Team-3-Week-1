import React from "react";
import { Link } from "react-router-dom";


import { useState, useEffect } from "react";
// import "./App.css";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";


export const TeacherDirectory = () => {
    const [teacherName, setTeacherName] = useState("");
    const [teacherEmail, setTeacherEmail] = useState("");
    const [teacherSubject, setTeacherSubject] = useState("");


    const [teachers, setTeachers] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "teachers"), {
                id: 123456,
                email: teacherName + "@jefferson.edu",
                name: teacherName,
                subject: teacherSubject
            });
            console.log("Created doc with ID: ", docRef.id);
            setTeacherName("");
            setTeacherSubject("");
            fetchTeachers();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };


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
            <form onSubmit={handleSubmit}>
                <label>Add a teacher:</label>
                <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                ></input>
                <input
                    type="text"
                    value={teacherSubject}
                    onChange={(e) => setTeacherSubject(e.target.value)}
                ></input>
                <br></br>
                <button type="submit">Submit</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>ID Number</th>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                            <td>{teacher.id}</td>
                            <td>{teacher.name}</td>
                            <td>{teacher.subject}</td>
                            <td>{teacher.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
