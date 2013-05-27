// Created by Gareth Simons.
// Initial inspiration from flixploretest.

//// Collections:
// Create flickr server-side collection.
flickrDB = new Meteor.Collection("flickrDB");

//// Variables:
// Flickr variables:
var apiKey = "b4b033a1b3c8f74573e021bd37565336";
var userName = "garethsimons";
var userID = "78352164@N07";
var flickrDBKey = "flickrSets";

Meteor.startup(function () {	
	FlickrSetList(apiKey,userID,flickrDB,flickrDBKey,function(){
		var setList = flickrDB.find({name:flickrDBKey});
		setList.forEach(function(eachSetItem){
			var flickrSetID=eachSetItem.data.id;
			FlickrSetPhotos(apiKey,flickrSetID,flickrDBKey);
		});
		Meteor.publish("sets",function(){
			return flickrDB.find(
				{},//find all documents
				{id:1,data:1}//return only selected - doesn't work?
			);
		});
		Meteor.publish("photos",function(setID){
			return flickrDB.find(
				{"id":setID},
				{"photos.photo":1}
				);
		});
	});
});
//// Publish:
// Publish sets collection to client.


// Publish photos to client.
//Meteor.publish("photos",function(){
//	return flickrDB.find();
//});