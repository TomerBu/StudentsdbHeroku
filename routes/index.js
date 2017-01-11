var express = require('express');
var router = express.Router();

var pg = require('pg');

/* GET home page. */
router.get('/', function (req, res, next) {
  var SQL = "SELECT * FROM Students;"
  query(SQL, [], function (err, result) {
    if (err)
      return next(err);
    res.render('index', {
      title: 'Students',
      students: result.rows
    });
  })

  /*

  -- CREATE TABLE Students(id SERIAL PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL);
  -- INSERT INTO Students(firstName, lastName, email) VALUES('Tomer', 'Buzaglo', 'Tomer@gmail.com') , ('Nona', 'Michelle', 'nMichelle@gmail.com');
  -- SELECT * FROM Students
  UPDATE Students SET email = 'Michelle@gmail.com' WHERE id = 2;
  SELECT * FROM Students;
   */

});

router.get('/edit', function (req, res, next) {
  var id = req.query.id;
  if (!id) next(new Error("No such user"));

  var SQL = "SELECT * FROM Students WHERE id = $1;"
  query(SQL, [id], function (err, result) {
    if (err)
      return next(err);
    res.render('edit', {
      title: 'Edit Student',
      student: result.rows[0]
    });
  })
});

router.post('/edit', function (req, res, next) {
  var id = req.body.id;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var SQL = "UPDATE Students SET firstName=$1, lastName=$2, email=$3 WHERE id=$4"
  query(SQL, [firstName, lastName, email, id], function (err, result) {
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
  pg.connect(process.env.DATABASE_URL, function (err, client, done) {
    if (err) {
      done();
      return callback(err, result);
    }

    client.query(SQL, args, function (err, result) {
      done();
      callback(err, result);
    })
  });
}
module.exports = router;