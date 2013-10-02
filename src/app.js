var path = require('path')
  , pkg = require('../package.json')
  , fs = require('fs')
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

// Bind post-commit hooks
gith().on( 'all', function( payload ) {

	// Debug payload
	winston.info('Post-receive happened!');
	winston.info(JSON.stringify(payload, null, 4)); 

/*
	// Exec post-receive script
	exec(__dirname+"/trader-forex/post-receive", function(err, datas) {
		console.log(err, datas) ;
	}); 
*/

});