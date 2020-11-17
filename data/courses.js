//add sample courses if db is empty
const samples = [
    {
      title: "Gateway Computing: Java",
      number: "500.112",
      term: "Fall 2019",
      status: "taken",
    },
    {
      title: "Intermediate Programming",
      number: "601.220",
      term: "Spring 2020",
      status: "taken",
    },
    {
      title: "Data Structures",
      number: "601.226",
      term: "Spring 2020",
      status: "taken",
    },
    {
      title: "Full-Stack JavaScript",
      number: "601.280",
      term: "Fall 2020",
      status: "enrolled",
    },
    {
      title: "Object-Oriented Software Engineering",
      number: "601.421",
      term: "Spring 2021",
      status: "interested",
    },
  ];

  async function addSampleCourses(courses) {
    const data = courses.readAll();

    if (data.length === 0) {
        for (let i = 0; i < samples.length; i++) {
            const sample = samples[i];
            await courses.create(sample.title, sample.number, sample.term, sample.status);
        }
    }
  }

  module.exports = { addSampleCourses };
  