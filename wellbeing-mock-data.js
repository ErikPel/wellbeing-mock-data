//TODO: Change these for actual group names

var groups = ['Group A', 'Group B','Group C'];
var activities = ['Outdoor recreation', 'Stretching/resistence training', 'Sensory stimulation',
						'Pet therapy','Gardening', 'Sewing','Painting'];

function randomDate(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function insert(collection, args, amount, insertFunctionOutcome) {
	//make copy of the object so we can get different faker data every time
	for (var i = 0; i < amount; i++) {
		var argsWithValues = Object.assign({},args);

		for (var key in args) {
			if (insertFunctionOutcome) {
				if (typeof args[key] === 'function') {
					var func = args[key];
					argsWithValues[key] = func();
				}
			}
		}
		collection.insert(argsWithValues);

	}
}

function createMockGroups() {
	console.log('Creating mock groups');

	for (var i = 0; i < groups.length; i++) {
		var groupName = groups[i];
		console.log(groupName);
		Groups.insert({'name': groupName});
	}
}
function createMockHomes() {
	console.log('Creating mock homes');
	var amount = 3;
	var address = function() {return faker.address.city();};

	for (var i = 0; i < groups.length; i++) {
		var groupName = groups[i];
		console.log(groupName);
		var Group = Groups.findOne({'name': groupName});
		var args = {'name': address,'groupId': Group._id};
		insert(Homes, args, amount, true);
	}

}

function createMockResidents() {
	console.log('Creating mock residents');
	var amount = 6;
	var homes = Homes.find().fetch();
	var firstName = function() {return faker.name.firstName();};
	var lastInitial =  function() {return faker.name.lastName().charAt(0);};
	for (var i = 0; i < homes.length; i++) {
		var args = {'firstName': firstName, 'lastInitial': lastInitial, 'homeId': homes[i]._id};
		insert(Residents, args, amount,true);
	}

}
function createMockActivityTypes() {
	console.log('Creating mock activiity types');
	for (var i = 0; i < activities.length; i++) {
		ActivityTypes.insert({'name': activities[i]});
	}
}

function createMockActivities() {
	console.log('Creating mock activies');

	var residents = Residents.find().fetch();
	var activityTypes = ActivityTypes.find().fetch();
	var endDate = new Date();
	var startDate = new Date();
	startDate.setDate(endDate.getDate() - 30);
	var roleId = Roles.getAllRoles().fetch()[0]._id;
	var activityType = function() {return activityTypes[Math.floor((Math.random() * activityTypes.length) + 0)]._id;};

	var duration = function() {return Math.floor((Math.random() * 60) + 1);};
	for (var i = 0; i < residents.length; i++) {
		var amount =  (Math.random() * (50 - 20 + 1) )<<0;

		var residentId = residents[i]._id;
		var args = {'activityTypeId': activityType(), 'activityDate': randomDate(endDate,startDate),'facilitatorRoleId': roleId,'duration': duration(),'residentIds': [residentId]};
		insert(Activities,args,amount,true);
	}
}

Meteor.methods({
	'createMockData': function() {
	createMockGroups();
	createMockHomes();
	createMockResidents();
	createMockActivityTypes();
	createMockActivities();
},

});
