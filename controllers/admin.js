const { User } = require("../models/user");
const { validationResult } = require("express-validator/check");
const Property = require("../models/property").Property;

const cloudinary = require("cloudinary").v2;
let streamifier = require("streamifier");

cloudinary.config({
	cloud_name: "dksatozgl",
	api_key: "758268333598911",
	api_secret: "FRR0u1s3EXvDZtUNlEuhM1xBdTk",
});

exports.getAddProperty = (req, res, next) => {
	res.render("add-property", {
		pageTitle: "Add Property",
		oldInput: {},
	});
};

exports.postAddProperty = async (req, res, next) => {
	console.log(req.body);
	console.log(req.files);
	const files = req.files;
	const imagePath = [];
	async function uploadFile(file) {
		return new Promise((resolve, reject) => {
			let cld_upload_stream = cloudinary.uploader.upload_stream(
				{ folder: "properties" },
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						console.log(result);
						console.log(result.secure_url, result.url);
						resolve(result.secure_url); // Resolve with the URL
					}
				}
			);
			streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
		});
	}

	async function uploadFiles(files) {
		for (let i = 0; i < files.length; i++) {
			try {
				const url = await uploadFile(files[i]); // Wait for each file to be uploaded
				imagePath.push({ imageUrl: url });
			} catch (error) {
				console.error("Upload failed for file:", files[i], error);
				// Optionally, handle the error, e.g., by continuing with the next file
			}
		}
		console.log(imagePath);
	}

	// Call uploadFiles with your files
	const x = await uploadFiles(req.files);

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

exports.postProfile = async (req, res, next) => {
	console.log(req.file);
	let imgPath;

	async function uploadFile(file) {
		return new Promise((resolve, reject) => {
			let cld_upload_stream = cloudinary.uploader.upload_stream(
				{ folder: "profile" },
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						// console.log(result);
						// console.log(result.secure_url, result.url);
						resolve(result.secure_url); // Resolve with the URL
					}
				}
			);
			streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
		});
	}

	async function uploadFiles(file) {
		try {
			const url = await uploadFile(file); // Wait for each file to be uploaded
			imgPath = url;
		} catch (error) {
			console.error("Upload failed for file:", file, error);
			// Optionally, handle the error, e.g., by continuing with the next file
		}
		console.log(imgPath);
	}

	// Call uploadFiles with your files
	const x = await uploadFiles(req.file);

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
