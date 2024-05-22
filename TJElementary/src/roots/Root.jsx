// import React from "react";
// import logo from "../assets/logo.jpg"; 
// import student from "../assets/student.jpg";
// import teacher from "../assets/teacher.jpg";
// import grades from "../assets/grades.jpg";
// import course from "../assets/course.jpg";
// import calendar from "../assets/calendar.jpg";
// import "./Root.css";


// export const Root = () => {
//   return (
//     <div className="root-container">
//       <img src={logo} alt="Logo" className="logo" />
//     </div>
//   );
// };

import React, { useState } from "react";
import "./Root.css";
import logo from "../assets/logo.jpg";
import student from "../assets/student.jpg";
import teacher from "../assets/teacher.jpg";
import grades from "../assets/grades.jpg";
import course from "../assets/course.jpg";
import calendar from "../assets/calendar.jpg";

export const Root = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [logo, student, teacher, grades, course, calendar];

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="root-container">
      <div className="slideshow">
        <img
          src={images[currentIndex]}
          alt="Slideshow"
          className="slideshow-image"
        />
        <div className="arrow left" onClick={handlePrevImage}>
          &lt;
        </div>
        <div className="arrow right" onClick={handleNextImage}>
          &gt;
        </div>
      </div>
    </div>
  );
};