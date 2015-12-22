var express = require('express');
var router = express.Router();

/* GET home page.
 router.get('/', function(req, res, next) {
 res.render('index', { title: 'Express' });
 });
 */


router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/userlist', function (req, res) {
    //var person = [{username:"John", mail:"Doe@jkl.com"},{username:"H2", mail:"g1@jkl.com"},{username:"H1", mail:"c1@jkl.com"}];
    var db = req.db;
    var collection = db.get('jeevan');
    collection.find({}, {}, function (err, result) {
        res.render('userlist', {userlist: result}
        );
    });

});

router.get('/adduser', function (req, res) {
    res.render('newuser', {'title': 'add new user'})
})

router.post('/adduser', function (req, res) {
    var db = req.db;
    var username = req.body.username;
    var useremail = req.body.usermail;
    var collection = db.get('jeevan');
    collection.insert({"username": username, "email": useremail}, function (err, result) {
        if (err) {
            res.send("problem jeevan Please Check");
        }
        else {
            res.redirect("userlist");
        }
    });


})

module.exports = router;
