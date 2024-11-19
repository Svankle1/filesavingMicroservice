const zmq = require("zeromq");
const fs = require('node:fs');

async function run() {
  const sock = new zmq.Reply();
  let replyMsg = '';

  await sock.bind("tcp://127.0.0.1:3000");

  for await (const [msg] of sock) { //currently reading
    console.log(msg.toString());
    //if message = START
    if (msg.toString() == "START"){
      //read file
      fs.readFile('./.playlistSessionData', 'utf8', (err, data) => {
        if (err) { //if no file exists...
          if (err.code = 'ENOENT'){ //No file exists, therefore create one
            data = 'workTime';
            fs.writeFile('./.playlistSessionData', '', err => {
              if (err) { //ERROR
                console.error(err); //this shouldnt happen
              } else {
                // file created successfully
                replyMsg = 'empty';
              }
            });
          }
          else{ //handle any error that wasnt the lack of a file
            console.error(err);
            return; //this will break it, and is the reason an "else" doesnt need to exist below
          }
        }
        //If file exists...
        //check if its empty
        if (data === '')
          replyMsg = 'empty';

        //if its not empty...
        console.log(data);
      });
    }



    await sock.send(replyMsg + msg.toString());
  }
}

run();
