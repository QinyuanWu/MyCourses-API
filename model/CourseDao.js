const Course = require("./Course.js");

//deploy CRUD operations
//use built-in functions of Course model to access data
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
		const courses = await Course.find(filter);
		return courses;
	}

	//return the course with the matching id
	async read(id) {
		const course = await Course.findById(id);
		return course;
	}

	//validate and update the given status of a course with the matching id
	async update(id, status) {
		const course = await Course.findByIdAndUpdate(
			id,
			{ status },
			{ new: true, runValidators: true}
		);
		return course;
	}

	async delete(id) {
		const course = await Course.findByIdAndDelete(id);
		return course;
	}
}

module.exports = CourseDao;