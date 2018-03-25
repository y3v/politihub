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
  "callBackUrl": "politihub-olyk.herokuapp.com:" + PORT + "/"
}
var twitter = new Twitter(config)

express().use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/load', function (req, res) {
    const {
      headers,
      method,
      url
    } = req
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    // ------- CALLBACK FUNCTIONS -------
    var success = function(data) {
      console.log('Data success!');
      if (typeof data === 'string') {
        res.end(data)
      } else {
        console.log('Data needs to be in string format');
      }
    };
    var error = function(err, response, body) {
      console.log('ERROR [%s]', err);
    };

    var query = req.param("query");
    console.log("FRONT PAGE!! " + query);
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
  .get('/load2', function (req, res){
    const {
      headers,
      method,
      url
    } = req
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    // ------- CALLBACK FUNCTIONS -------
    var success = function(data) {
      console.log('Data success!');
      if (typeof data === 'string') {
        res.end(data)
      } else {
        console.log('Data needs to be in string format');
      }
    };
    var error = function(err, response, body) {
      console.log('ERROR [%s]', err);
    };

    console.log('url : ' + req.url);
    var name = req.url.substring(13, req.url.length)
    if (name.includes('%20')) {
      name = name.split('%20').join(' ') // replaces '%20' by space character
    }
    var query = 'SELECT * FROM politician WHERE legalName LIKE \'%' + name + '%\';'
    console.log(query);
    con.query(query, function(err, result, fields) {
      if (err) throw err;

      // Needs to stringify it before passing it to success()
      // 'bit' type in SQL returns weird stuff with this function, so we convert it here
      var data = {
        data: result
      }
      var strRes = JSON.stringify(data);
      strRes = strRes.split('{"type":"Buffer","data":[0]}').join('false')
      strRes = strRes.split('{"type":"Buffer","data":[1]}').join('true')
      success(strRes);
    });

  })
  .get('/twitter', function (req, res){
    {
      const {
        headers,
        method,
        url
      } = req
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      // ------- CALLBACK FUNCTIONS -------
      var success = function(data) {
        console.log('Data success!');
        if (typeof data === 'string') {
          res.end(data)
        } else {
          console.log('Data needs to be in string format');
        }
      };
      var error = function(err, response, body) {
        console.log('ERROR [%s]', err);
      };

      var params = req.url.split('&') // splits all parameters from the url into an array
      var data = {
        screen_name: params[0].substring(14, params[0].length), // removes '/?screen_name=' from string to retrieve the parameter only
        count: params[1].substring(6, params[1].length), // removes 'count=' from string to retrieve the parameter only
        tweet_mode: params[2].substring(11, params[2].length) // removes 'tweet_mode=' from string to retrieve the parameter only
      }
      twitter.getUserTimeline(data, error, success);
    }
  })
  .get('/', (req, res) => res.render('index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
