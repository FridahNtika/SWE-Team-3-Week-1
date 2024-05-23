import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Dashboard } from './Dashboard';
import { TextField, Button, Card, CardContent, Typography, Container, Grid } from "@mui/material";

export const ClassPage = () => {
    const [courseInfo, setCourseInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [added, setAdded] = useState("");
    // Get the userId param from the URL.
    let { id } = useParams();

    //console.log(properID);

    // Gets the course's data
    useEffect(() => {
        const fetchCourse = async (id) => {
            try {
                const docRef = await getDoc(doc(db, "classes", id));
                const data = docRef.data();
                console.log("data: ", data);
                setCourseInfo({ data });
                //console.log(data);
                console.log("CI: ", courseInfo);
                const stud = []
                data.Enrolled.forEach((student) => stud.push(student));
                setStudents(stud);
            } catch (error) {
                console.log("Error fetching this course: ", error);     
            }
        };

        const properID = id.replace(':','');
        fetchCourse(properID);
    
    }, []);

    // Update operation
    // Allows administrators to update the existing class
    const handleUpdate = async (evt) => {
        evt.preventDefault();
        try {
            const docRef = await doc(db, "classes", properID);
            const newD = docRef.data();
            console.log(newD);
            /*await updateDoc(docRef(db, "classes", properID), {
                property: newValue
              });*/
        } catch (error) {
            console.log("Error updating this course: ", error);
        }
    };

    const handleDelete = async (idx) => {
        try {
            //console.log(students);
            students.pop(idx);
            //console.log(students);
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
                    <h2>{courseInfo['data'].Title} ({courseInfo['data']['Course Code']})</h2>
                    <p><strong>Meets on {courseInfo['data']['Meeting Times']}</strong></p>
                    <p><i>{courseInfo['data'].Teacher}</i></p>
                    <p>{courseInfo['data'].Description}</p>
                    <h4>Students currently enrolled: </h4>
                    <div className='studentList'>
    
                        {students && students.map((student, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
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
                    </div>
                    </> 
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </Grid>
        <br></br>
        <form onSubmit={handleUpdate}>
            <fieldset>
                <legend> Enroll a student </legend>
                <Grid container spacing={2}>
                    <Grid item xs={8} sm={6}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={added}
                            onChange={(evt) => setAdded(evt.target.value)}
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
                            Add Student
                        </Button>
                    </Grid>
                </Grid>
                </fieldset>
            </form>
    </Container>
    )
};
