var exec = require('child_process').exec;
var cmd = "wget https://scontent.cdninstagram.com/t50.2886-16/18113028_1180112165432220_7056533539642146816_n.mp4"

var cmd2 = "mv 18113028_1180112165432220_7056533539642146816_n.mp4 locationX.mp4"

exec(cmd, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    } else {
    	exec(cmd2, function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    }
});
