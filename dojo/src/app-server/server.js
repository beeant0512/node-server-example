define([
  'dojo/node!express',
  'dojo/node!compression',
  'dojo/node!morgan',
  'dojo/node!cookie-parser',
  'dojo/node!cookie-session',
  'dojo/node!serve-favicon',
  'dojo/node!serve-static',
  'dojo/node!juicer',
  'dojo/node!stylus',
  'dojo/node!nib',
  'dojo/node!colors',
  'app-server/config'
], function (express, compress, morgan, cookieParser, cookieSession, favicon, serveStatic, juicer, stylus, nib,
             colors, config) {

  function compile(str, path) {
    return stylus(str).set('filename', path).use(nib());
  }

  /* Express Application */
  var app = express(),
    appPort = process.env.PORT || config.port || 8002,
    env = process.env.NODE_ENV || 'development';

  // Configure the application
  app.set('view engine', 'html');
  app.engine('html', function (path, options, fn) {
    fs.readFile(path, 'utf8', function (err, str) {
      if (err) return fn(err);
      str = juicer(str, options);
      fn(null, str);
    });
  });

  app.set('views', 'views');
  app.use(compress());
  app.use(morgan(env === 'production' ? 'combined' : 'dev'));
  app.use(cookieParser());
  app.use(cookieSession({secret: 'sUyC2IAOnzPpfjHRjSDpUUgQvmANfW9i3dOeNtqChnj6iMG5BzK1n3vjZkrW'}));
  app.use(favicon('./_static/favicon.ico'));

  app.use(stylus.middleware({
    src: '.',
    compile: compile,
    compress: true
  }));

  app.use('/_static', serveStatic('./_static'));
  app.use('/src', serveStatic('./src'));
  app.use('/lib', serveStatic('./lib'));

  // app routes
  // app.use('/', routes);

  app.get('/500', function (request, response, next) {
    next(new Error('All your base are belong to us!'));
  });

  // Main document handler
  app.get('/*', function (request, response, next) {
    if (request.params[0] == '404' || /^_static/.test(request.params[0]) || /^src/.test(request.params[0])) {
      next();
    } else {
      request.render('index', {title: 'Login'});
    }
  });

  app.use(function (request, response, next) {
    response.status(404);
    if (request.accepts('html')) {
      response.render('404', {url: request.url});
      return;
    } else if (request.accepts('json')) {
      response.send({error: 'Not Found', url: request.url});
      return;
    }

    response.type('text').send('Not Found');
  });

  app.use(function (error, request, response, next) {
    response.status(error.status || 500);
    if (request.accepts('html')) {
      response.render('500', {
        error: error
      });
    } else if (request.accepts('json')) {
      response.send({error: error});
    } else {
      response.type('text').send(error);
    }
  });

  // Start Listening
  app.listen(appPort);
  console.log('HTTP server started on port: '.grey + appPort.toString().cyan);
});