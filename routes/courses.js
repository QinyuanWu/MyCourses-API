const CourseDao = require("../model/CourseDao.js");
const express = require("express");
const { addSampleCourses} = require("../data/courses.js");
const router = express.Router();

const courses = new CourseDao();
addSampleCourses(courses);

//get all courses with optional query(status)
router.get("/api/courses", (req, res) => {

});

//get a course given ID
router.get("/api/courses/:courseId", (req, res) => {

});

//add a course to db
router.post("/api/courses", (req, res) => {

});

//delete a course from db given ID
router.delete("/api/courses/:courseId", (req, res) => {

});

//update an exisitng course status
router.patch("/api/courses/:courseId", (req, res) => {

});

//search JHU CS courses
router.get("/api/search", (req, res) => {

});

module.exports = router;