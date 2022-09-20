const { User } = require("../models/user");
const { validationResult } = require("express-validator/check");
const Property = require("../models/property").Property;
// const firebase = require("../firebase"); // reference to our db
// // const firestore = firebase.firestore(); // if using firestore
// const { getStorage } = require("firebase/storage"); // must be required for this to work
// const storage = getStorage().ref(); // create a reference to storage
// global.XMLHttpRequest = require("xhr2"); // must be used to avoid bug

exports.getAddProperty = (req, res, next) => {
	res.render("add-property", {
		pageTitle: "Add Property",
		oldInput: {},
	});
};

exports.postAddProperty = (req, res, next) => {
	console.log(req.body);
	console.log(req.files);
	const files = req.files;
	const imagePath = [];
	for (let i = 0; i < files.length; i++) {
		imagePath.push({ imageUrl: files[i].path });
	}

	// const timestamp = Date.now();
	// const name = file.originalname.split(".")[0];
	// const type = file.originalname.split(".")[1];
	// const fileName = `${name}_${timestamp}.${type}`;

	// const imageRef = storage.child(fileName);
	// // Step 2. Upload the file in the bucket storage
	// const snapshot = imageRef.put(file.buffer);
	// // Step 3. Grab the public url
	// const downloadURL = snapshot.ref.getDownloadURL();
	// console.log(downloadURL);
	const propAddress = req.body.address;
	const propYear = req.body.year;
	const propDescription = req.body.description;
	const propRent = req.body.rent;
	const propContact = req.body.contact;
	const propCity = req.body.city;
	const propBed = req.body.bed;
	const propWashroom = req.body.washroom;
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(402).render("add-property", {
			pageTitle: "Add Property",
			errorMsg: error.array().map((error) => error.msg),
			oldInput: {
				propAddress,
				propBed,
				propCity,
				propContact,
				propDescription,
				propRent,
				propWashroom,
				propYear,
			},
		});
	}
	const new_property = new Property({
		description: propDescription,
		address: propAddress,
		city: propCity,
		year: propYear,
		contact: propContact,
		rent: propRent,
		bed: propBed,
		washroom: propWashroom,
		userId: req.session.user._id,
		imgPath: imagePath,
	});
	new_property
		.save()
		.then((result) => {
			res.redirect("/");
		})
		.catch((err) => {
			console.log(err);
			res.redirect("/add-property");
		});
};

exports.getYourProperties = (req, res, next) => {
	Property.find({ userId: req.session.user._id })
		.then((props) => {
			if (props) {
				res.render("your-properties", {
					pageTitle: "Your Properties",
					properties: props,
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postDeleteProperty = (req, res, next) => {
	const userId = req.body.userId;
	const propId = req.params.propId;

	if (userId == req.session.user._id) {
		Property.findByIdAndDelete({ _id: propId }).then((result) => {
			if (result) {
				res.redirect("/your-properties");
			} else {
				console.log("property cannot be found");
			}
		});
	} else {
		console.log("You dont have access to delete this property");
	}
};

exports.getProfile = (req, res, next) => {
	User.findOne({ _id: req.session.user._id })
		.then((user) => {
			console.log(user);
			if (user) {
				Property.find({ userId: user._id })
					.then((properties) => {
						if (properties)
							res.render("profile", {
								pageTitle: "Your Profile",
								user: user,
								properties: properties,
							});
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				res.redirect("/");
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postProfile = (req, res, next) => {
	console.log(req.file);
	const imgPath = req.file.path;

	User.findOne({ _id: req.session.user._id })
		.then((user) => {
			console.log(user);
			if (user) {
				user.imgPath = imgPath;
				user.save();
				res.redirect("/profile");
			}
		})
		.catch((err) => {
			console.log(err);
		});
};
