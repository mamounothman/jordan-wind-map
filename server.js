let express = require('express');
let exphbs  = require('express-handlebars');

let app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.use(express.static('public'));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => res.render("home"));
app.listen(3000, () => console.log("Listening to this joint on port 3000!"));