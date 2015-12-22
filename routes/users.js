/**
 * Created by Jeevan on 12/17/2015.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function (req, res, next) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({}, {}, function (err, result) {

        res.json(result);
    })
});


router.post('/adduser', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    })
})


router.delete('/deleteuser/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    id = req.params.id;
    collection.remove({'_id': id}, function (err) {
        if (err === null) {
            res.send({msg: ''});
        }
        else {
            res.send({msg: 'error' + err});
        }

    })
})


router.put('/updateuser/:id', function (req, res) {
    var db = req.db;
    var userToUpdate = req.params.id;
    var doc = {$set: req.body};
    var collection = db.get('userlist');
    collection.updateById(userToUpdate, doc, function (err, result) {
        if (err === null) {
            res.send({msg: ''});
        }
        else {
            res.send({msg: '' + err});
        }
    });

});


module.exports = router;