// src/App.jsx
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./roots/Home";
import Dashboard from "./roots/Dashboard";
import ClassPage from "./roots/ClassPage";
import TeacherDashboard from "./roots/TeacherDashboard";
import StudentDirectory from "./roots/StudentDirectory";
import TeacherDirectory from "./roots/TeacherDirectory";
import Calendar from "./roots/Calendar";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/class/:id" element={<ClassPage />} />
                    <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                    <Route path="/student-directory" element={<StudentDirectory />} />
                    <Route path="/teacher-directory" element={<TeacherDirectory />} />
                    <Route path="/calendar" element={<Calendar />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

