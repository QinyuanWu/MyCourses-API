const db = require("./data/db.js");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const app = express();
const courseRouter = require("./routes/courses.js");
const port = process.env.PORT || 4567;

db.connect();
//use middleware functions
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(courseRouter);

//launch api
app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`);
})
