const zmq = require("zeromq");
const fs = require('fs/promises');
const { write } = require("fs");

async function runServer() {
  const sock = new zmq.Reply();
  let replyMsg = '';

  await sock.bind("tcp://127.0.0.1:3000");
  console.log("Listening to tcp://127.0.0.1:3000");
  for await (const [msg] of sock) { //currently reading
    console.log("Received: "+ msg.toString());
    const order = JSON.parse(msg.toString())

    
    if(order.operation == "read"){
      resultJson = await readIfExists(order.path);
    }
    else if (order.operation == "write"){
      resultJson = await writeToFile(order.path, JSON.stringify(order.data));
    }
    else {
      resultJson = {response: "Error: Order " + order.operation + " recieved. Does not allign with the 2 preset operations."};
      console.error("Error: Order " + order.operation + " recieved. Does not allign with the 2 preset operations.");
      break;
    }
    console.log(resultJson);
    await sock.send(JSON.stringify(resultJson));
  }
}

async function writeToFile(path, content){
  try {
    await fs.writeFile(path, content);
  } catch (err) {
    console.log(err);
    return {response:"Wierd error on write: " + err};
  }
  return {response:"No code breakage. Writing seems sucsessfull"};
}

async function readIfExists(path){
  try{
    let data = await fs.readFile(path, { encoding: 'utf8' });
    data = JSON.parse(data);
    
    if (data === '') //if file is empty
      return {response:'Empty', list:[{item0:'blank'}] };
    //else
    let list = data.list;
    return {response:"File contents avalible", list};

  } catch (error) {
    //console.log(error);
    if (error.code = 'ENOENT'){
      await writeToFile(path, '');
      return {response:'Empty', list:[{item0:'blank'}] };
    }
    else{
      console.error("Error: ", error);
      return {response:"Wierd error on read: " + error, list:[{item0:'blank'}]};
    }
  }
}

runServer();