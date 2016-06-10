'use strict'
const SocketIO = require('socket.io');
const Stomp = require('stomp-client');

function main(server, options, next) {
  const outQueue = '/queue/toPython';
  const inQueue = '/queue/fromPython';
  const connectOpt = [ process.env.appHost, process.env.appPort, process.env.appUser, process.env.appPass ];
  const client = new Stomp(...connectOpt);
  const io = SocketIO(server.listener);
  let itemArray = [];


  function stompClient() {
    return new Promise((resolve, reject) => {
      client.connect(sessionId => {
        console.log('Connected to Apache Apollo');

        client.subscribe(inQueue, (body) => {
          itemArray.push(body);
        });

        resolve(sessionId, client);
      }, error => {
        reject(error);
      });
    });
  }


  function ioConnect() {
    io.on('connection', socket => {
      console.log('connected!');

      if(itemArray.length > 0) {
        // Keep the button disabled
        socket
        .emit("buttonState", {
          state: false
        })
        .emit('allData', {
          dataArray: itemArray
        });
      } else {
        // Enable the button
        socket.emit("buttonState", {
          state: true
        })
      }

      // Publish Data to Apollo
      socket.on('begin', () => {
        client.publish(outQueue, JSON.stringify(options.data));
      });

        // Watch the itemArray for changes
        Array.observe(itemArray, () => {
          socket.emit('item', {
            dataArray: itemArray[ itemArray.length -1 ]
          });
        });
      });
}

stompClient()
  .then(ioConnect)
  .catch( err => {
    console.log('there was an error: ', err);
    server.log('error', 'Error: ' + err);
  })

  return next();
}

main.attributes = {
  name: 'main'
}

module.exports = main;
