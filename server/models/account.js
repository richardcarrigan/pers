const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Account', accountSchema);
