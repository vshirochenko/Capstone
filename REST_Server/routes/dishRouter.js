module.exports = function () {
    var express = require('express');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    //debugger;
    var Dishes = require('../models/dishes');
    var Verify = require('./verify');

    var dishRouter = express.Router();
    dishRouter.use(bodyParser.json());


    ////////////////////////////////////////////////////////////////////allitems
    dishRouter.route('/')

    .get(function(req,res,next) {
        Dishes.find(req.query)
            .populate('comments.postedBy')
            .exec(function (err, dish) {
            // if (err) throw err;
            if (err) next(err);
            res.json(dish);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        //debugger;
        Dishes.create(req.body, function (err, dish) {
            if (err) throw err;
            console.log('Dish created!');
            var id = dish._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the dish with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Dishes.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });


    /////////////////////////////////////////////////////////////////////////dishId
    dishRouter.route('/:dishId')
    .get(function (req, res, next) {
        Dishes.findById(req.params.dishId)
            .populate('comments.postedBy')
            .exec(function (err, dish) {
            // if (err) throw err;
            if (err) next(err);
            res.json(dish);
        });
    })

    .put(function (req, res, next) {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, {
            new: true
        }, function (err, dish) {
            if (err) throw err;
            res.json(dish);
        });
    })

    .delete(function (req, res, next) {
        Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {       
            if (err) throw err;
            res.json(resp);
        });
    });


    ////////////////////////////////////////////////////////////////dishId/comments
    dishRouter.route('/:dishId/comments')
    //.all(Verify.verifyOrdinaryUser)
    .get(function (req, res, next) {
        Dishes.findById(req.params.dishId)
            .populate('comments.postedBy')
            .exec(function (err, dish) {
            // if (err) throw err;
            if (err) next(err);
            res.json(dish.comments);
        });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            // if (err) throw err;
            if (err) next(err);

            // req.body.postedBy = req.decoded._doc._id;
            req.body.postedBy = req.decoded._id;

            dish.comments.push(req.body);
            dish.save(function (err, dish) {
                // if (err) throw err;
                if (err) next(err);
                console.log('Updated Comments!');
                res.json(dish);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            // if (err) throw err;
            if (err) next(err);
            for (var i = (dish.comments.length - 1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save(function (err, result) {
                // if (err) throw err;
                if (err) next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all comments!');
            });
        });
    });


    //////////////////////////////////////////////////////////dishId/comments/commentId
    dishRouter.route('/:dishId/comments/:commentId')
    // .all(Verify.verifyOrdinaryUser)
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.dishId)
            .populate('comments.postedBy')
            .exec(function (err, dish) {
            // if (err) throw err;
            if (err) next(err);
            res.json(dish.comments.id(req.params.commentId));
        });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.dishId, function (err, dish) {
            // if (err) throw err;
            if (err) next(err);
            dish.comments.id(req.params.commentId).remove();

            // req.body.postedBy = req.decoded._doc._id;
            req.body.postedBy = req.decoded._id;

            dish.comments.push(req.body);
            dish.save(function (err, dish) {
                // if (err) throw err;
                if (err) next(err);
                console.log('Updated Comments!');
                res.json(dish);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (dish.comments.id(req.params.commentId).postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            dish.comments.id(req.params.commentId).remove();
            dish.save(function (err, resp) {
                // if (err) throw err;
                if (err) next(err);
                res.json(resp);
            });
        });
    });

    return dishRouter;
}();

