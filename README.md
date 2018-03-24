# politihub

Hello Jean-Francois,

To run our website you first have to download Nodejs and have it install on your computer.

Next, in your cmd, cd (change directory) to the location where server.js is located (.../politihub/scripts).

Then enter "node server.js" and the server should be running with the message "Connected to DB".

Because of security restrictions on Google Chrome, the website needs to run on Firefox, because the html file is running locally,
and not on a server.

The HTML file you should load is index.html.

Main features:
-Using the AngularJS library, we implemented routing, therefore this is a SPA (single page application).
    -All the links are loaded within the <ng-view> in the index.html.
    -The components that are loaded are in their own seperate html files (search.html, login.html,etc....)
-Using NodeJs, a server was creating in order to access the mySQL database and retrieve relevant data
  -relevant data includes different politicians, which are loaded using the Angular Autocompleter
  -In the Login page, the application accesses the DB in order to authorize username and password (by default, sign in using "admin" for both username and pw)
  -In order to sign in, click the link at the bottom, and create your user (note: there is some validation such as minimum length of username). The user will then be
    added to the database and may now be used to sign in.
-Relevant javascript is in server.js (Node.js - Database access, Twitter API, REST actions) and in angular-route.js (angular.js)

Enjoy.

For extra fun, pull a tweet from Donald Trump and see the difference from regular tweets
