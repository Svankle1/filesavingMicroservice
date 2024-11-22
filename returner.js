const zmq = require("zeromq");
//const fs = require('node:fs');
const fs = require('fs/promises');

async function runServer() {
  const sock = new zmq.Reply();
  let replyMsg = '';

  await sock.bind("tcp://127.0.0.1:3000");

  for await (const [msg] of sock) { //currently reading
    console.log(msg.toString());
    //await sock.send('Begining to parse' + msg.toString());


    //console.log(replyMsg + msg.toString());
    resultJson = await doStartWork(msg);
    //await sock.send('Result: ' + doWork(msg));
    await sock.send(JSON.stringify(resultJson));
  }
}

async function writeBlank(){
  try {
    const content = '';
    await fs.writeFile('./.playlistSessionData.json', content);
  } catch (err) {
    console.log(err);
  }
}

async function doStartWork(msg){
  //let result = '';
  try{
    let data = await fs.readFile('./.playlistSessionData.json', { encoding: 'utf8' });
    data = JSON.parse(data);
    
    //if empty
    if (data === '')
      return {response:'Empty', array:[{item0:'blank'}] };
    //else

    //code working with reading data here
    return data;

  } catch (error) {
    //console.log(error);
    if (error.code = 'ENOENT'){
      //console.log("fixing")
      await writeBlank();
      return {response:'Empty', array:[{item0:'blank'}] };
    }
    else{
      console.error("Error: ", error);
      return ("Wierd error: " + error);
    }
  }
}

runServer();
//await fs.writeFile('./.playlistData', '');