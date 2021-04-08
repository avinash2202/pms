var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var userModule = require('../modules/user');

/* middleware to check duplicate Username */
function checkUsername(req, res, next) {
  var username = req.body.username;
  var checkExistingUsername = userModule.findOne({ username: username});
  checkExistingUsername.exec((err, data) => {
    if(err) throw err;
    if(data) {
      return res.render('signup', { title: 'Password Management System', msg:'Username Not Available' });
    }
    next();
  });
}

/* middleware to check duplicate email */
function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkExistingEmail = userModule.findOne({ email: email});
  checkExistingEmail.exec((err, data) => {
    if(err) throw err;
    if(data) {
      return res.render('signup', { title: 'Password Management System', msg:'Email Already Exists.' });
    }
    next();
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password Management System' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System', msg:'' });
});

router.post('/signup', checkUsername, checkEmail, function(req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confPassword = req.body.confpassword;

  if(password != confPassword) {
    res.status(201).render('signup', { title: 'Password Management System', msg:'Password not matched'});
  }else {
    password = bcrypt.hashSync(req.body.password, 10);
    var userDetails = new userModule({
      username: username,
      email: email,
      password: password
    });

    userDetails.save((err, doc) => {
      if(err) throw err;
      res.status(201).render('signup', { title: 'Password Management System', msg:'User Registered Successfully'});
    });

  }
 
});

router.get('/passwordCategory', function(req, res, next) {
  res.render('password_category', { title: 'Password Management System' });
});

router.get('/passwordList', function(req, res, next) {
  res.render('password-list', { title: 'Password Management System' });
});

router.get('/addNewPassword', function(req, res, next) {
  res.render('add-new-password', { title: 'Password Management System' });
});

router.get('/addNewCategory', function(req, res, next) {
  res.render('add-new-category', { title: 'Password Management System' });
});

module.exports = router;
