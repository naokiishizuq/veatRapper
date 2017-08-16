var request = require('request');
var baseUrl = "https://api.instagram.com/v1/";
  var users = "users/self/";
  var search = "media/recent/?"
  var access_token = "";
  var url = baseUrl + users + search + access_token;
  console.log(url)

  request(url, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred 
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    console.log('body:', body); // Print the HTML for the Google homepage. 
    var data = JSON.parse(body);
    console.log(data[0]);
  });

