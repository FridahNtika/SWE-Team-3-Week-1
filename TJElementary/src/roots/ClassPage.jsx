import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Dashboard } from './Dashboard';

export const ClassPage = () => {
    const [courseInfo, setCourseInfo] = useState(null);
    const [students, setStudents] = useState([]);
    // Get the userId param from the URL.
    let { id } = useParams();
    const properID = id.replace(':','');

    // Gets the course's data
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const docRef = await getDoc(doc(db, "classes", properID));
                const data = docRef.data();
                setCourseInfo({ data });
                const stud = courseInfo['data'].Enrolled;
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
        try {
            const docRef = await doc(db, "classes", properID);
            await updateDoc(docRef(db, "classes", properID), {
                property: newValue
              });
        } catch (error) {
            console.log("Error updating this course: ", error);
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
            <div className='courseInfo'>
                {courseInfo ? (
                    <>
                    <h2>{courseInfo['data'].Title} ({courseInfo['data']['Course Code']})</h2>
                    <p><i>{courseInfo['data'].Teacher}</i></p>
                    <p>{courseInfo['data'].Description}</p>
                    <h4>Students currently enrolled: </h4>
                    <div className='studentList'>
                        {students.map((student, index) => (
                            <div key={index}>
                                <p>{student}</p> 
                            </div>
                            ))
                        }
                    </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
        </div>
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
