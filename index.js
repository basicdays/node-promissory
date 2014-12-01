'use strict';
var assert = require('assert');

exports = module.exports = promissory;

function promissory(fn) {
	assert(typeof fn == 'function', 'function required');

	return function() {
		var args = new Array(arguments.length);
		var ctx = this;
		var i;

		for (i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		return new Promise(function(resolve, reject) {
			args.push(function promisedWork() {
				var args = new Array(arguments.length);
				var i;

				for (i = 0; i < arguments.length; i++) {
					args[i] = arguments[i];
				}

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
