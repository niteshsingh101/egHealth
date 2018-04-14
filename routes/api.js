var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/healthapp'); // connect to our database

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

// ----------------------------------------------------

router.post('/users', function(req, res) {
    /********  Check user duplicacy  ********/
    User.findOne({
        mobile_number: req.body.mobile_number
    }, function(err, mobile) {
        if (err) {
            res.send(err);
        }
        if (mobile) {

            var user = {}; 

            user.name = " ";

            user.mobile_number = req.body.mobile_number;

            user.pin = " ";

            user.deviceId = " ";

            user.userType = req.body.userType;

            res.json({
                error: 'TRUE',
                error_msg: 'Mobile Number Already Exists ',
                user: user
            });

        } else {

            var user = new User(); // create a new instance of the User model

            user.name = req.body.name;

            user.mobile_number = req.body.mobile_number;

            user.pin = req.body.pin;

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
                    status: '200',
                    user: user
                });

            });
        }
    });
});

// update a user details

router.put('/users/:user_id', function(req, res) {

    User.findById(req.params.user_id, function(err, user) {

        if (err)

            res.send(err);

        user.name = req.body.name;

        user.mobile = req.body.mobile;

        user.pin = req.body.pin;

        user.userType = req.body.userType;

        console.log(user);

        // save the user details and check for errors

        user.save(function(err, user) {

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