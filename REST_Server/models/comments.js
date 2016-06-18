// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    comment:  {
        type: String,
        required: true
    },
    postedBy: {
        type: String
    },
    date: {
        type: String
    }
}, {
    timestamps: true
});
// the schema is useless so far
// we need to create a model using it
var Comments = mongoose.model('Comment', commentSchema);

// make this available to our Node applications
module.exports = Comments;