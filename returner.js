const zmq = require("zeromq");

async function run() {
  const sock = new zmq.Reply();

  await sock.bind("tcp://127.0.0.1:3000");

  for await (const [msg] of sock) {
    console.log(msg.toString());
    await sock.send('Responding to: ' + msg.toString());
  }
}

run();
