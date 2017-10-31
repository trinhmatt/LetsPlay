var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('landing')
})


app.post('/', function(req, res){
  var id = '&steamid='+req.body.steamID,
      key = '06E0DD1DD9EF69BA5A953C2C70959E70',
      api = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+key+id+'&format=json';
  request(api, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var ownedGames = JSON.parse(body)
      res.render('main', {ownedGames:ownedGames})
    }
  })
})



app.listen(process.env.PORT || 5000, function(){
  console.log('Server started')
})
