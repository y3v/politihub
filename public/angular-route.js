var app = angular.module('myRoute', ['ngRoute', 'angucomplete-alt']);
console.log(this);
app.config(function($routeProvider) {

    $routeProvider.when('/', {
      templateUrl: 'search.html',
      controller: 'searchCtrl'
    }).when('/login', {
      templateUrl: 'login.html',
      controller: 'login'
    }).when('/account', {
      templateUrl: 'account.html',
      //controller: 'login'
    }).when('/main.html/:username', {
      templateUrl: 'search.html',
      controller: 'change'
    }).when('/main.html/:added', {
      templateUrl: 'search.html',
      controller: 'change'
    }).when('/signup', {
      templateUrl: 'signup.html',
      controller: 'signup'
    }).when('/twitter', {
      templateUrl: 'twitter.html',
      controller: 'twitter'
    }).otherwise({
      redirectTo: "/"
    });
  })

  .controller('searchCtrl', function($scope, $interval) {
    /*A "module" is basically a model. mySearch can be seen as the value of the attribute ng-app which basically turns your chosen html
    element into a model. The controller is the function that will be executed for the given element. The idea is that angular js wants
    you not to use global functions as they "pollute the global namespace". Therfore all the specific fucntions are defined within
    the controller

    $scope is kind of like "this" not is not necessarily the same.
    $interval is a "service", there are many different ones, this one basically calls the function repeatedly
    */
    $scope.displayTweets = function(pol){
      console.log(pol.originalObject);
      if (!angular.isUndefined(pol)) {
        tweet(pol.originalObject.twitterAtName)
      }
    }
    $scope.responseFormatter = function(data){
      resultSet = data.data
      for (var i = 0; i < resultSet.length; i++) {
        resultSet[i].twitterAtName = '@' + resultSet[i].twitterAtName
      }
      return data
    }
    /*$scope.getPol = debounce(function() {
    	console.log('IM PICKLE RIIIIICK');
      getPolitician($scope.name)
    }, 300);*/

  })
  .controller('login', function($scope, $location) {
    $scope.validate = function() {
      // if ($scope.username == "guest" && $scope.password == "guest") {
      //   this.menuChange = "#!account"
      //   $scope.login = "ACCOUNT"
      //   console.log(this);
      //   console.log($scope);
      //   $location.path('/main.html/:username');
      // } else {
      //   alert("failed login");
      // }
      var ajax = new XMLHttpRequest()
      var username = $scope.username;
      var pw = $scope.password;
      var auth = {"username":username, "password":pw};
      console.log(auth);
      var userData = JSON.stringify(auth)
      console.log(userData);
      ajax.open('POST', 'politihub-olyk.herokuapp.com/login', false)
      ajax.onload = function() {
        var authResponse = JSON.parse(this.responseText);
        console.log(authResponse)
        if (authResponse.response == true){
          $location.path('/main.html/:username');
        }
        else{
          $scope.messages = "Username or Password is Incorrect!"
        }
      }
      ajax.send(userData)
    }
  })
  .controller('change', function($rootScope,$location) {
    $rootScope.login = "ACCOUNT";
    $rootScope.menuChange = "#!account";
    $location.path('/');
  })
  .controller('signup', function($scope, $location) {
    $scope.validateSignUp = function(){
      var valid = 0;
      if (angular.isUndefined($scope.username) || $scope.username.length < 4){
        $scope.userValid = "Username must be at least 4 characters";
        valid++;
      }else{
        $scope.userValid = "";
      }
      console.log("pw: " + $scope.password + " , pw2: " + $scope.password2)
      if ($scope.password != $scope.password2){
        $scope.pwValid2 = "Passwords do not match!";
        valid++;
      }else{
        $scope.pwValid2 = "";
      }
      if (angular.isUndefined($scope.password)  || $scope.password.length <4){
        $scope.pwValid = "Password must be at least 8 characters";
        valid++;
      }else{
        $scope.pwValid = "";
      }
      if(angular.isUndefined($scope.password2)){
        $scope.pwValid2 = "You must confirm your password";
        valid++;
      }else{
        $scope.pwValid = "";
      }
      console.log(valid);
      if (valid === 0){
        // 'INSERT INTO user (username, password, firstname, lastname, email, isAdmin, isLoggedIn) VALUES ?'
        var userValues = {} // needs to be an array
        userValues.username = $scope.username
        userValues.password = $scope.password

        if (angular.isUndefined($scope.fname))
          userValues.firstname = 'Gaetan';
        else
          userValues.firstname = $scope.fname;

        if (angular.isUndefined($scope.lname))
          userValues.lastname = 'Lamoureux';
        else
          userValues.lastname = $scope.lname;

        if (angular.isUndefined($scope.email))
          userValues.email = 'happy@gaetan.com';
        else
          userValues.email = $scope.email;

        userValues.isAdmin = false; // isAdmin
        userValues.isLoggedIn = true; // isLoggedIn
        console.log('NEW USER : ' + JSON.stringify(userValues));
        postNewUser(JSON.stringify(userValues))
        $location.path('/main.html/:added');
      }
    }
  })


