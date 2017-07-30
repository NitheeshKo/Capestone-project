var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Students = require('../models/student');
var Verify = require('./verify');

var studentRouter = express.Router();
studentRouter.use(bodyParser.json());

var Studentsdb = db.model('Student');

studentRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Studentsdb.find({})
        //.populate('comments.postedBy')
        .exec(function (err, stu) {
        if (err) throw err;
        res.json(stu);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Studentsdb.create(req.body, function (err, stu) {
        if (err){
			var err = new Error('Entered details should be valid!');
            err.status = 412;
            return next(err);
		} //throw err;
        console.log('stu created!');
        var id = stu._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('Added the stu with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Studentsdb.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

studentRouter.route('/:studId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Studentsdb.findById(req.params.studId)
        //.populate('comments.postedBy')
        .exec(function (err, stu) {
        if (err) throw err;
        res.json(stu);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Studentsdb.findByIdAndUpdate(req.params.studId, {
        $set: req.body
    }, {
        new: true
    }, function (err, stu) {
        if (err) throw err;
        res.json(stu);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Studentsdb.findByIdAndRemove(req.params.studId, {w: 'majority' }, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

studentRouter.route('/:studId/subjects')
.all(Verify.verifyOrdinaryUser)

.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Studentsdb.findById(req.params.studId)
        //.populate('subjects.postedBy')
        .exec(function (err, sub) {
        if (err) throw err;
        res.json(sub.subjects);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Studentsdb.findById(req.params.studId, function (err, sub) {
        if (err){
			var err = new Error('Entered details should be valid!');
            err.status = 412;
            return next(err);
		} // throw err;
		try{
			req.body.postedBy = req.decoded._doc._id;
			sub.subjects.push(req.body);
			sub.save(function (err, sub) {
				if (err) throw err;
				console.log('Updated subjects!');
				res.json(sub);
			});
		}
		catch(err){
			return next(err);
		}
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Studentsdb.findById(req.params.studId, function (err, sub) {
        if (err) throw err;
        for (var i = (sub.subjects.length - 1); i >= 0; i--) {
            sub.subjects.id(sub.subjects[i]._id).remove();
        }
        sub.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all subjects!');
        });
    });
});

studentRouter.route('/:studId/subjects/:subjectId')
.all(Verify.verifyOrdinaryUser)

.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Studentsdb.findById(req.params.studId)
        //.populate('subjects.postedBy')
        .exec(function (err, sub) {
        if (err) throw err;
        res.json(sub.subjects.id(req.params.subjectId));
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
	console.log('at subject put...req:');
	console.dir(req.params);
    Studentsdb.findById(req.params.studId, function (err, sub) {
		console.log('after fetcjing student');
		console.dir(sub);
        if (err) {
			//var err = new Error('Entered details should be valid!');
            //err.status = 500;
            return next(err);
		} // throw err;//throw err;
        sub.subjects.id(req.params.subjectId).remove();
        ///req.body.postedBy = req.decoded._doc._id;
		console.log('req.body:');
		console.dir(req.body);
        sub.subjects.push(req.body);
        sub.save(function (err, sub) {
            if (err) throw err;
            console.log('Updated subjects!');
            res.json(sub);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Studentsdb.findById(req.params.studId, function (err, sub) {
        /*if (sub.subjects.id(req.params.subjectId).postedBy
           != req.decoded._doc._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }*/
        sub.subjects.id(req.params.subjectId).remove();
        sub.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = studentRouter;