// grab the things we need
var multer = require('multer');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema(//ItemSchema(
  { img: 
      { data: Buffer, contentType: String }
  }
);
var Item = mongoose.model('Clothes',ItemSchema);

// make this available to our Node applications
module.exports = Item;