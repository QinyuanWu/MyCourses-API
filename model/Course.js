const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: { 
    type: String, 
    required: [true, "Path `title` is required."] 
  },
  number: { 
    type: String, 
    required: [true, "Path `number` is required."] 
  },
  term: { 
    type: String, 
    required: [true, "Path `term` is required."] 
  },
  status: { 
    type: String, 
    required: [true, "Path `status` is required."], 
    enum: ["taken", "enrolled", "interested"]}, //only accepts these status
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;