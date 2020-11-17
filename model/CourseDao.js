const Course = require("./Course.js");

/*
	Deploy CRUD operations on Course
	Use built-in functions of Course model to access data
	All functions return promise and need exception handling
	Versionkey is hidden for all queries
*/
class CourseDao {
	constructor() {
	}

	//create a course document
	async create(title, number, term, status) {
		const course = await Course.create({ title, number, term, status });
		return course;
	}

	//return all courses matching the specified status
	//if status not specified, return all courses
	async readAll(status = "") {
		const filter = status ? { status } : {};
		const courses = await Course.find(filter).select('-__v');
		return courses;
	}

	//return the course with the matching id
	async read(id) {
		const course = await Course.findById(id).select('-__v');
		return course;
	}

	//validate and update the given status of a course with the matching id
	async update(id, status) {
		const course = await Course.findByIdAndUpdate(
			id,
			{ status },
			{ new: true, runValidators: true}
		).select('-__v');
		return course;
	}

	//delete a course with the matching id from the database
	async delete(id) {
		const course = await Course.findByIdAndDelete(id).select('-__v');
		return course;
	}
}

module.exports = CourseDao;