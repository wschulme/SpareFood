var mongoose = require('mongoose');

var foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0.0
    },
    organic: {
        type: Boolean,
        required: true
    },
    weight: {
        type: Number,
        required: true,
        min: 0.0
    }
}); 
var marketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    food: {
        type: [foodSchema]
    }
});

var Market = mongoose.model('Market', marketSchema);
var Food = mongoose.model('Food', foodSchema);

module.exports.Market = Market;
module.exports.Food = Food;