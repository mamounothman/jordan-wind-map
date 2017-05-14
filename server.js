/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
let express = require('express');
let exphbs = require('express-handlebars');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 3000;
let book = require('./app/routes/book');
let config = require('config'); //we load the db location from the JSON files
//db options
let options = { 
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
}; 

// Register '.mustache' extension with The Mustache Express
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');
// app.set('views', __dirname + '/views');

//db connection      
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.use(express.static('public'));

//parse application/json and look for raw text                                        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

app.get('/', (req, res) => res.render('home'));

app.route('/book')
    .get(book.getBooks)
    .post(book.postBook);
app.route('/book/:id')
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app; // for testing