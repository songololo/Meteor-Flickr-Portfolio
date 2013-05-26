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

Meteor.startup(function () {	
	FlickrSetList(apiKey,userID,flickrDB,"flickrSet",function(){
		Meteor.publish("sets",function(){
			return flickrDB.find();
		});
	});
});

//// Publish:
// Publish sets collection to client.


// Publish photos to client.
//Meteor.publish("photos",function(){
//	return flickrDB.find();
//});