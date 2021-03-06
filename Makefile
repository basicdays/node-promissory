SHELL := /usr/bin/env bash
export PATH := bin:node_modules/.bin:$(PATH)

.PHONY: build
build: node_modules

node_modules: package.json
	@npm install

.PHONY: test
test: lint
	@mocha --reporter=spec --timeout 2s --require ./test

.PHONY: lint
lint:
	@jshint .

.PHONY: clean
maintainer-clean:
	@rm -rf node_modules
