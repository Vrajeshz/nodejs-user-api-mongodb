const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

const app = require("./app");
const port = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Database Connection
const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const server = app.listen(port, () => {
  console.log(`App running on Port ${port}`);
});

// Handle async errors (like rejected promises)
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