// GLOBAL FUNCTIONS
function tweet(atName){
    var count = 10
    console.log('im in tweet');
    document.getElementById('feed').innerHTML = ''
    var query = '?screen_name=' + atName + '&count=10' + '&tweet_mode=extended'

    var ajax = new XMLHttpRequest()
    ajax.open('GET', 'politihub-olyk.herokuapp.com/' + query, true)
    ajax.onload = tweetResponse
    ajax.send()
  };


// tweets
function tweetResponse(response) {
  //var tweets = []
  if (this.responseText){
    var feed = JSON.parse(this.responseText)
    console.log(feed);

    //Running through all the tweets
    for (var i = 0; i < feed.length; i++) {
      var tweet = {}
      // need PROFILE PIC, DATE CREATED, NAME, @NAME, TEXT, IMG & VIDEO, HASHTAGS
      if (feed[i].extended_entities){
        tweet.videos = feed[i].extended_entities.media // array of media where type = video CHECK TYPE
      }
      else { tweet.videos = null }

      if (feed[i].entities.hashtags) {
        tweet.hashtags = feed[i].entities.hashtags //array
      }
      else { tweet.hashtags = null }

      if (feed[i].entities.media) {
        tweet.media = feed[i].entities.media // array, can be video. use .expanded_url to display? Check type
      }
      else { tweet.media = null }

      tweet.dateCreated = feed[i].created_at
      tweet.likes = feed[i].favorite_count
      tweet.retweets = feed[i].retweet_count
      tweet.user = feed[i].user// props: id, name, screen_name, profile_image_url
      tweet.text = feed[i].full_text // tweet text
      tweet.favorited = feed[i].favorited
      tweet.retweeted = feed[i].retweeted
      console.log(tweet);

      // Everytime a tweet object is ready, the displayTweets function is called
      // to display them right away instead of waiting for all of them
      displayTweets(tweet)
      /*tweets.push(tweet)
      if (i === (feed.length - 1) ){
        displayTweets(tweets)
      }*/
    }
  }
  else {
    console.log('empty responseText');
  }
}

