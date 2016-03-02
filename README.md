[![npm](https://img.shields.io/npm/v/happner-tests.svg)](https://www.npmjs.com/package/happner-tests) [![Build Status](https://travis-ci.org/happnerer/happner-tests.svg?branch=master)](https://travis-ci.org/happnerer/happner-tests) [![Coverage Status](https://coveralls.io/repos/happnerer/happner-tests/badge.svg?branch=master&service=github)](https://coveralls.io/github/happnerer/happner-tests?branch=master) [![David](https://img.shields.io/david/happnerer/happner-tests.svg)]()

<img src="https://raw.githubusercontent.com/happnerer/happnerer-website/master/images/HAPPN%20Logo%20B.png" width="300"></img>

happner tests
-----------
*we have a standard test that we inject a bunch of different contexts through, so if you happner to build a plugin for happner - you would use this test suite to ensure your code is up to standard.*

getting started:
----------------

```bash
npm install happner-tests
```

the create a tests directory, in that directory create a "happner_test.js" file and a "context" folder - the happner_test.js file sets up the happner-tests suite and call's its run method, in the example below, a TEST_GLOBALS object is also created, so that contexts are able to use properties on the TEST_GLOBALS later:

happner_test.js:
--------------

```javascript

//this is specific to the project you are testing - this code is borrowed from the mongo plugin for happner
TEST_GLOBALS = {};

var service = require('../index.js');
var serviceInstance = new service();

var config = {
	url:'mongodb://127.0.0.1:27017/happner'
}

serviceInstance.initialize(config, function(e){

	if (e) throw e;

	TEST_GLOBALS.mongoService = serviceInstance;

	//we have initialised some global objects, now time to run our test:

	var happner_tests = require('happner-tests').instantiate(__dirname + '/context');//the __dirname + context - is where our test context files will be found, this can be left blank if your context file is in [app root]/test/context

	//we run the tests - the contexts are iterated through and injected into our tests, the tests are designed to pick up contexts that have filenames that start with the filenames of the tests (without extensions), so the context 01-vanilla_test.js matches the 01-vanilla.js test

	happner_tests.run(function(e){
		if (e) {
			console.log('tests ran with failures', e);
			process.exit(1);
		}
		else{
			console.log('tests passed ok');
			process.exit(0);
		}
	});

});

```

contexts
--------

*the contexts are little modules that supply the tests with configurations that are being tested against, here is an example context file for the 01-vanilla test:*

```javascript

var happner = require('happner')
var happner_client = happner.client;

module.exports = {
  //the test needs a required happner module
  happnerDependancy:require('happner'),
  //some additional information if you want - just used to console.log out
  description:"eventemitter embedded functional tests",
  //the happner service configuration - we are going for default vanilla here
  serviceConfig:{},
  //this specific test needs a happner client in a specific configuration - in this case in EventEmitter mode
  publisherClient:function(happnerInstance, callback){

    var config =  {
		plugin: happner.client_plugins.intra_process,
		context: happnerInstance
	}

	happner_client.create(config, callback);
  },
  //this specific test needs a happner client in a specific configuration - in this case in EventEmitter mode
  listenerClient:function(happnerInstance, callback){

  	var config =  {
		plugin: happner.client_plugins.intra_process,
		context: happnerInstance
	}

	happner_client.create(config, callback);
  }
}

```

you save your context file as 01-vanilla-[my context name].js in the context folder. you are now A for away and can test, using node like so:

```bash
node test/happner_test.js
```

*NB: if you are already running mocha tests, it is fine to locate your happner_test file elsewhere - so you dont get instances where the tests are automatically run causing issues, you can also update your package.json to run mocha tests and then the happner_test file, as follows: *

```json

{
  "name": "happner-tests",
  "description": "service plugin for running happner on a mongo database",
  "version": "0.0.3",
  "main": "./lib/index",
  "scripts": {
    "test": "mocha silence.js test/functional && node test/happner-test",
    "test-cover": "istanbul cover _mocha -- silence.js test"
  },

```

this was again borrowed from the [happner mongo service's](https://github.com/happnerer/happner-tests) package.json.



