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
  .get('/', function (req, res) {
    const {
      headers,
      method,
      url
    } = req
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    console.log("FRONT PAGE!!");

  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
