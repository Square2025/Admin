// AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import DisplayAllCourse from './Courses/DisplayAllCourse';
import SingleCoursePage from './Courses/SingleCoursePage';

// Import your page components here

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/all-courses" element={<DisplayAllCourse />} />
      <Route path="/course/:courseId" element={<SingleCoursePage />} />
    </Routes>
  );
}
