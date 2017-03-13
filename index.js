
var AWS = require('aws-sdk');
var _ = require('lodash');

// Load credentials and set region from JSON file
AWS.config.loadFromPath('./shane-aws-config.json');

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params = {
    ImageId: 'ami-10fd7020', 
    InstanceType: 't1.micro',
    MinCount: 1,
    MaxCount: 1
};

//create two instances or could set the values in the params above
var ids = _.times(2,createInstance());
	
function createInstance(){
    var instanceId;
    ec2.runInstances(params, (err, data) => {
	if (err) {
	    console.log("Error", err);
	    return;
	}
	instanceId = data.Instances[0].InstanceId;
	console.log("Created instance", instanceId);
	
	params = {Resources: [instanceId], Tags: [
	    {
		Key: 'Name - Pass as param',
		Value: 'Pass as param'
	    }
	]};
	ec2.createTags(params, function(err) {
	    console.log("Tagging instance", err ? "failure" : "success");
	});
    });
    if(instanceId) { return instanceId;}
    
}
