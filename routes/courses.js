//does not hide version key for create!!!
const CourseDao = require("../model/CourseDao.js");
const express = require("express");
const { addSampleCourses } = require("../data/courses.js");
const router = express.Router();
const _ = require("lodash");

const courses = new CourseDao();
addSampleCourses(courses);

//get all courses with optional query(status)
//return empty data field if status query is not empty but invalid
router.get("/api/courses", (req, res) => {
    const status = req.query.status;
    courses.readAll(status)
        .then((courses) => res.json({ data: courses })) //wrap found courses in data field
        .catch((err) => errorHandler(res, 500, err)); //server error
});

//get a course given ID
router.get("/api/courses/:courseId", (req, res) => {
    const id = req.params.courseId;
    courses.read(id)
        .then((course) => 
            course 
                ? res.json({ data: course }) //found the course
                : errorHandler(res, 404, "Resource not found")
        )
        .catch((err) => errorHandler(res, 500, err)); //server error
});

//add a course to db
router.post("/api/courses", (req, res) => {
    courses.create(req.body.title, req.body.term, req.body.number, req.body.status)
        .then((course) => {
            console.log(course);
            res.status(201).json({ data: _.omit(course, ["__v"]) }); //tODO: does not hide versionkey!!!
        }) //success
        .catch((err) => errorHandler(res, 400, err)); //bad request
});

//delete a course from db given ID
router.delete("/api/courses/:courseId", (req, res) => {
    const id = req.params.courseId;
    courses.delete(id)
        .then((course) => 
            course 
                ? res.json({ data: course }) //found the course
                : errorHandler(res, 404, "Resource not found")
        )
        .catch((err) => errorHandler(res, 400, err)); //invalid id, bad request
});

//update an exisitng course status
router.patch("/api/courses/:courseId", (req, res) => {
    const id = req.params.courseId;
    const status = req.body.status;
    courses.update(id, status)
        .then((course) => 
            course 
                ? res.json({ data: course }) //found the course
                : errorHandler(res, 404, "Resource not found")
        )
        .catch((err) => errorHandler(res, 400, err)); //invalid id or status, bad request
});

//search JHU CS courses
router.get("/api/search", (req, res) => {

});

//set status code of the response and send error info to the user in json 
function errorHandler(res, status, err) {
    res.status(status).json({
        errors: [
            {
                status: status,
                detail: err.message || err, //if err does not have a message property, just return err
            },
        ],
    });
}

module.exports = router;