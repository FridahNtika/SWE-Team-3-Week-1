import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { TextField, Button, Card, CardContent, Typography, Container, Grid } from "@mui/material";


export const StudentDirectory = () => {
    const [students, setStudents] = useState([]);
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("");
    const [studentBirthday, setStudentBirthday] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editingStudent, setEditingStudent] = useState({});
    const [message, setMessage] = useState("");


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

        if (!studentFirstName || !studentLastName || !studentBirthday) {
            setMessage("You must fill out all fields.");
            return;
        }

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
            setMessage(`Student ${studentFirstName} ${studentLastName} added successfully.`);
            setStudentFirstName("");
            setStudentLastName("");
            setStudentBirthday("");
            fetchStudents();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };


    const handleEdit = (student) => {
        setEditMode(true);
        setEditingStudent(student);
    };


    const handleSave = async () => {

        if (!editingStudent.firstName || !editingStudent.lastName || !editingStudent.birthday) {
            setMessage("You must fill out all fields.");
            return;
        }

        try {
            const studentDoc = doc(db, "students", editingStudent.id);
            await updateDoc(studentDoc, {
                firstName: editingStudent.firstName,
                lastName: editingStudent.lastName,
                birthday: editingStudent.birthday
            });
            console.log("Updated doc with ID: ", editingStudent.id);
            setMessage(`Student ${editingStudent.firstName} ${editingStudent.lastName} updated successfully.`);
            setEditMode(false);
            setEditingStudent({});
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
            setMessage("Student deleted successfully.");
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };


    const handleCancel = () => {
        setEditMode(false);
        setEditingStudent({});
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    useEffect(() => {
        fetchStudents();
    }, []);


    return (
        <Container>
            <h1>Student Directory</h1>
            {<p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            value={studentFirstName}
                            onChange={(e) => setStudentFirstName(e.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: '#FF6B3B' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            value={studentLastName}
                            onChange={(e) => setStudentLastName(e.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: '#FF6B3B' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="Birthday"
                            variant="outlined"
                            type="date"
                            value={studentBirthday}
                            onChange={(e) => setStudentBirthday(e.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: '#FF6B3B' },
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" sx={{ backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }} }>
                            Add Student
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Grid container spacing={2} marginTop={2}>
                {students.map((student) => (
                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                        <Card>
                            <CardContent>
                                {editMode && editingStudent.id === student.id ? (
                                    <>
                                        <TextField
                                            label="First Name"
                                            name="firstName"
                                            value={editingStudent.firstName}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Last Name"
                                            name="lastName"
                                            value={editingStudent.lastName}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Birthday"
                                            name="birthday"
                                            type="date"
                                            value={editingStudent.birthday}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginRight: '10px', backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }}}>
                                            Save
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleCancel} sx={{ marginRight: '10px', backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }}}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h5">{student.firstName} {student.lastName}</Typography>
                                        <Typography variant="body2">Birthday: {student.birthday}</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEdit(student)}
                                            sx={{ marginRight: '10px',
                                                backgroundColor: 'teal',
                                                '&:hover': { backgroundColor: '#008080' }
                                            }}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(student.id)} sx={{ backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }}}>
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};



