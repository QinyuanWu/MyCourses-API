require("dotenv").config(); //search for env variables
const CourseDao = require("../model/CourseDao.js");
const express = require("express");
const { addSampleCourses } = require("../data/courses.js");
const { paginateResults } = require("./pagination.js");
const router = express.Router();
const axios = require("axios");
const SIS_API_KEY = process.env.SIS_API_KEY;

const courses = new CourseDao();
addSampleCourses(courses);

//cache cs courses from SIS API
let csCourses;
axios.get(`https://sis.jhu.edu/api/classes?key=${SIS_API_KEY}&school=Whiting School of Engineering&department=EN Computer Science`)
    .then((response) => {
        csCourses = response.data.filter(course => course.SectionName === "01"); //filter duplicate courses
        csCourses = extractProperty(csCourses);
        console.log("SIS API cached!");
    })
    .catch((err) => errorHandler(res, 500, err)); //server error

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
            res.status(201).json({ data: course }); 
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
    if (!csCourses) {
        errorHandler(res, 500, "SIS API is being cached. Please wait and try the request later.")
    } else {
        const query = req.query.query;
        const page = Number.parseInt(req.query.page);
        const limit = Number.parseInt(req.query.limit);
        try {
            paginateResults(res, csCourses, query, page, limit);
        } 
        catch (err) {
            err.message === "Resource not found"
                ? errorHandler(res, 404, err)
                : errorHandler(res, 400, err); //bad request
        }
    }
});

//csCourses is an array of individual JSON courses with full attributes.
//return an array of courses with only title, number, term properties.
function extractProperty(csCourses) {
    let briefCourses = [];
    for(let i in csCourses) {
        //extract attributes
        let brief = { 
            "title": csCourses[i].Title,
            "number": csCourses[i].OfferingName.substring(3), //omit "EN." for fomatting purpose
            "term": csCourses[i].Term,
        };
        briefCourses.unshift(brief); //reverse chronological order
    }
    return briefCourses;
}

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