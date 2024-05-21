import React from 'react';
import { useState, useEffect } from "react";
//import {doc, getDoc} from 'firebase/firestore';
//import { db } from './firebase.js';

export const Dashboard = () => {
    // get the courses from the database
    /* iterate through each course printing out the:
    1. current enrolment
    2. title 
    3. teacher */
    // have a section to filter the courses**

    return (
    <>
    <div id="courseListing">
        <div>
            Listing for: 
            <b> Fall 2024</b>
            ; Total courses offered: 
            <b> 56*</b>
        </div>
        {/* iterate through each course here */}

    </div>
    </>
    );
};
