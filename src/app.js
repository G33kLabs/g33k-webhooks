var path = require('path')
  , pkg = require('../package.json')
  , fs = require('fs')
  , async = require('async')
  , winston = require('winston')
  , find = require('findit')
  , version = pkg.version
  , exec = require('child_process').exec
  , spawn = require('child_process').spawn
  , opts = require('optimist')
	.usage('Usage: $0')
	.options({
		help: {
			demand: false,
			alias: 'h',
			description: 'Show this help'
		},
		debug: {
			demand: false,
			alias: 'd',
			description: 'debug',
			default: false
		},
		port: {
			demand: true,
			alias: 'p',
			description: 'port',
			default: process.env.PORT || 9001,
		}
	}).argv;
  ; 

// Show help if asked
if (opts.help) {
    optimist.showHelp();
    process.exit(0);
}

// Set version
opts.version = version;

// Setup logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {colorize: true, level: opts.debug?'debug':null}); 

// Create a gith server on port process.env.PORT
var gith = require('gith').create(opts.port) ;

// Log
winston.info('[>] WebHooks Server listening on port '+opts.port); 

// Bind post-commit hooks without filters
gith().on( 'all', function( payload ) {

	// Debug payload
	winston.warn('[>] Post-commit happened on '+payload.repo+' !');
	//winston.info(JSON.stringify(payload, null, 4)); 

	// Set post-commit script path
	var postCommit = path.resolve('./repos/'+payload.repo+'/post-commit');

	// Find post-commit script and exec it
	async.series({

		// Search for post-commit script
		exists: function(next) {
			fs.exists(postCommit, function(exists) {
				next(!exists?'No post-commit found for '+postCommit:null);
			});
		},

		// Run
		execute: function(next) {
			winston.info('[>] Launch post-commit : '+postCommit); 
			var post_commit = spawn('/bin/sh', [postCommit]); 

			// Pipe logs
			post_commit.stdout.on('data', winston.debug);
			post_commit.stderr.on('data', winston.debug);

			// On close
			post_commit.on('close', function (code) {
				console.log('child process exited with code ' + code);
			});
/*
			exec("/bin/sh " + postCommit, function(err, datas) {
				console.log(err, datas) ;
				next(err, datas);
			});
*/			
		}
	},

	// Response
	function(err, success) {
		console.log(err, success)
		if ( err ) {
			winston.error(err);
		}
		else {
			winston.info('post-commit script exists for '+payload.repo); 
		}
	});


});