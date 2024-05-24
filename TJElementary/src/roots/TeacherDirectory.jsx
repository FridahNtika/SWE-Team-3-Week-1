import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { TextField, Button, Card, CardContent, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const TeacherDirectory = () => {
    const [teacherFirstName, setTeacherFirstName] = useState("");
    const [teacherLastName, setTeacherLastName] = useState("");
    const [teacherSubject, setTeacherSubject] = useState("");
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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
                email: `${teacherFirstName.toLowerCase()}${teacherLastName.toLowerCase()}@jefferson.edu`,
                firstName: teacherFirstName,
                lastName: teacherLastName,
                subject: teacherSubject,
                fullName: teacherFirstName + " " + teacherLastName
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
            teachersArray.sort((a, b) => a.lastName.localeCompare(b.lastName));
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const filteredTeachers = teachers.filter(teacher =>
    (teacher.firstName + " " + teacher.lastName).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container sx={{ width: '93vw'}}>
            <h1>Teacher Directory</h1>
            {<p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            value={teacherFirstName}
                            onChange={(e) => setTeacherFirstName(e.target.value)}
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
                            value={teacherLastName}
                            onChange={(e) => setTeacherLastName(e.target.value)}
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
                        <FormControl fullWidth margin="dense" size="small">

                            <InputLabel shrink={Boolean(teacherSubject)} style={{ color: '#FF6B3B' }}>Subject</InputLabel>
                            <Select
                                value={teacherSubject}
                                onChange={(e) => setTeacherSubject(e.target.value)}
                                label="Subject"
                                style={{ backgroundColor: 'white' }}
                            >
                                <MenuItem value="Math">Math</MenuItem>
                                <MenuItem value="Science">Science</MenuItem>
                                <MenuItem value="Music">Music</MenuItem>
                                <MenuItem value="English">English</MenuItem>
                                <MenuItem value="Spanish">Spanish</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" sx={{ backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' } }}>
                            Add Teacher
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <TextField
                label="Search by name"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                margin="dense"
                size="small"
                InputProps={{
                    style: { backgroundColor: 'white', borderColor: 'orange' }
                }}
                InputLabelProps={{
                    style: { color: '#FF6B3B' }
                }}
                sx={{ marginTop: '30px' }}
            />
            <Grid container spacing={2} marginTop={2}>
                {filteredTeachers.map((teacher) => (
                    <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                        <Card>
                            <CardContent>
                                {editingId === teacher.id ? (
                                    <>
                                        <TextField
                                            label="First Name"
                                            name="firstName"
                                            value={editingTeacher.firstName}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Last Name"
                                            name="lastName"
                                            value={editingTeacher.lastName}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel shrink={Boolean(editingTeacher.subject)}>Subject</InputLabel>
                                            <Select
                                                name="subject"
                                                value={editingTeacher.subject}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="Math">Math</MenuItem>
                                                <MenuItem value="Science">Science</MenuItem>
                                                <MenuItem value="Music">Music</MenuItem>
                                                <MenuItem value="English">English</MenuItem>
                                                <MenuItem value="Spanish">Spanish</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button variant="contained" color="primary" onClick={() => handleSave(teacher.id)} sx={{ marginRight: '10px', backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' } }}>
                                            Save
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleCancel} sx={{ marginRight: '10px', backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' } }}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h5">{teacher.firstName} {teacher.lastName}</Typography>
                                        <Typography variant="body2">Subject: {teacher.subject}</Typography>
                                        <Typography variant="body2">Email: {teacher.email}</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEdit(teacher)}
                                            sx={{
                                                marginRight: '10px',
                                                backgroundColor: 'teal',
                                                '&:hover': { backgroundColor: '#008080' }
                                            }}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(teacher.id)} sx={{ backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' } }}>
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
