var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const Handlebars = require('handlebars')
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dotenv = require('dotenv');
var dateFormat = require('dateformat');
var lessMiddleware = require('less-middleware');
var path = require('path');
var showdown = require('showdown');
var fs = require('fs');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const PORT = 8000;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main',
handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');

dotenv.config();
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

const {Market, Food} = require('./models/Market');
/** NOTES:
* 1. Live creation doesnt deal with empty thing
* 2. Make about page
*/


app.get('/', function(req, res) {
    Market.find({}, function(err, markets) {
        if(err) throw err;
        if(!markets) markets = [];
        else res.render('home',{
            data: markets
        });
    });
});

app.get('/markets/:id/', function(req, res) {
    Market.findById({_id: req.params.id}, function(err, market) {
        if(err) throw err;
        if(!market) res.send("Market not found...");
        else res.render('market', {
            data: market
        });
    });
});

app.get('/food', function(req,res) {
    Market.find({}, function(err, markets) {
        if(err) throw err;
        if(!markets) markets = [];
        else{
            food = []
            markets.map(function(market){
                for(var i = 0; i < market.food.length; i++) {
                    food.push({
                        "name": market.food[i].name,
                        "market": market
                    });
                }
            });
            food.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
            res.render('food', {
                food: food
            })
        }
    });
});

app.get('/createMarket/', function(req, res) {
    res.render('create');
});

app.post('/createMarket/', function(req, res){
    var name = req.body.name;
    var address = req.body.address;
    if(!name || !address){
        console.log('Invalid Form');
        return res.redirect('/createMarket')
    }
    var market = new Market({
        name: name,
        address: address,
        food: []
    });
    
    market.save(function(err){
        if(err) throw err;
        io.emit('new market', market);
        var returnLoc = '/markets/' + market._id;
        res.redirect(returnLoc);
    });  
});

app.get('/markets/:id/addFood/', function(req, res) {
    Market.findById({_id: req.params.id}, function(err, market) {
        if(err) throw err;
        if(!market) res.send("Market not found...");
        else res.render('addFood', {
            market: market
        });
    });
});

app.get('/about/', function(req,res){
    fs.readFile('./public/assets/documentation.md', 'utf8', function(err, contents) {
        if (err) throw err;
        converter = new showdown.Converter(),
        text      = contents,
        html      = converter.makeHtml(text);
        console.log(html)
        res.render('about',{
            html : html
        });
    });
});

app.post('/markets/:id/addFood/', function(req, res){
    var body = req.body;
    var organic = (body.organic ? true : false);
    var price = parseFloat(body.price);
    var weight = parseFloat(body.weight);

    if(!body.name || !price || !weight){
        console.log('Invalid Form');
        var redirect = '/markets/' + req.params.id + '/addFood/';
        return res.redirect(redirect);
    }
    
    Market.findOne({_id: req.params.id}, function(err, market) {
        if(err) throw err;
        if(!market) res.send("Market not found...");
        else {
            
            var now = new Date();
            var date = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM TT");
            
            var food = new Food({
                name: body.name,
                date: date,
                price: price,
                organic: organic,
                weight: weight
            });
            market.food.push(food);
            
            market.save(function(err){
                if(err) throw err;
                io.emit('new food', market, food);
                var returnLoc = '/markets/' + market._id;
                res.redirect(returnLoc);
            });
        }
    });
    
});

//API
app.get('/api/markets', function(req, res) {
    Market.find({}, function(err, markets) {
        if(err) throw err;
        if(!markets) res.send("Market not found...");
        else res.json(markets);
    });
});

app.get('/api/markets/:id/', function(req, res) {
    Market.findById({_id: req.params.id}, function(err, market) {
        if(err) throw err;
        if(!market) res.send("Market not found...");
        else res.json(market);
    });
});

app.get('/api/markets/:id/food', function(req, res) {
    Market.findOne({_id: req.params.id}, function(err, market) {
        if(err) throw err;
        if(!market) res.send("Market not found...");
        else res.json(market.food);
    });
});

app.post('/api/markets', function(req, res) {
    var name = req.query.name;
    var address = req.query.address;
    
    if(!name || !address){
        return res.send('Invalid Form');
    }

    var market = new Market({
        name: name,
        address: address,
        food: []
    });
    
    market.save(function(err){
        if(err) throw err;
        io.emit('new market', market);
        return res.send('Market Added!');
    });
});

app.post('/api/markets/:id/food', function(req, res) {
    Market.findOne({_id: req.params.id}, function(err, market) {
        if(err) throw err;
        if(!market) res.send("Market not found...");
        else {
            var name = req.query.name;
            var price = parseFloat(req.query.price);
            var organic = (req.query.organic == 'true' || req.query.organic == 'True');
            var weight = parseFloat(req.query.weight);
            
            if(!body.name || !price || !weight){
                return res.send('Invalid Form');
            }

            var now = new Date();
            var date = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM TT");
            
            var food = new Food({
                name: name,
                date: date,
                price: price,
                organic: organic,
                weight: weight
            });
            market.food.push(food);
            
            market.save(function(err){
                if(err) throw err;
                io.emit('new food', market, food);
                return res.send('Food Added!');
            });
        }
    });
});

app.delete('/api/markets/:id/', function(req, res) {
    Market.findByIdAndRemove({_id : req.params.id}, function (err, market) {
        if(err) throw err;
        if(!market) res.send("Market not found...")
        else res.send('Market Deleted.')
    });
});

app.delete('/api/markets/:id/food/:idFood', function(req, res) {
    Market.findOne({_id: req.params.id}, function (err, market){
        if(err) throw err;
        if(!market) res.send("Market not found...");
        else {
            var preLen = market.food.length;
            market.food = market.food.filter(item => item.id != req.params.idFood);
            if(preLen == market.food.length) res.send("Food not found...")
            market.save(function(err){
                if(err) throw err;
                return res.send('Food Deleted!');
            });
        }
    });
});

app.delete('/api/markets/:id/allFood', function(req, res) {
    Market.findOne({_id: req.params.id}, function (err, market){
        if(err) throw err;
        if(!market) res.send("Market not found...");
        else {
            market.food = []
            market.save(function(err){
                if(err) throw err;
                return res.send('All Food Deleted!');
            });
        }
    });
});

io.on('connection', function(socket){
    console.log('NEW connection.');
    socket.on('disconnect', function() {
        console.log('User has disconnected');
    });
});

http.listen(process.env.PORT || PORT, function() {
    console.log('Example app listening on port ' + PORT);
});
