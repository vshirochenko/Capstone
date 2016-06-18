module.exports = function () {
    var express = require('express');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    //debugger;
    var Comments = require('../models/comments');
    var Verify = require('./verify');

    var commentRouter = express.Router();
    commentRouter.use(bodyParser.json());


    ////////////////////////////////////////////////////////////////////allitems
    commentRouter.route('/')

    .get(function(req,res,next) {
        Comments.find(req.query)
            //.populate('postedBy')
            .exec(function (err, comment) {
            debugger;
            // if (err) throw err;
            if (err) next(err);
            res.json(comment);
        });
    })

    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Comments.create(req.body, function (err, comment) {
            if (err) throw err;
            console.log('Item created!');
            var id = comment._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the comment with id: ' + id);
        });
    })


    return commentRouter;
}();

