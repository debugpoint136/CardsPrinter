module.exports = function(options) {
  return [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      // reply('<h1>Hello Hapi</h1>');
      reply.view('index', {
        recordCount: options.data.length
      });
    }
  }, {
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  }, {
		method: 'GET',
		path: '/output/{param*}',
		handler: {
			directory: {
				path: '../output'
			}
		}
	}];
}
