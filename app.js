//NEXT STEP: Styling

var express = require('express'),
    app = express(),
    flash = require('connect-flash'),
    bodyParser = require('body-parser'),
    request = require('request');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(express.static('public'));

app.use(require('express-session')({
  secret: 'This is the secret',
  resave: false,
  saveUninitialized: false
}));

app.use(function(req, res, next){
  res.locals.error = req.flash('error');
  next();
});

app.get('/', function(req, res){
  res.render('landing')
})


app.post('/results', function(req, res){
  var id1 = '&steamid='+req.body.steamID1,
      id2 = '&steamid='+req.body.steamID2,
      key = '06E0DD1DD9EF69BA5A953C2C70959E70',
      userApi = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+key+id1+'&include_appinfo=1&format=json';

  request(userApi, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var ownedGames = JSON.parse(body),
          userApi = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+key+id2+'&include_appinfo=1&format=json';

      request(userApi, function(error, response, body){
        if (!error && response.statusCode == 200) {
          var ownedGames2 = JSON.parse(body);
          res.render('results', {sharedGames: sharedGames(ownedGames, ownedGames2)})
        }
      })
    } else {
      req.flash('error','Invalid ID')
      res.redirect('/')
    }
  })
})

function sharedGames(ownedGames, ownedGames2) {
  var shared = [];
  if (ownedGames.response.games.length > ownedGames2.response.games.length) {
    for (i=0; i<ownedGames2.response.games.length; i++) {
      for (x=0; x<ownedGames.response.games.length; x++) {
        if (ownedGames2.response.games[i].appid === ownedGames.response.games[x].appid) {
          shared.push(ownedGames2.response.games[i].name)
        }
      }
    }
  } else {
    for (i=0; i<ownedGames.response.games.length; i++) {
      for (x=0; x<ownedGames2.response.games.length; x++) {
        if (ownedGames.response.games[i].appid === ownedGames2.response.games[x].appid) {
          shared.push(ownedGames.response.games[i].name)
        }
      }
    }
  }
  return shared
}


app.listen(process.env.PORT || 5000, function(){
  console.log('Server started')
})
