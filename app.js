const express = require("express");

const globalErrorHandler = require("./../OwnAI/Controller/errorController");
const AppError = require("./utils/appError");

const userRouter = require("./Route/userRoute");

const app = express();

app.use(express.json());

// 1) Routes
app.use("/api/user", userRouter);

// 2) Handle unhandled routes (works with Express 5)
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 3) Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
