var path = require('path')
  , pkg = require('../package.json')
  , fs = require('fs')
  , async = require('async')
  , winston = require('winston')
  , find = require('findit')
  , version = pkg.version
  , exec = require('child_process').exec
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
winston.add(winston.transports.Console, {colorize: true}); 

// Create a gith server on port process.env.PORT
var gith = require('gith').create(opts.port) ;

// Log
winston.info('[>] WebHooks Server listening on port '+opts.port); 

// List repositaries
var repos = [] ;

// Bind post-commit hooks without filters
gith().on( 'all', function( payload ) {

	// Debug payload
	winston.warn('[>] Post-commit happened!');
	winston.info(JSON.stringify(payload, null, 4)); 

	// Set post-commit script path
	var postCommit = './repos/'+payload.repo+'/post-commit';

	// Find post-commit script and exec it
	async.series({

		// Search for post-commit script
		exists: function(next) {
			fs.exists(postCommit, function(exists) {
				next('No post-commit found for '+postCommit);
			});
		},

		// Run
		execute: function(next) {
			exec(postCommit, function(err, datas) {
				console.log(err, datas) ;
			});
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