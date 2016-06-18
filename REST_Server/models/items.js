// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;
var itemSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    imageSrc: {
        type: String,
        required: true,
        unique: false
    },
    price: {
        type: Currency
    },
    discount: {
        type: Number
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Items = mongoose.model('Item', itemSchema);

// make this available to our Node applications
module.exports = Items;