var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

var User = require('../model/User');

/* GET users listing. */

router.get('/', function(req, res, next) {

    res.send('respond with a resource');

});


// get all the users

router.get('/users', function(req, res) {

    User.find(function(err, users) {

        if (err)

            res.send(err);



        res.json(users);

    });

});



// get a specific user details

router.get('/users/:user_id', function(req, res) {

    User.findById(req.params.user_id, function(err, users) {

        if (err)

            res.send(err);



        res.json(users);

    });

});

/* Mobile Registration  */

router.post('/mobile-registration', function(req, res) {
    var user = {}; 

    user.mobile_number = req.body.mobile_number;
    user.otp = 1245;
    
    res.json({
        error: 'FALSE',
        error_msg: ' ',
        message: 'Otp send to registered mobile number',
        user: user
    });
});


/* Otp varifications */

router.post('/mobile-verification', function(req, res) {
    /********  Check user duplicacy  ********/
    User.findOne({
        mobile_number: req.body.mobile_number
    }, function(err, mobile) {
        if (err) {
            res.send(err);
        }
        if (mobile) {

            var user = {}; 

            user.mobile_number = req.body.mobile_number;
            user.deviceId = req.body.deviceId;
            user.userType = req.body.userType;

            res.json({
                error: 'TRUE',
                error_msg: 'Mobile Number Already Exists ',
                message: ' ',
                user: user
            });

        }else if(req.body.otp != 1245){
            var user = {}; 

            user.mobile_number = req.body.mobile_number;
            user.deviceId = req.body.deviceId;
            user.userType = req.body.userType;

            res.json({
                error: 'TRUE',
                error_msg: 'Wrong otp',
                message: 'Authentication Failed',
                user: user
            });
        } else {

            var user = new User(); // create a new instance of the User model

            user.mobile_number = req.body.mobile_number;
            user.deviceId = req.body.deviceId;
            user.userType = req.body.userType;
            
            // save the user details and check for errors

            user.save(function(err, user) {

                if (err)

                    res.send(err);
                res.json({
                    error: 'FALSE',
                    error_msg: ' ',
                    message: 'User created!',
                    user: user
                });

            });
        }
    });
});

// ----------------------------------------------------

// set Pin

router.put('/set-pin', function(req, res) {

    const data = {
        pin: req.body.pin
        
    };
    User.findByIdAndUpdate(req.body.user_id, data, function(err, user){
        
            if (err)

                res.send(err);

            res.json({
                error: 'FALSE',
                error_msg: ' ',
                message: 'Pin set Successfully !',
                user: user
            });
    });

});

// update a user details

router.put('/user-registration/', function(req, res) {

    const data = {
        name: req.body.name,
        mobile: req.body.mobile,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        address: req.body.address
    };
    User.findByIdAndUpdate(req.body.user_id, data, function(err, user){
        
            if (err)

                res.send(err);

            res.json({
                error: 'FALSE',
                error_msg: ' ',
                message: 'User updated !',
                status: '200',
                user: user
            });
    });

});



// Delete user

router.delete('/users/:user_id', function(req, res) {

    User.remove({

        _id: req.params.user_id

    }, function(err, user) {

        if (err)

            res.send(err);



        res.json({
            error: 'FALSE',
            error_msg: ' ',
            message: 'User deleted !',
            status: '200'
        });

    });

});

/*********  Login API  **********************/



router.post('/login', function(req, res) {



    User.findOne({
        deviceId: req.body.deviceId,
        pin: req.body.pin
    }, function(err, user) {

        if (err) {

            return res.status(500).send(err);

        }

        if (!user) {

            return res.send({
                error: "TRUE",
                error_msg: "UnAuthenticated user",
                status: "Failed to login"
            });

        }
        res.send({
            error: "FALSE",
            error_msg: " ",
            message: "Successfully login user ",
            userDetail: user
        });

    });
});

module.exports = router;