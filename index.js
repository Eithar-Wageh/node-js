const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));
  const userRoutes = require("./routes/users");

  app.use("/api/v1/users", userRoutes);
  const postRoutes = require("./routes/posts");

app.use("/api/v1/posts", postRoutes);
const errorHandler = require("./middlewares/errorhandler");

app.use(errorHandler);
// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Secure Auth Lab");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});