const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propSchema = new Schema({
	address: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	bed: {
		type: Number,
		required: true,
	},
	washroom: {
		type: Number,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	imgPath: [
		{
			imageUrl: {
				type: String,
				required: true,
			},
		},
	],
	rent: {
		type: Number,
		required: true,
	},
});

module.exports.Property = mongoose.model("Property", propSchema);
