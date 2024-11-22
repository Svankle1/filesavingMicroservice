const zmq = require("zeromq");
//const fs = require('node:fs');
const fs = require('fs/promises');

async function runServer() {
  const sock = new zmq.Reply();
  let replyMsg = '';

  await sock.bind("tcp://127.0.0.1:3000");

  for await (const [msg] of sock) { //currently reading
    //console.log(JSON.parse(msg.toString()));
    const order = JSON.parse(msg.toString())

    
    if(order.operation == "read"){
      resultJson = await readIfExists(order.path);
    }
    else if (order.operation == "write"){
      
      //do end work
    }
    else {
      await sock.send(JSON.stringify(resultJson));
      console.error("Error: Order " + order.operation + " recieved. Does not allign with the 2 preset operations.");
      break;
    }

    await sock.send(JSON.stringify(resultJson));
  }
}

async function writeBlank(path){
  try {
    const content = '';
    await fs.writeFile(path, content);
  } catch (err) {
    console.log(err);
  }
}

async function readIfExists(path){
  //let result = '';
  try{
    let data = await fs.readFile(path, { encoding: 'utf8' });
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