var fs = require('fs');
var testFiles = fs.readdirSync(__dirname + '/context');

var expect = require('expect.js');
var async = require('async');
var default_timeout = 20000;

for (var testFileIndex in testFiles){

	var testFile = testFiles[testFileIndex];

	if (testFile.indexOf('01-consumemodule') != 0) continue;//we only use files that start with 'test-'

	describe(testFile.replace('.js',''), function () {

		var testContext = require(__dirname + '/context/' + testFile);

		var should = require('chai').should();
	  	var sep = require('path').sep;
	  	var Mesh = testContext.happnerDependancy;

	  	var config = testContext.meshConfig;

		after(function(done){
		   mesh.stop(done);
		});

		it('starts a local mesh', function(done) {

		    this.timeout(10000);

		    mesh = new Mesh();

		    mesh.initialize(config, function(err) {

		      if (err) {
		        // console.log('failure in init')
		        // console.log(err.stack)
		      };

		      done(err);

		    });

		});

		it('starts a local mesh, with a single component that wraps the happn client module and compares the response with a happn client instantiated outside of the mesh', function(done) {

		    var _this = this;

		    //we require a 'real' happn client
		    testContext.happnDependancy.client.create(testContext.happnClientConfig(), function(e, client){

		      if (e) {
		        console.log('real client init failure', e);
		        return done(e);
		      }

		      client.set('/mytest/678687', {"test":"test1"}, {}, function(e, directClientResponse){
		        //calling a local component
		        mesh.exchange.happnClient.set('/mytest/678687', {"test":"test1"}, {}, function(e, response){

		          response.test.should.eql(directClientResponse.test);

		          if (e)
		            return done(e);

		         //calling a local component as if it was on another mesh
		         mesh.exchange.testMesh.happnClient.set('/mytest/678687', {"test":"test1"}, {}, function(e, response){

		            response.test.should.eql(directClientResponse.test);

		            if (e) return done(e);

		            //doing the same call using a post to the api
		            mesh.post('/happnClient/set', '/mytest/678687', {"test":"test1"}, {}, function(e, response){

		              response.test.should.eql(directClientResponse.test);
		              //console.log({response: response});
		              //test aliases
		              mesh.exchange.testMesh.happnClient.PUT('/mytest/678687', {"test":"test1"}, {}, function(e, response){

		                response.test.should.eql(directClientResponse.test);

		                return done(e);
		              });
		            });
		          });
		        });
		      });
		    });
		});

	});
}

