var express = require('express');
var router = express.Router();

var pg = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
    var SQL = "SELECT * FROM Students ORDER BY id;"
    query(SQL, [], function(err, result) {
        if (err)
            return next(err);
        res.render('index', {
            title: 'Students',
            students: result.rows
        });
    })
});

router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    if (!id) return next(new Error("No such user"));

    var SQL = "SELECT * FROM Students WHERE id = $1;"
    query(SQL, [id], function(err, result) {
        if (err)
            return next(err);
        res.render('edit', {
            title: 'Edit Student',
            student: result.rows[0]
        });
    })
});

router.get('/add', function(req, res, next) {
    res.render('add', {
        title: 'Add Student'
    })
});

router.post('/add', function(req, res, next) {

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var SQL = "INSERT INTO Students(firstName, lastName, email) VALUES($1, $2, $3)"
    query(SQL, [firstName, lastName, email], function(err, result) {
        if (err)
            return next(err);
        res.render('add', {
            title: 'Added a Student!',
            student: {
                firstname: firstName,
                lastname: lastName,
                email: email
            },
            success: true
        });
    })
});

router.post('/edit', function(req, res, next) {
    var id = req.body.id;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var SQL = "UPDATE Students SET firstName=$1, lastName=$2, email=$3 WHERE id=$4"
    query(SQL, [firstName, lastName, email, id], function(err, result) {
        if (err)
            return next(err);
        res.render('edit', {
            title: 'Updated Student',
            student: {
                firstname: firstName,
                lastname: lastName,
                email: email,
                id: id
            }
        });
    })
});


function query(SQL, args, callback) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
            done();
            return callback(err, result);
        }

        client.query(SQL, args, function(err, result) {
            done();
            callback(err, result);
        })
    });
}
module.exports = router;