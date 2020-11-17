require("dotenv").config(); //search for env variables
const mongoose = require("mongoose");

//set up db connection link
const password = process.env.DB_ADMIN_PASSWORD;
const dbname = "mycourses-db";
const URI = `mongodb+srv://mycourses-admin:${password}@courses-api.m9hj8.mongodb.net/${dbname}?retryWrites=true&w=majority`;
//config connect options
const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

//establish connection to cloud database
function connect() {
    mongoose.connect(URI, option);

    //handle events emitted by the connection process
    mongoose.connection.on("error", (err) => {
        console.log(err);
    });

    mongoose.connection.on("open", () => {
        console.log("Connected to MongoDB~");
    });
}

module.exports = { connect };