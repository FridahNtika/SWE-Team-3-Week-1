import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { getDoc, updateDoc, doc, deleteDoc, increment } from "firebase/firestore";
import { Dashboard } from './Dashboard';
import { TextField, Button, Card, CardContent, Typography, Container, Grid } from "@mui/material";

export const ClassPage = () => {
    const [courseInfo, setCourseInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [added, setAdded] = useState("");
    const [enrolledCount, setEnrolledCount] = useState(0)

    // Get the userId param from the URL.
    let { id } = useParams();


    // Gets the course's data
    useEffect(() => {
        const fetchCourse = async (id) => {
            try {
                const docRef = doc(db, "classes", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCourseInfo(data);
                    if (data.Enrolled) {
                        setStudents(data.Enrolled);
                    }
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.log("Error fetching this course: ", error);     
            }
        };

        const properID = id.replace(':', '');
        fetchCourse(properID);
    }, [id]);

    //Update operation
    // Allows administrators to update the existing class
    const handleUpdate = async (evt) => {
        evt.preventDefault();
        try {
            const properID = id.replace(':', '');
            const docRef = doc(db, "classes", properID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const max = data['Max Enrollment'];
                let updatedEnrolled = data.Enrolled || [];

                if (updatedEnrolled.length < max && added.trim() !== "") {
                    updatedEnrolled.push(added);
                    await updateDoc(docRef, { 
                        Enrolled: updatedEnrolled,
                        "Current Enrollment": increment(1),

                     });
                    setStudents(updatedEnrolled);
                    setAdded("");
                } else {
                    console.log("Class is full or input is empty");
                }
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log("Error updating this course: ", error);
        }
    };

    const handleDelete = async (idx) => {
        try {
            const properID = id.replace(':', '');
            const docRef = doc(db, "classes", properID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let updatedEnrolled = [...students];
                updatedEnrolled.splice(idx, 1);
                await updateDoc(docRef, { 
                    Enrolled: updatedEnrolled,
                    "Current Enrollment": increment(-1),
                });
                setStudents(updatedEnrolled);
            }
        } catch (error) {
            console.error("Error removing student from course: ", error);
        }
    };

    //incorporate student collection**
    return (
        <Container>
            <Grid container spacing={2} marginTop={2}>
                <div className='courseInfo'>
                    {courseInfo ? (
                        <>
                        <h2>{courseInfo.Title} ({courseInfo['Course Code']})</h2>
                        <h4><strong>Meets on {courseInfo['Meeting Times']}</strong></h4>
                        <h4><i>{courseInfo.Teacher}</i></h4>
                        <h4>{courseInfo.Description}</h4>
                        </> 
                    ) : (
                        <Typography variant="h6">No course information available.</Typography>
                    )}
                </div>
            </Grid>
            {students.length > 0 ? (
                <>
                <h3>Students currently enrolled: </h3>
                <div className='studentList'>
                    <Grid container spacing={2}>
                    {students.map((student, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card sx={{ minWidth: 200, maxWidth: 300, margin: 'auto' }}>
                            <CardContent>
                                <>
                                <Typography variant="h5">{student}</Typography>
                                <Button variant="contained" color="secondary" onClick={() => handleDelete(index)} 
                                    sx={{ backgroundColor: 'teal', '&:hover': { backgroundColor: '#008080' }}}>
                                    Remove </Button>
                                </>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                    </Grid>
                </div>
                </>
            ) : (
                <h3>No students currently enrolled</h3>
            )}
        
            <br></br>
            <form onSubmit={handleUpdate}>
                <fieldset>
                    <legend> Enroll a student </legend>
                    <Grid container spacing={2}>
                        <Grid item xs={8} sm={6}>
                            <TextField label="Name" variant="outlined" value={added}
                                onChange={(evt) => setAdded(evt.target.value)}
                                fullWidth margin="dense" size="small"
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
                                Add Student
                            </Button>
                        </Grid>
                    </Grid>
                </fieldset>
            </form>
        </Container>
    );
};
