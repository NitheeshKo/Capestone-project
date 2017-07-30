var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');
var passport = require('passport');
var async = require('async');
var assert = require('assert');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};
exports.verifyAdmin = function (req, res, next) {
var user_info=function(callback)
{
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	console.log('before token');
	// decode token
	if (token) {
	console.log('after token');
		// verifies secret and checks exp
		jwt.verify(token, config.secretKey, function (err, decoded) {
			if (err) {
				var err = new Error('You are not authenticated!');
				err.status = 401;
				return next(err);
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				//console.log('req.decoded:'+req.decoded);
				//console.dir(req);
				console.log('req.decoded username:'+req.decoded._doc.username);
				next();
				callback(null,req.decoded._doc.username);
			}
		});
	} else {
		// if there is no token
		// return an error
		var err = new Error('No token provided!');
		err.status = 403;
		return next(err);
	}	
};
var db_info = function(callback)
{
	//console.log('User.admin:'+ User.admin);
	//Mongo mongo = new Mongo( new DBAddress( "localhost", 127017 ) );
	//DB db = mongo.getDB( "students" );
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost:27017/students", function(err, db) {
	var collection = db.collection('users');
	var admin_users_array=collection.find( { "admin": true } );//find();
	console.log('admin_array:');
	console.log(typeof admin_users_array);
	callback(null,admin_users_array);
	});
};//end of db_info
var getcount = function(callback)
{
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost:27017/students", function(err, db) {
	var collection = db.collection('users');
	collection.find( { "admin": true } ).count().then(function(numItems) {
      console.log(numItems); // Use this to debug
      callback(null,numItems);
    });
	});
};
async.series([
    user_info,
    db_info,
	getcount
], function (err, results) {
		var counter=0; 
		var admin_flag=false;
		console.log('inside callback');
		console.log('results.Readable');
		//console.dir(results[1]);
		var decoded_username=results[0];
		var admin_users=results[1];
		var count_item=results[2];
		console.log('count_item');
		console.log(count_item);
		if(count_item<=0)
		{
			var err = new Error('You are not authenticated!');
			err.status = 401;
			return next(err);
		}
		//console.dir(results);
		/////
		admin_users.each(function(err, doc) {
		  counter=counter+1;
		  assert.equal(err, null);
		  if (doc != null) {
			 //console.dir(doc);
			 console.dir('doc.username:'+doc.username);
			 if(decoded_username == doc.username)
			 {
				admin_flag=true;
				console.log('admin_flag set');
				next();
			 }
				
		  }
		  console.log('counter');
		  console.log(counter);
		  console.log('count_item');
		  console.log(count_item);
			if(	counter==count_item)
			{
				if(admin_flag==false)
				{
					var err = new Error('You are not authenticated!');
					err.status = 401;
					return next(err);
				}
			}
	   });
	   /////
});
};//end of verify admin

exports.getusers = function (callback) {

var count_n;
var MongoClient = require('mongodb').MongoClient;
var getalluser_count = function(callback)
{
	MongoClient.connect("mongodb://localhost:27017/students", function(err, db) {
	var collection = db.collection('users');
	collection.find().count().then(function(numItems) {
      console.log(numItems); // Use this to debug
	  count_n=numItems;
      callback(null,numItems);
    });
	});
};
var itr_func=function(callback)
{
	var all_users=[];
	var counter=0; 
	MongoClient.connect("mongodb://localhost:27017/students", function(err, db) {
	var collection = db.collection('users');
	var users_array=collection.find();
	users_array.each(function(err, doc) {
	counter=counter+1;
	assert.equal(err, null);
	if (doc != null) {
	all_users.push(doc);
	}
	if(counter==count_n)
	{
	callback(null,all_users);
	}
	});
});
};
async.series([
    getalluser_count,
    itr_func
], function (err, results) {
	var users_all=results[1];
	console.log('users_all');
	console.log(users_all);
	callback(users_all);
});

	
};
/*
var all_users=[];
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost:27017/students", function(err, db) {
	var collection = db.collection('users');
	var users_array=collection.find();
	var user_count=collection.find().count();
	//console.log('getusers:');
	//console.log(users_array);
	users_array.each(function(err, doc) {
	assert.equal(err, null);
	if (doc != null) {
	all_users.push(doc);
	}
	});
	console.log('all_users');
	console.log(all_users);
	callback(all_users);
	});
*/