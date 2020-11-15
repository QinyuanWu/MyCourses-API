const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  number: { type: String, required: true },
  term: { type: String, required: true },
  status: { type: String, required: true }, //"taken", "enrolled", or "interested"
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;