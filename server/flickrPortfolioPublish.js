// Created by Gareth Simons.
// Initial inspiration from flixploretest.



//// VARIABLES:
var apiKey = "b4b033a1b3c8f74573e021bd37565336";
var userName = "garethsimons";
userID = null; //"78352164@N07"; Global variable - set in flickr.js
var flickrDBKey = "flickrSets";
var url = null;


//// SERVER SIDE FUNCTIONS
function randomURL(callback){
	var setCount = flickrDB.find().count();
	var setRandom = Math.floor(Math.random()*setCount);
	var setObject = flickrDB.findOne(
		{setNum:setRandom},
		{fields:{"photos.total":1, "photos.photo":1}});
	var photoCount = setObject.photos.total;
	var photoRandom = Math.floor(Math.random()*photoCount);
	// return only images wider than they are high
	while (setObject.photos.photo[photoRandom].width_o <
		setObject.photos.photo[photoRandom].height_o){
			photoRandom = Math.floor(Math.random()*photoCount);
		}
	url = setObject.photos.photo[photoRandom].url_o;
	console.log("Random set index "+setRandom+" with random photo index "+photoRandom+" with a URL of "+url);
	if (callback && typeof(callback) === "function") {  
			callback();
		}
}

//// SERVER SIDE CODE
Meteor.startup(function () {	
	FlickrUserID(apiKey,userName,function(){
		console.log("User ID is set as "+userID);
		FlickrSetList(apiKey,userID,flickrDB,flickrDBKey,function(){
			var setList = flickrDB.find({key:flickrDBKey});
			setList.forEach(function(eachSetItem){
				var flickrSetID = eachSetItem.data.id;
				console.log("Updating pictures from set "+flickrSetID);
				FlickrSetPhotos(apiKey,flickrSetID,flickrDBKey, function(){
				});
			});
			Meteor.setInterval(function(){randomURL();},30000);
			Meteor.publish("sets",function(){
				return flickrDB.find(
				{},
				{fields: {id:1,data:1,photos:1}}
				);
			});
		});
	});
});

Meteor.methods({
	fetchRandomURL : function (){
		if (url !== null){
			return url;
		} else {
			randomURL(function(){
				return url;
			});
		}
	}
});

Meteor.methods({
	newRandomURL : function (){
		randomURL(function(){
			console.log("Testing");
			return url;
		});
	}
});