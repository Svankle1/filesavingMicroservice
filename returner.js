const zmq = require("zeromq");
const fs = require('node:fs');

async function run() {
  const sock = new zmq.Reply();

  await sock.bind("tcp://127.0.0.1:3000");

  for await (const [msg] of sock) {
    console.log(msg.toString());
    fs.readFile('/.playlistSessionData', 'utf8', (err, data) => {
      if (err) {
        if (err.code = 'ENOENT'){ //No file exists, therefore create one
          data = 'workTime';
          fs.writeFile('/.playlistSessionData', content, err => {
            if (err) { //ERROR
              console.error(err);
            } else {
              // file written successfully
            }
          });
        }
      else{ //ERROR
          console.error(err);
          return;
        }
      }
      console.log(data);
    });




    await sock.send('Responding to: ' + msg.toString());
  }
}

run();
