import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import './Grades.css';

export const Grades = () => {
    const [students, setStudents] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [currentGrade, setCurrentGrade] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "students"));
            const studentsArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setStudents(studentsArray);
        } catch (error) {
            console.error("Error fetching students: ", error);
        }
    };

    const handleEdit = (student) => {
        setCurrentGrade(student.grade || "");
        setEditMode(true);
        setCurrentStudentId(student.id);
    };

    const updateGrade = async () => {
        try {
            const studentDoc = doc(db, "students", currentStudentId);
            await updateDoc(studentDoc, { grade: currentGrade });
            setEditMode(false);
            setCurrentStudentId(null);
            setCurrentGrade("");
            fetchStudents();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <div className="grades-container">
            <h1 className="grades-title">Grades</h1>
            <table className="grades-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.firstName} {student.lastName}</td>
                            <td>{student.grade || "N/A"}</td>
                            <td>
                                <button className="edit-button" onClick={() => handleEdit(student)}>Edit Grade</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editMode && (
                <div className="edit-grade-container">
                    <h3>Edit Grade</h3>
                    <input
                        type="text"
                        value={currentGrade}
                        onChange={(e) => setCurrentGrade(e.target.value)}
                    />
                    <button className="update-button" onClick={updateGrade}>Update Grade</button>
                </div>
            )}
        </div>
    );
};

export default Grades;
