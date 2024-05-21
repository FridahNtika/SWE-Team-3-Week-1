import React from "react";
import { Link } from "react-router-dom";


import { useState, useEffect } from "react";
// import "./App.css";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";


export const TeacherDirectory = () => {
    const [teacherFirstName, setTeacherFirstName] = useState("");
    const [teacherLastName, setTeacherLastName] = useState("");
    const [teacherSubject, setTeacherSubject] = useState("");


    const [teachers, setTeachers] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "teachers"), {
                //id: 123456,
                email: `${teacherFirstName.toLowerCase()}${teacherLastName.toLowerCase()}@jefferson.edu`,
                firstName: teacherFirstName,
                lastName: teacherLastName,
                subject: teacherSubject
            });
            console.log("Created doc with ID: ", docRef.id);
            setTeacherFirstName("");
            setTeacherLastName("");
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

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "teachers", id));
            fetchTeachers();
            console.log(`Deleted document with ID: ${id}`);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);


    return (
        <div>
            <h1>Teacher Directory</h1>
            <form onSubmit={handleSubmit}>
                
                <div>
                    <label>Add a teacher:</label>
                    <br></br>
                    <label htmlFor="teacherFirstName">First Name:</label>
                    <input
                        type="text"
                        id="teacherFirstName"
                        value={teacherFirstName}
                        onChange={(e) => setTeacherFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="teacherLastName">Last Name:</label>
                    <input
                        type="text"
                        id="teacherLastName"
                        value={teacherLastName}
                        onChange={(e) => setTeacherLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="teacherSubject">Subject:</label>
                    <input
                        type="text"
                        id="teacherSubject"
                        value={teacherSubject}
                        onChange={(e) => setTeacherSubject(e.target.value)}
                    />
                    <br></br>
                    <button type="submit">Submit</button>
                </div>
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
                            <td>{teacher.firstName + " " + teacher.lastName}</td>
                            <td>{teacher.subject}</td>
                            <td>{teacher.email}</td>
                            <td>
                                <button onClick={() => handleDelete(teacher.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
