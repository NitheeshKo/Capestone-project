// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subjectSchema = new Schema({
    name:  {
        type: String,
        required: true,
        unique: true
    },
    attendance:  {
        type: String,
        required: false
    },
	marks:  {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

require('mongoose-currency').loadType(mongoose);
var currency = mongoose.Types.Currency;// create a schema
var studentSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
	name: {
        type: String,
        required: true
    },
	branch: {
        type: String,
        required: true
    },
	sem: {
        type: String,
        required: true
    },
	year_of_join: {
        type: String,
        required: true
    },
	subjects:[subjectSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Students = mongoose.model('Student', studentSchema);

// make this available to our Node applications
module.exports = Students;