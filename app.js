var express = require('express')
var bodyParser = require('body-parser')
var path = require('path');
var expressValidator = require('express-validator')
var mongojs = require('mongojs')
var db = mongojs('mongodb://foodieweb:webpwd@ds149800.mlab.com:49800/foodiedb', ['foodie'])
var ObjectId = mongojs.ObjectId

var app = express()

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Body Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Set static path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars
app.use(function(req, res, next) {
    res.locals.errors = null
    next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))

// SetUp Routes
app.get('/', function (req, res) {
    db.foodie.find(function (err, docs) {
	    res.render('index', {
        title: 'Foodie!',
        food: docs
        })
    })
})

app.post('/food/add', function (req, res) {

    req.checkBody('name', 'Food Name is Required').notEmpty()
    req.checkBody('cat', 'Food Category is Required').notEmpty()
    req.checkBody('servsize', 'Serving Size is Required').notEmpty()
    req.checkBody('servunit', 'Serving Unit is Required').notEmpty()
    req.checkBody('cal', 'Number of Calories are required').notEmpty()
    req.checkBody('cal', 'Calories must be a valid integer').isInt()
    req.checkBody('meal', 'Meal Type is Required').notEmpty()

    var errors = req.validationErrors()

    if (errors) {
        db.foodie.find(function (err, docs) {
            res.render('index', {
                title: 'Foodie!',
                food: docs,
                errors: errors
            })
        })
    } else {
        var food = {
            name: req.body.name,
            desc: req.body.desc,
            cat: req.body.cat,
            servsize: req.body.servsize,
            servunit: req.body.servunit,
	    cal: req.body.cal,
	    meal: req.body.meal
        }

        // insert the new student into the database
        db.foodie.insert(food, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.redirect('/')
        })
    }
})

app.get('/food/update/:id', function(req, res) {
  db.foodie.find(function (err, docs) {
    res.render('update', {
      title: 'Foodie!',
      food: docs,
      target: req.params.id
      })
  })
})

app.post('/food/update/:id', function (req, res) {

    req.checkBody('name', 'Food Name is Required').notEmpty()
    req.checkBody('cat', 'Food Category is Required').notEmpty()
    req.checkBody('servsize', 'Serving Size is Required').notEmpty()
    req.checkBody('servunit', 'Serving Unit is Required').notEmpty()
    req.checkBody('cal', 'Number of Calories are required').notEmpty()
    req.checkBody('cal', 'Calories must be a valid integer').isInt()
    req.checkBody('meal', 'Meal Type is Required').notEmpty()

    var errors = req.validationErrors()

    if (errors) {
        db.foodie.find(function (err, docs) {
            res.render('update', {
                title: 'Foodie!',
                food: docs,
                target: req.body.target,
                errors: errors
            })
        })
    } else {
        var food = {
            name: req.body.name,
            desc: req.body.desc,
            cat: req.body.cat,
            servsize: req.body.servsize,
            servunit: req.body.servunit,
	    cal: req.body.cal,
	    meal: req.body.meal
        }

        // update the student in the database
        db.foodie.update( {_id: ObjectId(req.body.target) }, food, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.redirect('/')
        })
    }
})

app.get('/food/delete/:id', function(req, res) {
  db.foodie.remove( { _id: ObjectId(req.params.id) }, function (err, result) {
      if (err) {
          console.log(err)
      }
      res.redirect('/')
  })
})

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
    console.log('Server started on port' + app.get('port'))
})
