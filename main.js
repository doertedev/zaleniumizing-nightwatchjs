'use strict';

/**
 * Here be dragons
 *
 * This is a site that bootstraps the environment where thee tests will
 * land. Here you can create an object of models or other shared
 * components that then get exported into the "rathermore flat" test
 * files.
 * Don't steal my code, just let your imagination flow! E.g. maybe you
 * could send your colleagues a slack message that you're running tests
 * now? Or maybe invoke a service that bootstraps a new test report
 * before nightwatch delivers us results?
 *
 * Happy hacking!
 */

// environment variables (e.g. hopefully no credentials, it's 2018!)
let configPath = process.env.INSTANA_CONFIG;
if ('' === configPath) {
	console.error('Error: config file not found under specified path!')
	return process.exit(1);
}

// export reusable components into the tests
module.exports = require('./library/models/auth.js');
