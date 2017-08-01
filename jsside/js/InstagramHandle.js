var request = require('request');
function handleInstagramJSONFromMaxRequest() {
  var baseUrl = "https://api.instagram.com/v1/";
  var users = "users/self/";
  var search = "media?recent/?"
  var access_token = "access_token=5383066242.450d69b.67b1608e087f4ab595094e7a7d5568da";
  var URL = baseUrl + users + search + access_token;
  request(URL, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred 
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    console.log('body:', body); // Print the HTML for the Google homepage. 
  });
}




// var exec = require('child_process').exec;
// var cmd = "wget https://scontent.cdninstagram.com/t50.2886-16/18113028_1180112165432220_7056533539642146816_n.mp4"

// var cmd2 = "mv 18113028_1180112165432220_7056533539642146816_n.mp4 locationX.mp4"

// exec(cmd, function(error, stdout, stderr) {
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//         console.log('exec error: ' + error);
//     } else {
//     	exec(cmd2, function(error, stdout, stderr) {
//     	console.log('stdout: ' + stdout);
//     	console.log('stderr: ' + stderr);
//     	if (error !== null) {
//         	console.log('exec error: ' + error);
//     	}
// });
//     }
// });