function displayTweets(tweets) {

  console.log(tweets);
  //for (var i = 0; i < tweets.length; i++) {
  //var tweet = tweets[i]
    console.log('tweet?');
    //console.log(tweets);
    var contentPane = document.createElement('div')
    var profileImg = document.createElement('img')
    var nameAtName = document.createElement('p')
    var tweetText = document.createElement('p')

    tweetText.setAttribute("class", "tweetText");
    profileImg.setAttribute('src', tweets.user.profile_image_url)
    profileImg.setAttribute('alt', '@' + tweets.user.screen_name + ' profile image')
    contentPane.appendChild(profileImg)

    //nameAtName.innerHTML = tweets.user.name + ' - @' + tweets.user.screen_name  + ' - ' + tweets.dateCreated // could be a link

    var span = document.createElement("span");
    span.setAttribute("class","realName");
    span.innerText = tweets.user.name + "  - ";
    nameAtName.appendChild(span);

    span = document.createElement("span");
    span.setAttribute("class","screenName");
    span.innerText = "@" + tweets.user.screen_name;
    nameAtName.appendChild(span);

    span = document.createElement("span");
    span.setAttribute("class","date");
    tweets.dateCreated = tweets.dateCreated.replace('+0000 ', '')
    span.innerHTML = "<br>" + tweets.dateCreated;
    nameAtName.appendChild(span);

    contentPane.appendChild(nameAtName)

    if (tweets.text !== ''){
      //tweetText.innerHTML = tweets.text
      // FUTURE REFERENCES -> CAN IMPROVED
      var tweet = tweets.text.split("https://t");

      span = document.createElement("span");
      span.innerHTML = tweet[0];
      tweetText.appendChild(span);

      link = document.createElement("a");
      link.innerHTML = "http://t" + tweet[1];
      link.href= "http://t" + tweet[1];
      tweetText.appendChild(link);

      contentPane.appendChild(tweetText)
    }

    if (tweets.user.screen_name == "realDonaldTrump"){
      tweetText.setAttribute("class","trump");
      var disclaimer = document.createElement("h4");
      disclaimer.innerText = "Disclaimer: Reading these tweets may cause you drop a few IQ points. Politihub takes no responsibility for such occurances";
      disclaimer.setAttribute("class","disclaimer");
      contentPane.appendChild(disclaimer);
    }

    for (var video in tweets.videos) {
      if (video.type === 'video'){
        var videoTag = document.createElement('video')
        videoTag.setAttribute('src', video.expanded_url)
        contentPane.appendChild(videoTag)
      }
    }

    for (var media in tweets.media) {
      if (media.type === 'photo') {
        var pic = document.createElement('img')
        pic.setAttribute('src', media.media_url)
        contentPane.appendChild(pic)
      }
    }

    var bottomLine = document.createElement('p')
    bottomLine.innerHTML = tweets.likes + ' favorites   ~   ' + tweets.retweets + ' retweets'
    contentPane.appendChild(bottomLine)

    document.getElementById('feed').appendChild(contentPane)
  /*}
  tweets = []*/
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// RESTful OPERATIONS (query to db)
// This parameter is a string of what we want to get.
var dataSet = {}
var allPolitician = []
var authentication;

function getPolitician(name) {
  var query = 'SELECT * FROM politician WHERE legalName LIKE \'' + name + '%\';'
  console.log('query (getPolitician) : ' + query);
  var ajax = new XMLHttpRequest()
  ajax.open('GET', 'politihub-olyk.herokuapp.com/?query=' + query, true)
  ajax.onload = function() {
    dataSet = JSON.parse(this.responseText)
    console.log(dataSet);
    tweet(dataSet[0].twitterAtName)
  }
  ajax.send()
}

function getAllPolitician() {
  var query = 'SELECT * FROM politician;'
  var ajax = new XMLHttpRequest()
  ajax.open('GET', '/load?query=' + query, true)
  /*ajax.onload = function() {
    console.log('DB ALL POLITICIAN RESPONSE');
    console.log(JSON.parse(this.responseText));
    allPolitician  = JSON.parse(this.responseText)
  }*/
  ajax.send()
}

function postNewUser(values) {
  var ajax = new XMLHttpRequest()
  ajax.open('POST', 'politihub-olyk.herokuapp.com/:added', true)
  ajax.send(values)
}

function validateLogin(values) {
  var ajax = new XMLHttpRequest()
  ajax.open('POST', 'politihub-olyk.herokuapp.com/:loggedIn', true)
  ajax.onload = function() {
    dataSet = JSON.parse(this.responseText)
    console.log(dataSet);
    tweet(dataSet[0].twitterAtName)
  }
  ajax.send(values)
}
