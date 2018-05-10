var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    calcBmi = require('bmi-calc'),
    request = require('request'),
    math = require('mathjs'),
    AWS = require('aws-sdk'),
    codes = require("rescode"),
    qs = require('req-param'),
   // NodeGeocoder = require('node-geocoder'),
    Q = require('q'),
    User = require('../model/User'),
    personalData = require('../model/personalData'),
    bodyProgress = require('../model/bodyProgress'),
    Specialties = require('../model/Specialties'),
    Timeslot = require('../model/Timeslot');
    facilities = require('../model/facilities');

var config = {
  "aws" : {
        "bucket": "healthappimages",
        "domain" : "",
        "prefix" : "",
        "path": "profilepics/",
        "credentials" : {
            "accessKeyId": "AKIAJZJL3TPI3D6XJ2RA",
            "secretAccessKey": "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"
        }
    }
};  

/* GET users listing. */
router.get('/', function(req, res, next) {

    res.send('respond with a resource');

});

/* get all the users */
router.get('/users', function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});

/* get a specific user details */
router.get('/users/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});

/* Mobile Registration  */
router.post('/mobile-registration2', function(req, res) {
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

router.post('/mobile-registration', function(req, res) {
    var user = {};
    user.mobile_number = req.body.mobile_number;
    var randonVal = Math.floor(1000 + Math.random() * 9000);        
    var messageText = "Your eFitness OTP is " + randonVal; 
    var smsUrl = "http://control.msg91.com/api/sendotp.php?authkey=210417A0Dyqjnbk85ad597e5&message="+ messageText +"&sender=OTPSMS&mobile=91" + user.mobile_number + "&otp=" + randonVal;   
    var options = {};
        options.url = smsUrl;
        options.method = 'GET';
        request(options, function (error, response, data) {
            User.findOne({
                mobile_number: user.mobile_number
            }, function(err, mobile) {
                    if (err)
                        res.send(err);                  
                    if (mobile) {
                    User.update({
                        mobile_number: req.body.mobile_number
                    }, {
                        $set: {
                            otp: randonVal
                        }
                    }, function(err, user) {
                            if (err)
                                res.send(err);                          
                            user.otp = randonVal; //1245;
                            res.json({
                                error: 'FALSE',
                                error_msg: ' ',
                                message: 'Otp send to registered mobile number',
                                user: mobile
                            });
                        });
                    }
                    else{
                        res.json({
                                error: 'TRUE',
                                error_msg: ' Mobile number is not registered',
                                message: ' '
                            });
                    }
                })
        }, function(error, response, body) {
            if (error)
            console.log(error);
        });      
});

/* Step 1 -User Registration */
router.post('/user-registration', function(req, res) {
    var randonVal = Math.floor(1000 + Math.random() * 9000);        
    var messageText = "Your eFitness OTP is " + randonVal;              
    User.findOne({$or:[{mobile_number: req.body.mobile_number},{deviceId: req.body.deviceId}]},
    function(err, result) {
        if (err)
            res.send(err);
        if (result) {
            console.log("Result", result);
            var user = {};
            user._id = " ";
            user.name = req.body.name;
            user.mobile_number = req.body.mobile_number;
            user.age = req.body.age;
            user.gender = req.body.gender;
            user.email = req.body.email;
            user.address = req.body.address;
            user.deviceId = req.body.deviceId;
            user.userType = req.body.userType;
            user.status = req.body.status;
            user._v = 0;
       
            res.json({
                error: 'TRUE',
                error_msg: 'Mobile number already exists or User already registered ',
                message: ' ',
                user: user
            });
        } else {
            var user = new User();
            user.name = req.body.name;
            user.mobile_number = req.body.mobile_number;
            user.age = req.body.age;
            user.gender = req.body.gender;
            user.email = req.body.email;
            user.address = req.body.address;
            user.deviceId = req.body.deviceId;
            user.userType = req.body.userType;
            user.status = 0;
            user.otp = randonVal;
            user.save(function(err, user) {
                if (err)
                    res.send(err);                    
           //-------------------- start mobile verification --------------------------------
                var smsUrl = "http://control.msg91.com/api/sendotp.php?authkey=210417A0Dyqjnbk85ad597e5&message="+ messageText +"&sender=OTPSMS&mobile=91" + user.mobile_number + "&otp=" + randonVal;   
                var options = {};
                    options.url = smsUrl;
                    options.method = 'GET';
                    request(options, function (error, response, data) {                                     
                        res.json({
                                error: 'FALSE',
                                error_msg: ' ',
                                message: 'User created !',
                                user: user
                            });                     
                    }, function(error, response, body) {
                        if (error)
                        console.log(error);
                    });                  
            //-------------------- end mobile verification --------------------------------            
            });
        }
    });
});
/*
router.post('/user-registration2', function(req, res) {
    User.findOne({
        mobile_number: req.body.mobile_number
    }, function(err, mobile) {
        if (err)
            res.send(err);
        if (mobile) {
            var user = {};
            user._id = " ";
            user.name = req.body.name;
            user.mobile_number = req.body.mobile_number;
            user.age = req.body.age;
            user.gender = req.body.gender;
            user.email = req.body.email;
            user.address = req.body.address;
            user.deviceId = req.body.deviceId;
            user.userType = req.body.userType;
            user.status = req.body.status;
            user._v = 0;
            res.json({
                error: 'TRUE',
                error_msg: 'Mobile Number Already Exists ',
                message: ' ',
                user: user
            });
        } else {
            var user = new User();
            user.name = req.body.name;
            user.mobile_number = req.body.mobile_number;
            user.age = req.body.age;
            user.gender = req.body.gender;
            user.email = req.body.email;
            user.address = req.body.address;
            user.deviceId = req.body.deviceId;
            user.userType = req.body.userType;
            user.status = 0;

            user.save(function(err, user) {
                if (err)
                    res.send(err);

                res.json({
                    error: 'FALSE',
                    error_msg: ' ',
                    message: 'User created !',
                    user: user
                });
            });
        }
    });
});
*/

/* Step 2 - Otp varifications */
/*router.put('/mobile-verification2', function(req, res) {
    var otp = req.body.otp;
    if (otp != 1245) {
        res.json({
            error: 'TRUE',
            error_msg: 'Wrong otp',
            message: 'Authentication Failed'
        });
    } else {
        User.update({
            mobile_number: req.body.mobile_number
        }, {
            $set: {
                status: 1
            }
        }, function(err, user) {

            if (err)

                res.send(err);
            console.log(user);
            res.json({
                error: 'FALSE',
                error_msg: ' ',
                message: 'Phone number verified successfully !'

            });
        });
    }
}); */

router.put('/mobile-verification', function(req, res) { 
    User.findOne({
                mobile_number: req.body.mobile_number, otp :req.body.otp
            }, function(err, data) {                
                if (err)
                    res.send(err); 
                if (!data){
                    res.json({
                            error: 'TRUE',
                            error_msg: 'Wrong mobile number',
                            message: 'Authentication Failed'
                        }); 
                }else {
                    var otp = req.body.otp;
                    if (otp != data.otp) {
                        res.json({
                            error: 'TRUE',
                            error_msg: 'Wrong otp',
                            message: 'Authentication Failed'
                        });
                    } else {
                        User.update({
                            mobile_number: req.body.mobile_number
                        }, {
                            $set: {
                                status: 1
                            }
                        }, function(err, user) {

                            if (err)
                                res.send(err);                          
                            res.json({
                                error: 'FALSE',
                                error_msg: ' ',
                                message: 'Phone number verified successfully !'
                            });
                        });
                }
            }
    });
});

/*  Step 3 - set Pin */
router.put('/set-pin', function(req, res) {
    const data = {
        pin: req.body.pin
    };
    User.findByIdAndUpdate(req.body.user_id, data, function(err, user) {
        if (!user) {
            var user = {};
            user._id = " ";
            user.name = " ";
            user.mobile_number = " ";
            user.age = 0;
            user.gender = " ";
            user.email = " ";
            user.address = " ";
            user.deviceId = " ";
            user.userType = " ";
            user.status = 0;
            user._v = 0;
            user.pin = req.body.pin;
            res.json({
                error: 'TRUE',
                error_msg: ' ',
                message: 'Wrong device Id enterd !',
                user: user
            });
        } else {
            res.json({
                error: 'FALSE',
                error_msg: ' ',
                message: 'Pin set Successfully !',
                user: user
            });
        }
    });
});

/* Delete user */
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
            var user = {};
            user._id = " ";
            user.name = " ";
            user.mobile_number = " ";
            user.age = 0;
            user.gender = " ";
            user.email = " ";
            user.address = " ";
            user.pin = 0;
            user.deviceId = req.body.deviceId;
            user.userType = " ";
            user._v = 0;
            return res.send({
                error: "TRUE",
                error_msg: "Unauthenticated user ",
                message: " ",
                userDetail: user
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
router.post('/personal-data', function(req, res) {
    personalData.findOne({
        deviceId: req.body.deviceId
    }, function(err, user) {
        if (!user) {
            var personal = new personalData();
            personal.age = req.body.age;
            personal.gender = req.body.gender;
            personal.weight = req.body.weight;
            personal.height = req.body.height;
            personal.waist = req.body.waist;
            personal.hip = req.body.hip;
            personal.chest = req.body.chest;
            personal.shoulder = req.body.shoulder;
            personal.arms = req.body.arms;
            personal.neck = req.body.neck;
            personal.deviceId = req.body.deviceId;
            personal.save(function(err, details) {
                if (err)
                    console.log(err);
                /* BMR calculations */
                var height = req.body.height;
                var weight = req.body.weight;
                var age = req.body.age;
                var gender = req.body.gender;
                if(gender == 'female'){
                    var bmr = 655.1 + ( 9.563 * weight ) + ( 1.85 * height ) - ( 4.676 * age);                    
                }else{
                    var bmr = 66.47 + ( 13.75 * weight ) + ( 5.003 * height) - ( 6.755 * age);
                }
                var bmr1 ={};
                bmr1.value = bmr ;
                
                /* BMI calculations */
                var height = req.body.height;
                var weight = req.body.weight;
                var bmi = calcBmi(weight, height, false);
                res.json({
                    error: 'FALSE',
                    error_msg: ' ',
                    message: 'Data saved !',
                    personalDetail: details,
                    bmr: bmr1,
                    bmi: bmi
                });
            });
        } else {
            var personalDetails = {
                age: req.body.age,
                gender: req.body.gender,
                weight: req.body.weight,
                height: req.body.height,
                waist: req.body.waist,
                hip: req.body.hip,
                chest: req.body.chest,
                shoulder: req.body.shoulder,
                arms: req.body.arms,
                bodyFat: req.body.bodyFat,
            };
            personalData.update({
                deviceId: req.body.deviceId
            }, personalDetails, function(err, result) {
                if (err) {
                    console.log("Error occured during country updation");
                    throw err;
                }

                /* BMR calculations */
                var height = req.body.height;
                var weight = req.body.weight;
                var age = req.body.age;
                var gender = req.body.gender;
                if(gender == 'female'){

                    var bmr = 655.1 + ( 9.563 * weight ) + ( 1.85 * height ) - ( 4.676 * age);
                    
                }else{

                    var bmr = 66.47 + ( 13.75 * weight ) + ( 5.003 * height) - ( 6.755 * age);
                }
                var bmr1 ={};
                bmr1.value = bmr ;
                
                /* BMI calculations */
                var height = req.body.height;
                var weight = req.body.weight;
                var bmi = calcBmi(weight, height, false);

                personalData.findOne({
                    deviceId: req.body.deviceId
                }, function(err, userdata) {
                    res.json({
                        error: 'FALSE',
                        error_msg: ' ',
                        message: 'Data updated !',
                        personalDetail: userdata,
                        bmr: bmr1,
                        bmi: bmi
                    });
                });

            });
        }

    });

    //res.send("Personal Data Calling......");

});
router.post('/bmi', function(req, res) {
    var height = req.body.height;
    var weight = req.body.weight;
    var bmi = calcBmi(weight, height, false);
    res.json({
        error: 'FALSE',
        error_msg: ' ',
        message: 'Bmi calculated',
        bmi: bmi
    });
});

router.post('/bmr', function(req, res) {
    var height = req.body.height;
    var weight = req.body.weight;
    var age = req.body.age;
    var gender = req.body.gender;
    if(gender == 'female'){
        var bmr = 655.1 + ( 9.563 * weight ) + ( 1.85 * height ) - ( 4.676 * age);
        
    }else{
        var bmr = 66.47 + ( 13.75 * weight ) + ( 5.003 * height) - ( 6.755 * age);
    }
    var bmr1 ={};
    bmr1.value = bmr ;
    bmr1.gender = gender;
    res.json({
        error: 'FALSE',
        error_msg: ' ',
        message: 'Bmi calculated',
        bmr: bmr1
    });
});

router.post('/body-fat', function(req, res){
    var height = req.body.height;
    var waist = req.body.waist;
    var hip = req.body.hip;
    var neck = req.body.neck;
    var gender = req.body.gender;
    if(gender == 'female'){
        var bodyFat = 495 / (1.29579 - .35004 * math.log10(waist + hip - neck) + 0.22100 * math.log10(height)) - 450;        
    }else{
        var bodyFat = 495 / (1.29579 - .35004 * math.log10(waist - neck) + 0.22100 * math.log10(height)) - 450;
    }
    var bf ={};
    bf.value = bodyFat ;
    bf.gender = gender;
    res.json({
        error: 'FALSE',
        error_msg: ' ',
        message: 'Boddy fat calculated',
        bodyFat: bf
    });
});

/* Body Progress */

router.get('/body-progress', function(req, res){    
    var weightLoss = [];
    weightLoss.push({id:1,value:'Arms'}); 
    weightLoss.push({id:2,value:'Abdominal'});
    weightLoss.push({id:3,value:'Thighs'}); 
    weightLoss.push({id:4,value:'Butts'});

    var muscleGain = [];
    muscleGain.push({id:1,value:'Lean'}); 
    muscleGain.push({id:2,value:'Bulk'});

    var meditation = [];
    meditation.push({id:1,value:'Mental Peace'}); 
    meditation.push({id:2,value:'Stress Management'});
    meditation.push({id:3,value:'Emotional Balance'});

    var stamina = [];
    stamina.push({id:1,value:'Stamina'}); 
    stamina.push({id:3,value:'Endurance'}); 

    var rehabilitation = [];
    rehabilitation.push({id:1,value:'Recovery'}); 
    rehabilitation.push({id:2,value:'Flexibility'});
    
    res.json({
        error: 'FALSE',
        error_msg: ' ',
        message: 'Boddy Progress',
        weightLoss: weightLoss,
        muscleGain: muscleGain,
        meditation: meditation,
        stamina: stamina,
        rehabilitation: rehabilitation
    });
});

/*   Trainor Description add  */
router.put('/trainerProfileUpdate', function(req, res) {
        User.findOne({
                deviceId: req.body.deviceId, userType : req.body.userType
        }, function(err, mobile) {
                if (err)
                        res.send(err);

                if (!mobile) {
                        res.json({
                                error: 'TRUE',
                                error_msg: 'Trainer not Exists ',
                                message: ' '
                        });

                } else {
                      User.update({ deviceId: req.body.deviceId },
                        {
                            $set: {
                                    experience_year : req.body.experience_year || '',
                                    location : req.body.location || '',
                                    info : req.body.info || '',
                                    fullBio : req.body.fullBio || '',
                                    youtube : req.body.youtube || '',
                                    facebook : req.body.facebook || '',
                                    twitter : req.body.twitter || '',
                                    website : req.body.website || ''
                            }
                        }, function(err, user) {
                                if (err)
                                        res.send(err);                          
                               
                          User.findOne({deviceId: req.body.deviceId}, function(err, data){
                                    if(err)
                                        res.send(err);
                                    var trainerProfile =    {
                                        experience_year : data.experience_year || '',
                                        location : data.location || '',
                                        info : data.info || '',
                                        fullBio : data.fullBio || '',
                                        youtube : data.youtube || '',
                                        facebook : data.facebook || '',
                                        twitter : data.twitter || '',
                                        website : data.website || ''
                                        }
                                        
                                    res.json({
                                        error: 'FALSE',
                                        error_msg: ' ',
                                        message: 'Trainer info updated!',
                                        trainerProfile: trainerProfile
                                    });
                                });
                        });
                }
        });
});
/* Body Progress Report 

    @author : Nitesh Singh
    @desc : Body progress report
*/

 router.post('/user-body-progress', function(req, res){
    bodyProgress.findOne({deviceId: req.body.deviceId}, function(err, result){
        if(err)
            res.send(err);
        if(!result){
            var newbodyProgress = new bodyProgress({
                weightLoss : req.body.weightLoss,
                muscleGain : req.body.muscleGain,
                meditation : req.body.meditation,
                stamina : req.body.stamina,
                rehabilitation : req.body.rehabilitation,
                deviceId : req.body.deviceId
            });
            newbodyProgress.save(function(err, progressReport){
                res.json({
                        error: 'FALSE',
                        error_msg: ' ',
                        message: 'Data saved !',
                        progressReport: progressReport
                    });
            });
        }else{

            var progressDetails = {
                weightLoss : req.body.weightLoss,
                muscleGain : req.body.muscleGain,
                meditation : req.body.meditation,
                stamina : req.body.stamina,
                rehabilitation : req.body.rehabilitation,
                deviceId : req.body.deviceId
            };
            bodyProgress.update({deviceId: req.body.deviceId}, progressDetails, function(err, updateData){

                bodyProgress.findOne({deviceId: req.body.deviceId}, function(err, data){
                    if(err)
                        res.send(err);
                    res.json({
                        error: 'FALSE',
                        error_msg: ' ',
                        message: 'Data updated !',
                        progressReport: data
                    });
                });

            });
        }
    });
    
 
 });

/*
 @author : ravi shankar
 Trainer Profile Pic Add
 */ 
router.put('/trainerProfilePicUpdate', function(req, res, next) {
    var base64EncodedImage = req.body.profilePic;
    var imageData = base64ToImage(base64EncodedImage);
    AWS.config = config.aws.credentials;
    var key = getUniqueFilename(config);
    var profilePicName = "https://s3.us-east-2.amazonaws.com/"+ config.aws.bucket + "/" + key; // https://s3.us-east-2.amazonaws.com/healthappimages/profilepics/1525412582413_223444.png
    var s3 = new AWS.S3();    
    s3.putObject({
        Bucket: config.aws.bucket,
        Key: key,
        Body: imageData.data,
        ACL: 'public-read',
        ContentType: imageData.type,
        ContentEncoding: "base64"
    }, function(error, data) {
        if(error)
            return res.send({
                            error: 'TRUE',
                            error_msg: ' ',
                            message: 'Profile Pics not updated!'
                    });
         User.update({ deviceId: req.body.deviceId, userType : req.body.userType },
            {
                $set: {
                        profilePic : profilePicName || '',
                }
            }, function(err, user) {
                    if (err)
                        res.send(err);                          
                    res.json({
                            error: 'FALSE',
                            error_msg: ' ',
                            message: 'Profile Pics updated!',
                            profilePic : profilePicName
                    });
        });
    });
});
 
 
/*
 @author : ravi shankar
 Trainer Certificate Add
 */ 

router.put('/trainerCertificateUpdate', function(req, res, next) {
    var base64EncodedImage = req.body.certificate;
    var imageData = base64ToImage(base64EncodedImage);
    AWS.config = config.aws.credentials;
    var key = getUniqueFilename(config);
    var certificateName = "https://s3.us-east-2.amazonaws.com/"+ config.aws.bucket + "/" + key;
    var s3 = new AWS.S3();    
    s3.putObject({
        Bucket: config.aws.bucket,
        Key: key,
        Body: imageData.data,
        ACL: 'public-read',
        ContentType: imageData.type,
        ContentEncoding: "base64"
    }, function(error, data) {
        if(error)
            return res.send({
                            error: 'TRUE',
                            error_msg: ' ',
                            message: 'Certificate not updated!'
                    });
         User.update({ deviceId: req.body.deviceId, userType : req.body.userType },
            {
                $set: {
                        certificate : certificateName || '',
                }
            }, function(err, user) {
                    if (err)
                        res.send(err);                          
                    res.json({
                            error: 'FALSE',
                            error_msg: ' ',
                            message: 'Certificate updated!',
                            certificate : certificateName
                    });
        });
    });
});

/*
 @author : ravi shankar
 Trainer Profile Pic Add
 */
router.put('/trainerSpecialtiesUpdate', function(req, res){    
    User.findOne({ deviceId: req.body.deviceId, userType : req.body.userType },
     function(err, mobile) {
                if (err)
                    res.send(err);
                if (!mobile) {
                        res.json({
                                error: 'TRUE',
                                error_msg: 'Trainer not Exists ',
                                message: ' '
                        });
                } else {
                      User.update({ deviceId: req.body.deviceId },
                        {
                            $set: {
                                    specialties : req.body.specialties || ''
                            }
                        }, function(err, user) {
                                if (err)
                                    res.send(err);                          
                                res.json({
                                        error: 'FALSE',
                                        error_msg: ' ',
                                        message: 'Specialties updated!',
                                        specialties : req.body.specialties
                                });
                        });
                }
        });
    
}); 


/*
 @author : ravi shankar
 All Specialties list
 */

router.get('/specialties', function(req, res){    
    Specialties.find(function(err, specialties) {
        if (err)
            res.send(err);
        //res.json(specialties);
        
        res.json({
            error: 'FALSE',
            error_msg: ' ',
            message: ' ',
            specialties: specialties
        });
    });
});

router.get('/specialties_bkp', function(req, res){    
    
var data = [    
    {
    "title" : "CONDITIONING",
    "conditioning" : [  
            {
                "name" : "Strengthen & Tone",
                "id" : "strengthen-tone"
            },
            {
                "name" : "Bootcamp",
                "id" : "bootcamp"
            },
            {
                "name" : "Weight Loss",
                "id" : "weight-loss"
            },
            {
                "name" : "Aerobics",
                "id" : "aerobics"
            },
            {
                "name" : "Tabata",
                "id" : "tabata"
            },
            {
                "name" : "HIIT/Interval",
                "id" : "hiit-interval"
            },
            {
                "name" : "Bodyweight",
                "id" : "bodyweight"
            },
            {
                "name" : "Stay Fit Lifestyle",
                "id" : "stay-fit-lifestyle" 
            }
        ]
    },
    {
    "title" : "PERFORMANCE TRAINING",
    "performanceTraining" : [   
            {
                "name" : "Strengthen & Tone",
                "id" : "strengthen-tone"
            },
            {
                "name" : "Bootcamp",
                "id" : "bootcamp"
            },
            {
                "name" : "Weight Loss",
                "id" : "weight-loss"
            },
            {
                "name" : "Aerobics",
                "id" : "aerobics"
            },
            {
                "name" : "Tabata",
                "id" : "tabata"
            },
            {
                "name" : "HIIT/Interval",
                "id" : "hiit-interval"
            },
            {
                "name" : "Bodyweight",
                "id" : "bodyweight"
            },
            {
                "name" : "Stay Fit Lifestyle",
                "id" : "stay-fit-lifestyle" 
            }
        ]
    },
    {
    "title" : "FUNCTIONAL TRAINING",
    "functionalTraining" : [    
            {
                "name" : "Strengthen & Tone",
                "id" : "strengthen-tone"
            },
            {
                "name" : "Bootcamp",
                "id" : "bootcamp"
            },
            {
                "name" : "Weight Loss",
                "id" : "weight-loss"
            },
            {
                "name" : "Aerobics",
                "id" : "aerobics"
            },
            {
                "name" : "Tabata",
                "id" : "tabata"
            },
            {
                "name" : "HIIT/Interval",
                "id" : "hiit-interval"
            },
            {
                "name" : "Bodyweight",
                "id" : "bodyweight"
            },
            {
                "name" : "Stay Fit Lifestyle",
                "id" : "stay-fit-lifestyle" 
            }
        ]
    },
    {
    "title" : "YOGA",
    "yoga" : [  
            {
                "name" : "Strengthen & Tone",
                "id" : "strengthen-tone"
            },
            {
                "name" : "Bootcamp",
                "id" : "bootcamp"
            },
            {
                "name" : "Weight Loss",
                "id" : "weight-loss"
            },
            {
                "name" : "Aerobics",
                "id" : "aerobics"
            }           
        ]
    }
];
    res.json({
        error: 'FALSE',
        error_msg: ' ',
        message: ' ',
        data: data
    });
}); 

/* 
    @author : Nitesh Singh
    @desc : Body progress timeframe 
*/ 
router.put('/body-progress-timeframe', function(req, res){
    
    bodyProgress.findOne({deviceId: req.body.deviceId}, function(err, device){

        if(err)
            res.send(err);
        if(device){

            var timeFrameParameter = {
                timeFrame : req.body.timeFrame
            };
            bodyProgress.update({deviceId: req.body.deviceId}, timeFrameParameter, function(err, timeFrame){

                bodyProgress.findOne({deviceId: req.body.deviceId}, function(err, data){
                    if(err)
                        res.send(err);
                    res.json({
                        error: 'FALSE',
                        error_msg: ' ',
                        message: 'Data updated !',
                        progressReport: data
                    });
                });

            });
        
        }

    });
});

/* 
    @author : Nitesh Singh
    @desc : Personal Medical Issue 
*/ 
router.put('/personal-medical-issue', function(req, res){

    
    personalData.findOne({deviceId: req.body.deviceId}, function(err, device){

        if(err)
            res.send(err);
        if(device){

            var medicalIssueParrameter = {
                medicalIssue : req.body.medicalIssue
            };
            personalData.update({deviceId: req.body.deviceId}, medicalIssueParrameter, function(err, timeFrame){

                personalData.findOne({deviceId: req.body.deviceId}, function(err, data){
                    if(err)
                        res.send(err);
                    res.json({
                        error: 'FALSE',
                        error_msg: ' ',
                        message: 'Data updated !',
                        personalDetail: data
                    });
                });

            });
        
        }else{
            res.json({
                        error: 'True',
                        error_msg: 'Wrong deviceId ',
                        message: '  '                        
                    });
        }

    });

});

/* 
    @author : Ravi Shankar
    @desc : Time Slot 
*/ 

router.get('/time-slots', function(req, res){    
     Timeslot.find(function(err, timeslot) {
        if (err)
            res.send(err);
        res.json({
            error: 'FALSE',
            error_msg: ' ',
            message: ' ',
            timeslots: timeslot
        });
    });
});

router.post('/time-slots2', function(req, res){    
    
    //console.log('loggggg', req.query.params,qs.deviceId);
    
    getUserProfileData(req)
        .then(function (userProfile){console.log('userProfile',userProfile);
    
             Timeslot.find(function(err, timeslot) {
                if (err)
                    res.send(err);
                res.json({
                    error: 'FALSE',
                    error_msg: ' ',
                    message: ' ',
                    timeslots: timeslot,
                    userProfile : userProfile
                });
            });
        });
});

/* 
    @author : Ravi Shankar
    @desc : Time Slot 
*/ 
/*
router.get('/geocodes', function(req, res){    
    var options = {
      provider: 'google',
     
      // Optional depending on the providers
      httpAdapter: 'https', // Default
      apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
      formatter: null         // 'gpx', 'string', ...
    };
     
    var geocoder = NodeGeocoder(options);
     
    // Using callback
    geocoder.geocode('south ganesh nagar, new delhi, 110092', function(err, res) {
      console.log('err',err);
      console.log('res', res);
    });
});*/

function getUserProfileData(req){
    var deferred = Q.defer();
    User.findOne({deviceId: req.body.deviceId}, function(err, data){                                     
            if(err){
                deferred.reject(error);
            }
            else{
                var trainerProfile =    {
                    experience_year : data.experience_year || '',
                    location : data.location || '',
                    info : data.info || '',
                    fullBio : data.fullBio || '',
                    youtube : data.youtube || '',
                    facebook : data.facebook || '',
                    twitter : data.twitter || '',
                    website : data.website || ''
                }
                deferred.resolve(trainerProfile);
            }
        });
        return deferred.promise;
    }

/* 
    @author : Ravi Shankar
    @desc : Barcode 
*/ 

router.get('/workout-barcode', function(req, res){    
    Specialties.find(function(err, specialties) {
        if (err)
            res.send(err);        
        codes.loadModules(["qrcode"], { "eclevel":"L" , "version": "4", "scaleX": 0.5, "scaleY": 0.5} );
        var data = codes.create("qrcode","12345678");    
        //console.log(data);
        //res.setHeader("Content-Type","image/png");
        res.json({
            error: 'FALSE',
            error_msg: ' ',
            message: ' ',
            barcodeData: "data:image/png;base64,"+data.toString("base64")
        }); 
    });
});

/* 
    @author: Nitesh Singh
    @desc: Gym Facilities

 */

router.post('/facilities', function(req, res, next){
    var name = req.body.name ;
    var Facilities = new facilities({
        name: name
    });
    //res.json(name);
    Facilities.save(function(err, result){
        if(err)
            res.send(err);
        res.json({
            error: 'FALSE',
            error_msg: '',
            message: 'New facilities inserted ! ',
            facilities: result
        }); 
    });
});

/*
    @author: Nitesh singh
    @desc: get facilities list
*/
router.get('/facilities', function(req, res, next){
    facilities.find().exec(function(err, facilitiesData){
        res.json({
            error: 'FALSE',
            error_msg: '',
            message: 'New facilities inserted ! ',
            facilities: facilitiesData
        }); 
    });
});

/*  

    @author : Nitesh Singh
    @desc : Gym information update
*/

 router.put('/update-gym-information', function(req, res, next){
    User.findOne({deviceId: req.body.deviceId}, function(err, result){
        if(err)
            res.send(err);
        if(!result){
           
            res.json({
                error: 'True',
                error_msg: ' Unauthenticated user',
                message: ' '
            });
            
        }else{

            var gymFacilities = {
                name : req.body.name,
                address : req.body.address,
                mobile_number : req.body.mobile_number,
                email : req.body.email,
                facilities : req.body.facilities
            };
            User.update({deviceId: req.body.deviceId}, gymFacilities, function(err, updateData){

                User.findOne({deviceId: req.body.deviceId}, function(err, data){
                    if(err)
                        res.send(err);
                    res.json({
                        error: 'FALSE',
                        error_msg: ' ',
                        message: 'Data updated !',
                        userdata: data
                    });
                });

            });
        }
    });
    
 
 });

var base64ToImage = function(base64String) {
    var matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }    
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;    
};

var getUniqueFilename = function(config) {
    var timestamp = (new Date()).getTime();
    var randomInteger = Math.floor((Math.random() * 1000000) + 1);
    return config.aws.path + timestamp + '_' + randomInteger + '.png';
};


module.exports = router;
