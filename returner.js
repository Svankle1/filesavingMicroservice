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
          if (err.code = 'ENOENT'){ //No file exists,
            //therefore create one
            fs.writeFile('./.playlistSessionData', '', err => {
              if (err) { //ERROR handling
                console.error(err);
              } else {
                // file created successfully
                console.log('creation');
                replyMsg = 'empty';
              }
            });
          }
          else{ //report any error that wasnt the lack of a file
            console.error(err);
            return; //break out
          }
        }

        //If file exists...
        //check if its empty
        if (data === ""){
          replyMsg = 'empty';
          console.log('empty');
        }
        //if its not empty...
        else{
          console.log(data);
        }
      });
    }

    console.log(replyMsg + msg.toString());
    await sock.send(replyMsg + msg.toString());
  }
}

run();
