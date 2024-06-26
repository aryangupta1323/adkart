require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const app = express();
const propRouter = require("./routers/properties");
const adminRouter = require("./routers/admin");
const authRouter = require("./routers/auth");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./models/user").User;
const store = new MongoDBStore({
	uri: process.env.MONGO_URL,
	collection: "sessions",
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "images")));
app.use(flash());
app.use((req, res, next) => {
	if (!req.session.user) return next();
	console.log(req.session.user._id);
	User.findById(req.session.user._id)
		.then((user) => {
			if (user) {
				req.user = user;
				next();
			} else {
				res.redirect("/login");
			}
		})
		.catch((err) => console.log(err));
});
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.errorMsg = [];
	// res.locals.csrfToken = req.csrfToken();
	next();
});
app.use(propRouter);
app.use(adminRouter);
app.use(authRouter);
app.use((req, res, next) => {
	res.render("404", {
		pageTitle: "Not Found",
	});
});
mongoose
	.connect(process.env.MONGO_URL)
	.then((res) => {
		app.listen(3000, "0.0.0.0", () => {
			console.log("server connected");
		});
		console.log("database connected");
	})
	.catch((err) => {
		console.log(err);
	});
