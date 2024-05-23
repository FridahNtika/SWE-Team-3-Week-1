import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Root.css";
import logo from "../assets/logo.jpg";
import student from "../assets/student.jpg";
import teacher from "../assets/teacher.jpg";
import grades from "../assets/grades.jpg";
import course from "../assets/course.jpg";
import calendar from "../assets/calendar.jpg";

export const Root = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const images = [
    { src: logo, description: "TJ Elementary School Logo. Click here to return to the main dashboard.", path: "/" },
    { src: student, description: "Student Information and Enrollment. View and manage student profiles, including personal details and class enrollments. Enroll new students or update existing student records. Click here to navigate to Student Directory", path: "/studentDirectory" },
    { src: teacher, description: "Teacher Directory and Class Management. Browse the teacher directory and access class rosters. Assign teachers to classes and manage student enrollments for each class. Click here to navigate to Teacher Directory", path: "/teacherDirectory" },
    { src: grades, description: "Student Grades and Class Rosters. View class rosters and monitor student performance. Teachers can input and update grades for their assigned classes. Click here to navigate to Gradebook", path: "/grades" },
    { src: course, description: "Class Information and Schedules. Access details about each class offered at TJ Elementary, including course descriptions, schedules, and assigned teachers. Click here to navigate to Course Dashboard", path: "/courseDashboard" },
    { src: calendar, description: "School Calendar and Events. Stay up-to-date with the school's calendar of events, including holidays, assemblies, field trips, and other important dates. Click here to navigate to 2024-2025 School Year Calendar", path: "/calendar" },
  ];

  const handlePrevImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 500);
  };

  const handleNextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 500);
  };

  const handleImageClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="root-container">
      <div className="slideshow">
        <img
          src={images[currentIndex].src}
          alt="Slideshow"
          className={`slideshow-image ${isTransitioning ? "transitioning" : ""}`}
          onClick={() => handleImageClick(images[currentIndex].path)}
        />
        <div className="image-description">
          {images[currentIndex].description}
        </div>
        <div className="arrow left" onClick={handlePrevImage}>
          &lt;
        </div>
        <div className="arrow right" onClick={handleNextImage}>
          &gt;
        </div>
      </div>
      <div className="welcome-text">
        <span>Welcome to TJ Elementary School </span>
        <span>Welcome to TJ Elementary School </span>
      </div>
    </div>
  );
};
