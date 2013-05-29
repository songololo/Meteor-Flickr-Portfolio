// Created by Gareth Simons.
// Initial inspiration from flixploretest.



//// VARIABLES:
var apiKey = "b4b033a1b3c8f74573e021bd37565336";
var userName = "garethsimons";
userID = null //"78352164@N07"; Global variable - set in flickr.js
var flickrDBKey = "flickrSets";



//// SERVER SIDE CODE
Meteor.startup(function () {	
	FlickrUserID(apiKey,userName,function(){
		FlickrSetList(apiKey,userID,flickrDB,flickrDBKey,function(){
			var setList = flickrDB.find({name:flickrDBKey});
			setList.forEach(function(eachSetItem){
				var flickrSetID=eachSetItem.data.id;
				FlickrSetPhotos(apiKey,flickrSetID,flickrDBKey);
			});
			Meteor.publish("sets",function(){
				return flickrDB.find(
					{},
					{fields: {id:1,data:1,photos:1}}
				);
			});
		});
	});
});