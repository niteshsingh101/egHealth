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

            res.json({
                error: 'TRUE',
                error_msg: 'Mobile Number Already Exists ',
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
                    message: 'User created!',
                    status: 'Ok',
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
                message: 'User updated!',
                status: 'Ok'
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
            message: 'Successfully deleted'
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
                message: "UnAuthenticated user",
                status: "Failed to login"
            });

        }
        res.send({
            message: "Successfully login user ",
            userDetail: user
        });

    });
});

module.exports = router;