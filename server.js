var http = require('http')
var Twitter = require('twitter-node-client').Twitter;
var mysql = require('mysql');

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

//CONNECTION TO PROJECT DB
var con = mysql.createConnection(process.env.JAWSDB_URL);
con.connect(function(err) {
  if (err) throw err;
  console.log('Connected to db!!');
})

// TWITTER CONFIG HTTP. DEFINED IN THE TWITTER APP DASHBOARD
var config = {
  "consumerKey": "DI4AsUsLZVpwlF8vyARkgu3eO",
  "consumerSecret": "sUbT3iX5yMJ3MrlMP1K3qql6Rbel7B1RBbk8oGGB9nB8beveem",
  "accessToken": "823606665790504960-wpi7dgXLST2nZ1S6n8bbpSFVLHhGU2P",
  "accessTokenSecret": "nVbAFiwbRDoPWMEJpdYB6V1jAVk9zBrlaTqC5F6u1RRhN",
  "callBackUrl": "https://politihub-olyk.herokuapp.com/"
}
var twitter = new Twitter(config)

express().use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index'))
  .get('/login', function (req, res) {
    const {
      headers,
      method,
      url
    } = req
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    console.log("LOGIN PAGE!!");
    console.log('url : ' + req.url);
    var query = req.url.substring(8, req.url.length) // removes '/?query=' from the url
    query = query.split('%20').join(' ') // replaces '%20' by space character
    query = query.split('%27').join('\'') // replaces '%27' by "\'" character
    console.log('query : ' + query);
    // the con.query function returns a JSON object.
    con.query(query, function(err, result, fields) {
      if (err) throw err;

      // Needs to stringify it before passing it to success()
      // 'bit' type in SQL returns weird stuff with this function, so we convert it here
      var strRes = JSON.stringify(result);
      strRes = strRes.split('{"type":"Buffer","data":[0]}').join('false')
      strRes = strRes.split('{"type":"Buffer","data":[1]}').join('true')
      success(strRes);
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
