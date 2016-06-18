module.exports = function () {
    var express = require('express');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    //debugger;
    var Favorites = require('../models/favorites');
    var Verify = require('./verify');

    var favoriteRouter = express.Router();
    favoriteRouter.use(bodyParser.json());


    ////////////////////////////////////////////////////////////////////allitems
    favoriteRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function(req,res,next) {
        Favorites.findOne({})
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, favorite) {
                if (err) throw err;
                
                res.json(favorite);
            });
    })

    .post(Verify.verifyOrdinaryUser, function(req, res, next) {

        Favorites.findOneAndUpdate({"postedBy":req.decoded._doc._id}, {upsert: true}, function(err, f) {
            if (err) throw err;
            if (f != null) {
                if (f.dishes.indexOf(req.body._id) > -1) {
                    var err = new Error('This recipe is already in your favorite list');
                    err.status = 401;
                    return next(err);
                }
                else {
                    f.dishes.push(req.body);
                    f.postedBy = req.decoded._doc._id;
                    f.save(function(err, favorite) {
                        if (err) throw err;
                        res.json(favorite);
                    });
                }
                
                //res.json(f);
            }
            else {
                Favorites.create(req.body, function (err, fav) {
                    if (err) throw err;

                    fav.dishes.push(req.body);
                    fav.postedBy = req.decoded._doc._id;

                    fav.save(function (err, favorite) {
                        if (err) throw err;
                        res.json(favorite);
                    });
                });
            }
        });
    })

    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Favorites.remove({"postedBy":req.decoded._doc._id}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

    /////////////////////////////////////////////////////////////favorites/id

    favoriteRouter.route('/:dishObjectId')

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({postedBy: req.decoded._doc._id}, function (err, f) {
            var id = req.params.dishObjectId;
            for (var i = 0; i < f.dishes.length; i++){
                if (f.dishes[i] == id) {
                    f.dishes.splice(i, 1);
                    break;
                }
            }
            f.save(function(err, fav) {
                if (err) throw err;
                res.json(fav);
            });
        });


        /*Favorites.findById(req.params.dishObjectId, function (err, dish) {
            if (err) throw err;
            for (var i = (dish.comments.length - 1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save(function (err, result) {
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all comments!');
            });
        });*/
    });




    return favoriteRouter;
}();

