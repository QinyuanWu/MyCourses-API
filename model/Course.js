const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//a blueprint of the course object
const CourseSchema = new Schema({
  title: { 
    type: String, 
    required: [true, "Path `title` is required."] 
  },
  number: { 
    type: String, 
    required: [true, "Path `term` is required."] 
  },
  term: { 
    type: String, 
    required: [true, "Path `number` is required."] 
  },
  status: { 
    type: String, 
    required: [true, "Path `status` is required."], 
    enum: ["taken", "enrolled", "interested"]}, //only accept these status
});

//create a collection base on the schema
const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;