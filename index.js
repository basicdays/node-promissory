'use strict';
var assert = require('assert');

exports = module.exports = promissory;

function promissory(fn) {
	assert(typeof fn == 'function', 'function required');

	return function() {
		var args = arrayFrom(arguments);
		var ctx = this;

		return new Promise(function(resolve, reject) {
			args.push(function promisedWork() {
				var args = arrayFrom(arguments);

				if (args[0]) {
					reject(args[0]);
				} else if (args.length == 2) {
					resolve(args[1]);
				} else {
					resolve(args.slice(1));
				}
			});
			fn.apply(ctx, args);
		});
	};
}

function arrayFrom(oldArgs) {
	var args = new Array(oldArgs.length);
	var i;

	for (i = 0; i < args.length; i++) {
		args[i] = oldArgs[i];
	}
	return args;
}
