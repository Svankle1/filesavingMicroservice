const zmq = require("zeromq");

async function run() {
  const sock = new zmq.Request();

  sock.connect("tcp://127.0.0.1:3000");
  console.log("Producer bound to port 3000");

  await sock.send(JSON.stringify({operation:"read", path:"./.playlistSessionData.json"}));
  const [result] = await sock.receive();

  console.log(result.toString());
}

run();
