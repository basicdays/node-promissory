/*global describe, it */
'use strict';
var assert = require('assert');
var promisory = require('..');

function doIt(file, fn) { }
function doIt2(file, fn) { }

describe('promissory.object()', function() {
	it('should be a higher order function', function() {
		var oldObject = {
			doIt: doIt
		};
		var newObject = promisory.object(oldObject, ['doIt']);

		assert(newObject !== oldObject);
	});

	it('should set a method called ...Async', function() {
		var oldObject = {
			doIt: doIt
		};
		var newObject = promisory.object(oldObject, ['doIt']);

		assert(!oldObject.doItAsync, 'Async got created on the wrong object');
		assert(newObject.doItAsync, 'Async method doesn\'t exist');
	});

	it('should actually set a promise async method', function() {
		function read(file, fn) {
			fn(null, 'file: ' + file);
		}
		var oldObject = {
			read: read
		};
		var newObject = promisory.object(oldObject, ['read']);

		return newObject.readAsync('foo.txt').then(function(res) {
			assert('file: foo.txt' == res);
		});
	});

	it('should set multiple methods', function() {
		var oldObject = {
			doIt: doIt,
			doIt2: doIt2
		};
		var newObject = promisory.object(oldObject, ['doIt', 'doIt2']);

		assert(newObject.doItAsync, 'Async method doIt doesn\'t exist');
		assert(newObject.doIt2Async, 'Async method doIt2 doesn\'t exist');
	});

	it('should not create unwhitelisted methods', function() {
		var oldObject = {
			doIt: doIt,
			doIt2: doIt2
		};
		var newObject = promisory.object(oldObject, ['doIt']);

		assert(newObject.doItAsync, 'Async method doIt doesn\'t exist');
		assert(!newObject.doIt2Async, 'Async method doIt2 shouldn\'t exist');
	});

	it('should work on deeply nested objects', function() {
		var oldObject = {
			doIt: doIt
		};
		var oldObject2 = Object.create(oldObject);
		var newObject = promisory.object(oldObject2, ['doIt']);

		assert(newObject.doItAsync, 'Async method doIt doesn\'t exist');
		assert(!oldObject.doItAsync, 'Async method doIt exists on oldObject');
		assert(!oldObject2.doItAsync, 'Async method doIt exists on oldObject2');
	});
});

describe('promissory.class()', function() {
	it('should be a higher order function', function() {
		function OldClass() {}
		OldClass.prototype.doIt = doIt;
		var NewClass = promisory.class(OldClass, ['doIt']);

		assert(OldClass !== NewClass);
	});

	it('should set a method called ...Async', function() {
		function OldClass() {}
		OldClass.prototype.doIt = doIt;
		var NewClass = promisory.class(OldClass, ['doIt']);

		assert(NewClass.prototype.doItAsync, 'Async method doIt doesn\t exist');
		assert(!OldClass.prototype.doItAsync, 'Async got created on the wrong class');
	});

	it('should actually set a promise async method', function() {
		function OldClass() {}
		OldClass.prototype.read = function(file, fn) {
			fn(null, 'file: ' + file);
		};
		var NewClass = promisory.class(OldClass, ['read']);

		return NewClass.prototype.readAsync('foo.txt').then(function(res) {
			assert('file: foo.txt' == res);
		});
	});

	it('should set a static function called ...Async', function() {
		function OldClass() {}
		OldClass.doIt = doIt;
		var NewClass = promisory.class(OldClass, [], ['doIt']);

		assert(NewClass.doItAsync, 'Async method doIt doesn\t exist');
		assert(!OldClass.doItAsync, 'Async got created on the wrong class');
	});

	it('should set a methods and static functions', function() {
		function OldClass() {}
		OldClass.prototype.doIt = doIt;
		OldClass.doIt2 = doIt2;
		var NewClass = promisory.class(OldClass, ['doIt'], ['doIt2']);

		assert(NewClass.prototype.doItAsync, 'Async method doesn\t exist');
		assert(!NewClass.prototype.doIt2Async, 'Async method shouldn\t exist');
		assert(!NewClass.doItAsync, 'Async method shouldn\t exist');
		assert(NewClass.doIt2Async, 'Async method doesn\t exist');
	});
});
