var tweets = []
function test() {
  var tweet = {
    dateCreated: "Mon Dec 04 22:57:47 +0000 2017",
    likes: 3540,
    retweets: 300,
    user: {
      name: 'Barack Obama',
      screen_name: 'BarackObama',
      profile_image_url: 'http://pbs.twimg.com/profile_images/899997253753905153/zvGMV7XY_normal.jpg'
    },
    text: 'Watch: We hosted a Town Hall in New Delhi with @BarackObama and young leaders about how to drive change and make an… https://t.co/imWU09Hoa5'
  }

  var contentPane = document.createElement('div')
  var profileImg = document.createElement('img')
  var nameAtName = document.createElement('p')
  var tweetText = document.createElement('p')

  profileImg.setAttribute('src', tweet.user.profile_image_url)
  profileImg.setAttribute('alt', '@' + tweet.user.screen_name + ' profile image')
  contentPane.appendChild(profileImg)

  nameAtName.innerHTML = tweet.user.name + ' - @' + tweet.user.screen_name  + ' - ' + tweet.dateCreated // could be a link
  contentPane.appendChild(nameAtName)

  ///// IMPORTANT FOR MEDIAS
  if (tweet.text.includes('http')){
    var link = tweet.text.substring(tweet.text.indexOf('http'), tweet.text.length)
    link = link.split(' ')[0]
    tweetText.innerHTML = tweet.text
    contentPane.appendChild(tweetText)

    console.log(link);
    var video = document.createElement('a')
    video.innerHTML = link
    video.setAttribute('href', link)
    contentPane.appendChild(video)
  }
  else{
    tweetText.innerHTML = tweet.text
    contentPane.appendChild(tweetText)
  }

  var bottomLine = document.createElement('p')
  bottomLine.innerHTML = tweet.likes + ' likes   ~   ' + tweet.retweets + ' retweets'
  contentPane.appendChild(bottomLine)

  document.getElementById('feed').appendChild(contentPane)
}

function getUserTimelineRequest(atName, count) {
  document.getElementById('feed').innerHTML = ''

  var query = '?screen_name=' + atName + '&count=10' + '&tweet_mode=extended'

  var ajax = new XMLHttpRequest()
  ajax.open('GET', 'http://127.0.0.1:8124/' + query, true)
  ajax.onload = response
  ajax.send()
}

function makeRequest() {
  var ajax = new XMLHttpRequest()
  ajax.open('GET', 'http://127.0.0.1:8124', true)
  ajax.onload = response
  ajax.send()
}

function response(response) {
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
        tweet.text = feed[i].text // tweet text


      console.log(tweet);
      tweets.push(tweet)
      if (i === (feed.length - 1) ){
        displayTweets()
      }
    }
  }
  else {
    console.log('empty responseText');
  }
}

function displayTweets() {
  console.log(tweets);
  for (var i = 0; i < tweets.length; i++) {
    console.log('tweet?');
    console.log(tweets[i]);
    var contentPane = document.createElement('div')
    var profileImg = document.createElement('img')
    var nameAtName = document.createElement('p')
    var tweetText = document.createElement('p')

    profileImg.setAttribute('src', tweets[i].user.profile_image_url)
    profileImg.setAttribute('alt', '@' + tweets[i].user.screen_name + ' profile image')
    contentPane.appendChild(profileImg)

    nameAtName.innerHTML = tweets[i].user.name + ' - @' + tweets[i].user.screen_name  + ' - ' + tweets[i].dateCreated // could be a link
    contentPane.appendChild(nameAtName)

    if (tweets[i].text !== ''){
      tweetText.innerHTML = tweets[i].text
      contentPane.appendChild(tweetText)
    }

    for (var video in tweets[i].videos) {
      if (video.type === 'video'){
        var videoTag = document.createElement('video')
        videoTag.setAttribute('src', video.expanded_url)
        contentPane.appendChild(videoTag)
      }
    }

    for (var media in tweets[i].media) {
      if (media.type === 'photo') {
        var pic = document.createElement('img')
        pic.setAttribute('src', media.media_url)
        contentPane.appendChild(pic)
      }
    }

    var bottomLine = document.createElement('p')
    bottomLine.innerHTML = tweets[i].likes + ' <3   ~   ' + tweets[i].retweets + ' >->^'
    contentPane.appendChild(bottomLine)

    document.getElementById('feed').appendChild(contentPane)
  }
  tweets = []
}
\
