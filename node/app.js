'use strict';
require('dotenv').load();
const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({
  port: process.env.port || 3000
});


server.register([{
  register: require('inert')
}, {
  register: require('vision')
}, {
  register: require('good'),
  options: {
    opsInterval: 10000,
    reporters: [{
      reporter: require('good-file'),
      events: {
        log: '*',
        ops: '*'
      },
      config: './applog.log'
    }]
  }
}, {
  register: require('./core'),
  options: {
    data: require('../data/studentData.json')
  }
}], error => {
  if (error) {
    console.log('Error: ', error);
    server.log('Error: ', error);
  } else {
    // Start the server
    server.start(() => {
      console.log('Hapi server running at : ', server.info.uri);
    })
  }
});
