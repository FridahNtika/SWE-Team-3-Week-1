import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import './Grades.css';
import { TextField, Button, Typography, Container, Grid, Card, CardContent } from "@mui/material";

export const Grades = () => {
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentGrade, setCurrentGrade] = useState("");
    const [newStudent, setNewStudent] = useState({ firstName: "", lastName: "", grades: {} });
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
                const newGrades = {
                    ...student.grades,
                    [assignmentId]: value
                };
                return {
                    ...student,
                    grades: newGrades,
                    grade: calculateOverallGrade(newGrades)
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
            const gradeDoc = doc(db, "grades", `${studentId}_${assignmentId}`);
            await updateDoc(studentDoc, {
                [`grades.${assignmentId}`]: grade
            });
            await updateDoc(gradeDoc, {
                studentId,
                assignmentId,
                grade
            });
            fetchStudents();
        } catch (error) {
            console.error("Error updating assignment grade: ", error);
        }
    };

    const handleNewStudentChange = (event) => {
        const { name, value } = event.target;
        setNewStudent({ ...newStudent, [name]: value });
    };

    const addStudent = async () => {
        try {
            await addDoc(collection(db, "students"), { ...newStudent, grade: calculateOverallGrade(newStudent.grades) });
            setNewStudent({ firstName: "", lastName: "", grades: {} });
            fetchStudents();
        } catch (error) {
            console.error("Error adding new student: ", error);
        }
    };

    const deleteStudent = async (studentId) => {
        try {
            await deleteDoc(doc(db, "students", studentId));
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student: ", error);
        }
    };

    const toggleFullRoster = () => {
        setShowFullRoster(!showFullRoster);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', width: '93vw'}}>
            <h1>Teacher Gradebook</h1>
            <div className="student-management">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <div className="new-student-container">
                            <Typography variant="h6">Select Student</Typography>
                            <TextField
                                select
                                label="Select Student"
                                InputProps={{
                                    style: { backgroundColor: 'white', borderColor: 'orange' }
                                }}
                                InputLabelProps={{
                                    style: { color: '#FF6B3B' }
                                }}
                                size="small"
                                value={selectedStudent?.id || ""}
                                onChange={handleSelectStudent}
                                SelectProps={{
                                    native: true,
                                }}
                                variant="outlined"
                                fullWidth
                            >
                                <option value="" disabled></option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.firstName} {student.lastName}
                                    </option>
                                ))}
                            </TextField>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className="new-assignment-container">
                            <Typography variant="h6">Add New Assignment</Typography>
                            <TextField
                                type="text"
                                label="Assignment Name"
                                value={newAssignment}
                                onChange={handleNewAssignmentChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    style: { backgroundColor: 'white', borderColor: 'orange' }
                                }}
                                InputLabelProps={{
                                    style: { color: '#FF6B3B' }
                                }}
                            />

                            <Button variant="contained" color="primary" onClick={addAssignment} sx={{ marginTop: '10px', backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }}}>Add Assignment</Button>
                        </div>
                    </Grid>
                </Grid>
                {selectedStudent && (
                    <div className="edit-grade-container">
                        <Typography variant="h6">Edit Final Grade for {selectedStudent.firstName} {selectedStudent.lastName}</Typography>
                        <TextField
                            type="text"
                            label="Edit Grade"
                            name="editgrade"
                            size="small"
                            value={currentGrade}
                            onChange={(e) => setCurrentGrade(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: '#FF6B3B' }
                            }}
                        />

                        <Button variant="contained" color="primary" onClick={updateGrade} sx={{ marginTop: '10px', backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }}}>Update Final Grade</Button>
                    </div>
                )}
                <div className="new-student-container">
                    <Typography variant="h6">Add New Student</Typography>
                    <TextField
                        type="text"
                        label="First Name"
                        name="firstName"
                        size="small"
                        value={newStudent.firstName}
                        onChange={handleNewStudentChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputProps={{
                            style: { backgroundColor: 'white', borderColor: 'orange' }
                        }}
                        InputLabelProps={{
                            style: { color: '#FF6B3B' }
                        }}
                    />
                    <TextField
                        type="text"
                        label="Last Name"
                        name="lastName"
                        size="small"
                        value={newStudent.lastName}
                        onChange={handleNewStudentChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputProps={{
                            style: { backgroundColor: 'white', borderColor: 'orange' }
                        }}
                        InputLabelProps={{
                            style: { color: '#FF6B3B' }
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={addStudent} sx={{ marginTop: '10px', backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }}}>Add Student</Button>
                </div>
                <div className="assignments-list">
                    <Typography variant="h6">Assignments</Typography>
                    <Grid container spacing={2}>
                        {assignments.map((assignment) => (
                            <Grid item key={assignment.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="body1">{assignment.name}</Typography>
                                        <Button className="delete-button" onClick={() => deleteAssignment(assignment.id)} sx={{ marginTop: '10px', backgroundColor: 'teal', color: 'white', '&:hover': { backgroundColor: '#cc0000' }}}>Delete</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
                <Button className="toggle-roster-button" onClick={toggleFullRoster} sx={{ marginTop: '20px', backgroundColor: 'teal', color: 'white', '&:hover': { backgroundColor: '#000080' }}}>
                    {showFullRoster ? "Hide Full Roster" : "Show Full Roster"}
                </Button>
                {showFullRoster && (
                    <div className="student-roster">
                        <Typography variant="h2">__________________________________</Typography>
                        <Typography variant="h3">Student Roster</Typography>
                        <table className="roster-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    {assignments.map((assignment) => (
                                        <th key={assignment.id}>{assignment.name}</th>
                                    ))}
                                    <th>Overall Grade</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.firstName} {student.lastName}</td>
                                        {assignments.map((assignment) => (
                                            <td key={assignment.id}>
                                                <TextField
                                                    type="text"
                                                    size="small"
                                                    value={student.grades?.[assignment.id] || ""}
                                                    onChange={(e) => handleGradeChange(e, student.id, assignment.id)}
                                                    onBlur={() => updateAssignmentGrade(student.id, assignment.id, student.grades?.[assignment.id] || "")}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    InputProps={{
                                                        style: { backgroundColor: 'white', borderColor: 'orange' }
                                                    }}
                                                    InputLabelProps={{
                                                        style: { color: '#FF6B3B' }
                                                    }}
                                                />
                                            </td>
                                        ))}
                                        <td>{student.grade || "N/A"}</td>
                                        <td>
                                            <Button className="delete-button" onClick={() => deleteStudent(student.id)} sx={{ backgroundColor: 'teal', color: 'white', '&:hover': { backgroundColor: '#cc0000' }}}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Grades;
