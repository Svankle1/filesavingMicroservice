const zmq = require("zeromq");

async function run() {
  const sock = new zmq.Request();

  sock.connect("tcp://127.0.0.1:3000");
  console.log("Producer bound to port 3000");

  await sock.send(JSON.stringify({operation:"write", path:"./.playlistSessionData.json", data:
    {
      "list": [
        {
          "name": "A Talking Bass Guitar Interviews the Remie From Intergalactic Channels",
          "url": "https://soundcloud.com/evan-mcdoniels/a-talking-bass-guitar",
          "details": "SoundCloud"
        },
        {
          "name": "Get Out (Phase 1) - Deceive INC OST",
          "url": "https://youtu.be/-pgHFD_rrso"
        },
        {
          "name": "Having Fallen, It Was Blood",
          "url": "https://soundcloud.com/chrischristodouloumusic/having-fallen-it-was-blood",
          "details": "Risk Of Rain OST - Voices Of The Void DLC"
        }
      ]
    }
  }));
  const [result] = await sock.receive();

  console.log(result.toString());
}

run();
