// src/roots/StudentDirectory.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export const StudentDirectory = () => {
    const [students, setStudents] = useState([]);
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("");
    const [studentBirthday, setStudentBirthday] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);

    const fetchStudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "students"));
            const studentsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentsArray);
        } catch (error) {
            console.error("Error fetching students: ", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await updateStudent();
        } else {
            await addStudent();
        }
    };

    const addStudent = async () => {
        try {
            const docRef = await addDoc(collection(db, "students"), {
                firstName: studentFirstName,
                lastName: studentLastName,
                birthday: studentBirthday
            });
            console.log("Created doc with ID: ", docRef.id);
            setStudentFirstName("");
            setStudentLastName("");
            setStudentBirthday("");
            fetchStudents();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleEdit = (student) => {
        setStudentFirstName(student.firstName);
        setStudentLastName(student.lastName);
        setStudentBirthday(student.birthday);
        setEditMode(true);
        setCurrentStudentId(student.id);
    };

    const updateStudent = async () => {
        try {
            const studentDoc = doc(db, "students", currentStudentId);
            await updateDoc(studentDoc, {
                firstName: studentFirstName,
                lastName: studentLastName,
                birthday: studentBirthday
            });
            console.log("Updated doc with ID: ", currentStudentId);
            setStudentFirstName("");
            setStudentLastName("");
            setStudentBirthday("");
            setEditMode(false);
            setCurrentStudentId(null);
            fetchStudents();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const studentDoc = doc(db, "students", id);
            await deleteDoc(studentDoc);
            setStudents(students.filter(student => student.id !== id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div>
            <h1>Student Directory</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={studentFirstName}
                        onChange={(e) => setStudentFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={studentLastName}
                        onChange={(e) => setStudentLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Birthday:</label>
                    <input
                        type="date"
                        value={studentBirthday}
                        onChange={(e) => setStudentBirthday(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{editMode ? "Update Student" : "Add Student"}</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Birthday</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.firstName} {student.lastName}</td>
                            <td>{student.birthday}</td>
                            <td>
                                <button onClick={() => handleEdit(student)}>Edit</button>
                                <button onClick={() => handleDelete(student.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
