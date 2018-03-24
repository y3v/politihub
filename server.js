var http = require('http')
var Twitter = require('twitter-node-client').Twitter;
var mysql = require('mysql');
var port = process.env.PORT || 8080;

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

http.createServer(function(req, res) {
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


  // ------- HTTP REQUEST HANDLERS -------
  if (req.url.includes('screen_name')) {
    var params = req.url.split('&') // splits all parameters from the url into an array
    var data = {
      screen_name: params[0].substring(14, params[0].length), // removes '/?screen_name=' from string to retrieve the parameter only
      count: params[1].substring(6, params[1].length), // removes 'count=' from string to retrieve the parameter only
      tweet_mode: params[2].substring(11, params[2].length) // removes 'tweet_mode=' from string to retrieve the parameter only
    }
    twitter.getUserTimeline(data, error, success);
  }


  // ------- DATABASE REQUEST HANDLERS -------

  /*
    NEED TO CHANGE THE FORMAT OF THE QUERIES.
  */

  // ------- GET METHOD -------
  if (req.url.includes('query')) {
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
  }

  if (req.url.includes('test')) {
    console.log('url : ' + req.url);
    var name = req.url.substring(7, req.url.length)
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
  }

  // ------- POST METHOD -------
  if (req.method === 'POST') {
    console.log(req.url);
    if (req.url.includes("added")){
      req.on('data', (chunk) => {
        //console.log('chunk : ' + chunk);
        var inputs = JSON.parse(chunk);
        var sql = "INSERT INTO user (username,password,firstname,lastname,email,isAdmin,isLoggedIn) VALUES ('" + inputs.username + "', '" + inputs.password + "', '" + inputs.firstname + "', '" + inputs.lastname + "', '" + inputs.email + "', " + inputs.isAdmin + ", " + inputs.isLoggedIn + ")"
        //console.log(sql);
        con.query(sql, function(err, result) {
          if (err) throw err;
          console.log("1 record inserted, ID: " + result.insertId);
        });
      })
    }
    if (req.url.includes("loggedIn")){
      req.on('data', (chunk) => {
        //console.log('chunk : ' + chunk);
        var inputs = JSON.parse(chunk);
        var query = "SELECT * FROM user WHERE username = '" + inputs.username + "' AND password= '" + inputs.password + "';"
        console.log(query);
        con.query(query, function(err, result, fields) {
          console.log("result:" + result);
          if (result == ""){
            var bad = {"response" : false};
            var JBad = JSON.stringify(bad);
            success(JBad);
          }
          else{
            var good = {"response" : true};
            var JGood = JSON.stringify(good);
            success(JGood);
          }
        });
      })
    }
  } else {
    console.log('No request sent to server. \n method: ' + req.method);
  }
}).listen(port);
console.log('Server running at ' + port);
