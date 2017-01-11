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
      title: 'Edit Page',
      student: result.rows[0]
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