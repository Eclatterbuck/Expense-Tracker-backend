//////////////////////////////
// MODELS
////////////////////////////////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
	name: {
		type: String,
		// trim: true,
		// required: [true, "Please Add Some Text"],
	},
	image: {
		type: String,
		
	},
	amount: {
		type: String,
	
	},
});

module.exports = mongoose.model("Expense", ExpenseSchema);