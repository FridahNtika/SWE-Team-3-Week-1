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
    // Get the userId param from the URL.
    let { id } = useParams();
    const properID = id.replace(':','');
    //console.log(properID);

    // Gets the course's data
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const docRef = await getDoc(doc(db, "classes", properID));
                const data = docRef.data();
                setCourseInfo({ data });
                //console.log(data);
                console.log("CI: ", courseInfo);
                const stud = []
                courseInfo['data'].Enrolled.forEach((student) => stud.push(student));
                setStudents(stud);
            } catch (error) {
                console.log("Error fetching this course: ", error);     
            }
        };

        if(properID) {
            fetchCourse();
        }
    }, [properID]);

    // Update operation
    // Allows administrators to update the existing class
    const handleUpdate = async (evt) => {
        evt.preventDefault();
        try {0
            const docRef = await doc(db, "classes", properID);
            await updateDoc(docRef(db, "classes", properID), {
                property: newValue
              });
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
        <>
        {/*<Routes>
        <Route path="/courseDashboard">
            <Route path=":id" element={<Dashboard />} />
            <Route path="me" element={...} />
        </Route>
        </Routes>*/}
        <section>
            <>
            <div className='courseInfo'>
                {courseInfo ? (
                    <>
                    <h2>{courseInfo['data'].Title} ({courseInfo['data']['Course Code']})</h2>
                    <p><strong>Meets on {courseInfo['data']['Meeting Times']}</strong></p>
                    <p><i>{courseInfo['data'].Teacher}</i></p>
                    <p>{courseInfo['data'].Description}</p>
                    <h4>Students currently enrolled: </h4>
                    <Container>
                        <Grid container spacing={2} marginTop={2}>
                            <div className='studentList'>
                                {students ? (
                                    students.map((student, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={student.id}>
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
                                    ))
                                ) : (
                                    <p>No students enrolled in this course</p>
                                )} 
                            </div>
                        </Grid>
                    </Container>
                    </>
                ) : (
                    <p>Loading...</p>
                )
                }
            </div>
            </>
        </section>
        {/*<section>
        <div className='updateEnrollment'>
            <form onSubmit={handleUpdate}>
                <fieldset>
                    <legend> Update Enrollment For This Class </legend>
                    <label>Course Code: <input type='text' id='codeRemove' value={code} 
                    onChange={(evt) => setCode(evt.target.value)}>
                    </input></label><br></br>
                    <button type='submit'>Add Student(s)</button>
                </fieldset>
            </form>
        </div>
    </section>
    <br></br>*/}
            </>
    );
};
