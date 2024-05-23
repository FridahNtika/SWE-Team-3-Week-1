import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import './Grades.css';

export const Grades = () => {
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentGrade, setCurrentGrade] = useState("");
    const [newAssignment, setNewAssignment] = useState("");
    const [showFullRoster, setShowFullRoster] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchAssignments();
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

    const fetchAssignments = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "assignments"));
            const assignmentsArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setAssignments(assignmentsArray);
        } catch (error) {
            console.error("Error fetching assignments: ", error);
        }
    };

    const handleSelectStudent = (event) => {
        const studentId = event.target.value;
        const student = students.find((student) => student.id === studentId);
        setSelectedStudent(student);
        setCurrentGrade(student?.grade || "");
    };

    const updateGrade = async () => {
        try {
            const studentDoc = doc(db, "students", selectedStudent.id);
            await updateDoc(studentDoc, { grade: currentGrade });
            setSelectedStudent(null);
            setCurrentGrade("");
            fetchStudents();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const handleNewAssignmentChange = (event) => {
        setNewAssignment(event.target.value);
    };

    const addAssignment = async () => {
        try {
            await addDoc(collection(db, "assignments"), { name: newAssignment });
            setNewAssignment("");
            fetchAssignments();
        } catch (error) {
            console.error("Error adding new assignment: ", error);
        }
    };

    const deleteAssignment = async (assignmentId) => {
        try {
            await deleteDoc(doc(db, "assignments", assignmentId));
            fetchAssignments();
        } catch (error) {
            console.error("Error deleting assignment: ", error);
        }
    };

    const handleGradeChange = (event, studentId, assignmentId) => {
        const { value } = event.target;
        const updatedStudents = students.map((student) => {
            if (student.id === studentId) {
                return {
                    ...student,
                    grades: {
                        ...student.grades,
                        [assignmentId]: value
                    },
                    grade: calculateOverallGrade({
                        ...student.grades,
                        [assignmentId]: value
                    })
                };
            }
            return student;
        });
        setStudents(updatedStudents);
    };

    const calculateOverallGrade = (grades) => {
        const totalGrades = Object.values(grades).reduce((acc, grade) => acc + parseFloat(grade || 0), 0);
        const numberOfAssignments = assignments.length;
        return numberOfAssignments > 0 ? (totalGrades / numberOfAssignments).toFixed(2) : "N/A";
    };

    const updateAssignmentGrade = async (studentId, assignmentId, grade) => {
        try {
            const studentDoc = doc(db, "students", studentId);
            await updateDoc(studentDoc, {
                [`grades.${assignmentId}`]: grade
            });
            fetchStudents();
        } catch (error) {
            console.error("Error updating assignment grade: ", error);
        }
    };

    const toggleFullRoster = () => {
        setShowFullRoster(!showFullRoster);
    };

    return (
        <div className="grades-container">
            <h1 className="grades-title">Teacher Gradebook</h1>
            <div className="student-management">
                <div className="student-select-container">
                    <label htmlFor="student-select">Select Student:</label>
                    <select id="student-select" onChange={handleSelectStudent} value={selectedStudent?.id || ""}>
                        <option value="" disabled>Select a student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.firstName} {student.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedStudent && (
                    <div className="edit-grade-container">
                        <h3>Edit Final Grade for {selectedStudent.firstName} {selectedStudent.lastName}</h3>
                        <input
                            type="text"
                            value={currentGrade}
                            onChange={(e) => setCurrentGrade(e.target.value)}
                        />
                        <button className="update-button" onClick={updateGrade}>Update Final Grade</button>
                    </div>
                )}
                <div className="new-assignment-container">
                    <h3>Add New Assignment</h3>
                    <input
                        type="text"
                        placeholder="Assignment Name"
                        value={newAssignment}
                        onChange={handleNewAssignmentChange}
                    />
                    <button className="add-button" onClick={addAssignment}>Add Assignment</button>
                </div>
                <div className="assignments-list">
                    <h3>Assignments</h3>
                    <ul>
                        {assignments.map((assignment) => (
                            <li key={assignment.id}>
                                {assignment.name}
                                <button className="delete-button" onClick={() => deleteAssignment(assignment.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="toggle-roster-button" onClick={toggleFullRoster}>
                    {showFullRoster ? "Hide Full Roster" : "Show Full Roster"}
                </button>
                {showFullRoster && (
                    <div className="student-roster">
                        <h3>Student Roster</h3>
                        <table className="roster-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    {assignments.map((assignment) => (
                                        <th key={assignment.id}>{assignment.name}</th>
                                    ))}
                                    <th>Overall Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.firstName} {student.lastName}</td>
                                        {assignments.map((assignment) => (
                                            <td key={assignment.id}>
                                                <input
                                                    type="text"
                                                    value={student.grades?.[assignment.id] || ""}
                                                    onChange={(e) => handleGradeChange(e, student.id, assignment.id)}
                                                    onBlur={() => updateAssignmentGrade(student.id, assignment.id, student.grades?.[assignment.id] || "")}
                                                />
                                            </td>
                                        ))}
                                        <td>{student.grade || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Grades;
