const zmq = require("zeromq");
//const fs = require('node:fs');
const fs = require('fs');

async function run() {
  const sock = new zmq.Reply();
  let replyMsg = '';

  await sock.bind("tcp://127.0.0.1:3000");

  for await (const [msg] of sock) { //currently reading
    console.log(msg.toString());
    //await sock.send('Begining to parse' + msg.toString());


    //console.log(replyMsg + msg.toString());
    result = 'Result: ' + doWork(msg);
    //await sock.send('Result: ' + doWork(msg));
    await sock.send(result);
  }
}

function doWork(msg){
  let replyMsg = '';
  //if message = START
  if (msg.toString() == "START"){
    //read file
    try {
      const data = fs.readFileSync('./.playlistSessionData', 'utf8');
      console.log(data);
      //check if its empty
      if (data === '')
        return "empty";
      //if its not empty...
      console.log("returning data");
      return data;

    } catch (err) {
      if (err) { //if no file exists...
        if (err.code = 'ENOENT'){ //No file exists,
          //therefore create one
          fs.writeFile('./.playlistSessionData', '', err => {
            if (err) { //standard ERROR handling
              replyMsg = err;
              console.error(err);
            } else {
              // file created successfully
              console.log('creation');
              replyMsg = "empty";
            }
          });
        }
        else{ //report any error that wasnt the lack of a file
          console.error(err);
        }
      }
    }

  }
  return replyMsg;
}

run();
