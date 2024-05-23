import React from 'react';
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { TextField, Button, Card, CardContent, Typography, Container, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    // have a section to filter the courses**
    const [courses, setCourses] = useState([]);
    const [total, setTotal] = useState(0);
    //const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [teacher, setTeacher] = useState('');
    const [meet, setMeet] = useState('');
    const [max, setMax] = useState(0);
    const navigate = useNavigate();

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
                'Max Enrollment': max,
                'Meeting Times': meet
            });
            console.log(docRef);
            setCode('');
            setDescription('');
            setMax(0);
            setTeacher('');
            setTitle('');
            setMeet('');
        } catch (error) {
            console.error("Error adding the course: ", error);
        }
        fetchCourses();
    };

    const handleMore = async (courseID) => {
        console.log(courseID);
        navigate(`/courseDashboard/${courseID}`);
    }

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "classes", id));
            fetchCourses();
            console.log(`Deleted document with ID: ${id}`);
        } catch (error) {
            console.error("Error deleting course: ", error);
        }
    };


    return (
    <Container>
        <Grid container spacing={2} marginTop={2}>
            {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card>
                    <CardContent>
                        <>
                        <Typography variant="h5">{course.Title} ({course['Course Code']})</Typography>
                        <Typography variant="body2">Instructor: {course.Teacher}</Typography>
                        <Typography variant="body2">Meets: {course['Meeting Times']}</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleMore(course.id)}
                            sx={{ marginRight: '10px',
                                backgroundColor: 'teal', 
                                '&:hover': { backgroundColor: '#008080' }
                                }}> More Info </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(course.id)} sx={{ backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }}}>
                            Delete </Button>
                        </>
                    </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        <br></br>
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend> Add a new course </legend>
                <Grid container spacing={3}>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="Course Name"
                            variant="outlined"
                            value={title}
                            onChange={(evt) => setTitle(evt.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: 'orange' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="Course Code"
                            variant="outlined"
                            value={code}
                            onChange={(evt) => setCode(evt.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: 'orange' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="Course Description"
                            variant="outlined"
                            value={description}
                            onChange={(evt) => setDescription(evt.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: 'orange' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="Course Instructor"
                            variant="outlined"
                            value={teacher}
                            onChange={(evt) => setTeacher(evt.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: 'orange' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="Max Enrollment"
                            variant="outlined"
                            value={max}
                            onChange={(evt) => setMax(evt.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: 'orange' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={14} sm={6}>
                        <TextField
                            label="Meeting Times"
                            variant="outlined"
                            value={meet}
                            onChange={(evt) => setMeet(evt.target.value)}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                                style: { backgroundColor: 'white', borderColor: 'orange' }
                            }}
                            InputLabelProps={{
                                style: { color: 'orange' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" sx={{ backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }} }>
                            Add Course
                        </Button>
                    </Grid>
                </Grid>
                </fieldset>
            </form>
    </Container>
    );
};