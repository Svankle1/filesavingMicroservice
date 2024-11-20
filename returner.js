const zmq = require("zeromq");
//const fs = require('node:fs');
const fs = require('fs/promises');

async function run() {
  const sock = new zmq.Reply();
  let replyMsg = '';

  await sock.bind("tcp://127.0.0.1:3000");

  for await (const [msg] of sock) { //currently reading
    console.log(msg.toString());
    //await sock.send('Begining to parse' + msg.toString());


    //console.log(replyMsg + msg.toString());
    result = 'Result: ' + await doWork(msg);
    //await sock.send('Result: ' + doWork(msg));
    await sock.send(result);
  }
}

async function writeBlank(){
  try {
    const content = '';
    await fs.writeFile('./.playlistSessionData', content);
  } catch (err) {
    console.log(err);
  }
}

async function doWork(msg){
  //let result = '';
  try{
    const data = await fs.readFile('./.playlistSessionData', { encoding: 'utf8' });
    //if empty
    if (data === '')
      return "empty";
    //else

    //code working with reading data here
    return data;
    
  } catch (error) {
    //console.log(error);
    if (error.code = 'ENOENT'){
      //console.log("fixing")
      await writeBlank();
      return "empty";
    }
    else{
      console.error("Error: ", error);
      return ("Wierd error: " + error);
    }
  }
}

run();
//await fs.writeFile('./.playlistData', '');