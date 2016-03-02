var happn = require('happner')

module.exports = {
  happnerDependancy:require('happner'),
  happnDependancy:require('happn'),
  description:"testing happner with security switched on, and a websockets client",
  happnClientConfig:function(){
  	return JSON.parse(JSON.stringify({config:{username:"_ADMIN", password:"happn"}, secure:true}));
  },
  meshConfig:{
	    name:"testMesh",
	    datalayer: {
	       secure: true,
	       adminPassword:'happn'
	    },
	    modules: {
	      "happnClient":{
	        path:"happn.client",
	        create:{
	          type:"async",
	          name:"create",//if blank or null we just do new require
	          parameters:[
	           {"name":"config", "required":true, "value":{config:{username:"_ADMIN", password:"happn"}, secure:true}},
	           {"name":"callback", "parameterType":"callback"},
	          ],
	          callback:{
	            parameters:[
	              {"name":"error", "parameterType":"error"},
	              {"name":"client", "parameterType":"instance"}
	            ]
	          }
	        }
	      }
	    },
	    components: {
	      "happnClient":{
	        moduleName:"happnClient",
	        // scope:"module", //"either component or module, module by default"
	        schema:{
	          "exclusive":true,//means we dont dynamically share anything else
	          "methods":{
	            "get":{
	              "alias":"GET",
	              "parameters":[
	                {"name":"path", "required":true},
	                {"name":"options"},
	                {"name":"callback", "type":"callback", "required":true}
	              ],
	              "callback":{
	                "parameters":[
	                {"name":"error", "type":"error"},
	                {"name":"response"}
	              ]
	              }
	            },
	            "set":{
	              "alias":"PUT",
	              "parameters":[
	                {"name":"path", "required":true},
	                {"name":"data", "required":true},
	                {"name":"options"},
	                {"name":"callback", "type":"callback", "required":true}

	              ],
	              "callback":{
	                "parameters":[
	                {"name":"error", "type":"error"},
	                {"name":"response"}
	              ]
	              }
	            },
	            "remove":{
	              "alias":"DELETE",
	              "parameters":[
	                {"name":"path", "required":true},
	                {"name":"options"},
	                {"name":"callback", "type":"callback", "required":true}
	              ],
	              "callback":{
	                "parameters":[
	                  {"name":"error", "type":"error"},
	                  {"name":"response"}
	                ]
	              }
	            }
	          }
	        }
	      }
	    },
	},
  client:null
}