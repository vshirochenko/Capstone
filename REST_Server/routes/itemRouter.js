module.exports = function () {
    var express = require('express');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    //debugger;
    var Items = require('../models/items');
    var Verify = require('./verify');

    var itemRouter = express.Router();
    itemRouter.use(bodyParser.json());


    ////////////////////////////////////////////////////////////////////allitems
    itemRouter.route('/')

    .get(function(req,res,next) {
        Items.find(req.query)
            .exec(function (err, item) {
            // if (err) throw err;
            if (err) next(err);
            res.json(item);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        debugger;
        Items.create(req.body, function (err, item) {
            if (err) throw err;
            console.log('Item created!');
            var id = item._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the item with id: ' + id);
        });
    })

    // We cannot delete all items from catalog
    /*.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Items.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });*/


    /////////////////////////////////////////////////////////////////////////dishId
    itemRouter.route('/:itemId')
    .get(function (req, res, next) {
        Items.findById(req.params.itemId)
            .exec(function (err, item) {
            // if (err) throw err;
            if (err) next(err);
            res.json(item);
        });
    })

    /*.put(function (req, res, next) {
        Items.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, {
            new: true
        }, function (err, dish) {
            if (err) throw err;
            res.json(dish);
        });
    })*/

    .delete(function (req, res, next) {
        Items.findByIdAndRemove(req.params.dishId, function (err, resp) {       
            if (err) throw err;
            res.json(resp);
        });
    });


    return itemRouter;
}();

