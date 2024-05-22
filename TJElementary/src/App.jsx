// src/App.jsx
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import {Root} from "./roots/Root";
import { Dashboard } from "./roots/Dashboard";
import { CurrentClasses } from "./roots/CurrentClasses";
import { Grades } from "./roots/Grades";
import { StudentDirectory } from "./roots/StudentDirectory";
import { TeacherDirectory } from "./roots/TeacherDirectory";
import { Calendar } from "./roots/Calendar";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Root />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/class/:id" element={<CurrentClasses />} />
                    <Route path="/teacher-dashboard" element={<Grades />} />
                    <Route path="/student-directory" element={<StudentDirectory />} />
                    <Route path="/teacher-directory" element={<TeacherDirectory />} />
                    <Route path="/calendar" element={<Calendar />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

