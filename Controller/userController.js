const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../modles/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove the password form the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "succuss",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    city: req.body.city,
    country: req.body.country,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exits
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exits && password is correct
  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect Email or Password", 401));

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's exits
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exits
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError("The User belonging to this token does no exits!", 401)
    );

  // Grant Acces to procted route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action ", 403)
      );
    }
    next();
  };
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const alluser = await User.find();

  res.status(200).json({
    status: "succuss",
    data: {
      alluser,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.find(req.user);

  res.status(200).json({
    status: "succuss",
    data: {
      user,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: "succuss",
    data: {
      user,
    },
  });
});
