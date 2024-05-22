import React from "react";
import { Link } from "react-router-dom";


import { useState, useEffect } from "react";
// import "./App.css";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";


export const TeacherDirectory = () => {
    const [teacherFirstName, setTeacherFirstName] = useState("");
    const [teacherLastName, setTeacherLastName] = useState("");
    const [teacherFullName, setTeacherFullName] = useState("");
    const [teacherSubject, setTeacherSubject] = useState("");
    const [message, setMessage] = useState("");

    const [teachers, setTeachers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teacherFirstName || !teacherLastName || !teacherSubject) {
            setMessage("You must fill out all fields.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "teachers"), {
                //id: 123456,
                email: `${teacherFirstName.toLowerCase()}${teacherLastName.toLowerCase()}@jefferson.edu`,
                firstName: teacherFirstName,
                lastName: teacherLastName,
                subject: teacherSubject,
                fullName: teacherFullName
                
            });
            console.log("Created doc with ID: ", docRef.id);
            setMessage(`Teacher ${teacherFirstName} ${teacherLastName} added successfully.`);
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

    const handleEdit = (teacher) => {
        setEditingId(teacher.id);
        setEditingTeacher(teacher);
    };

    const handleSave = async (id) => {
        try {
            const updatedEmail = `${editingTeacher.firstName.toLowerCase()}${editingTeacher.lastName.toLowerCase()}@jefferson.edu`;
            const docRef = doc(db, "teachers", id);
            await updateDoc(docRef, {
                firstName: editingTeacher.firstName,
                lastName: editingTeacher.lastName,
                subject: editingTeacher.subject,
                email: updatedEmail,
            });
            console.log(`Updated document with ID: ${id}`);
            setEditingId(null);
            setEditingTeacher({});
            fetchTeachers();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditingTeacher({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingTeacher({ ...editingTeacher, [name]: value });
    };


    useEffect(() => {
        fetchTeachers();
    }, []);


    return (
        <div>
            <h1>Teacher Directory</h1>
            {<p>{message}</p>}
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
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Subject</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                            <td>{teacher.id}</td>
                            <td>
                                {editingId === teacher.id ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editingTeacher.firstName}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    teacher.firstName
                                )}
                            </td>
                            <td>
                                {editingId === teacher.id ? (
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editingTeacher.lastName}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    teacher.lastName
                                )}
                            </td>
                            <td>
                                {editingId === teacher.id ? (
                                    <input
                                        type="text"
                                        name="subject"
                                        value={editingTeacher.subject}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    teacher.subject
                                )}
                            </td>
                            <td>{teacher.email}</td>
                            <td>
                                {editingId === teacher.id ? (
                                    <>
                                        <button onClick={() => handleSave(teacher.id)}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(teacher)}>Edit</button>
                                        <button onClick={() => handleDelete(teacher.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
