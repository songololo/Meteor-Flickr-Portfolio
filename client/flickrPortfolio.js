// Created by Gareth Simons.
// Initial inspiration from flixploretest

//// Collections:
// Create flickr client-side minimongo collection.
flickrDB = new Meteor.Collection("flickrDB");

//// Variables:
// Currently selected set for photo display.
Session.setDefault('setID', null);

Meteor.startup(function(){
	Meteor.subscribe("sets");
	//Deps.autorun(function(){
	//	Meteor.subscribe("sets",Session.get("flickrSetID"));
	//});
});

Template.backgroundImage.background = function(){
	//FlickrRandomPhotoFromSet(apiKey,setID);
	//return Session.get("RandomURL");
};

Template.setsBrowser.sets = function(){
	return flickrDB.find({name:"flickrSet"});
};

Template.setsBrowser.events = ({
	'click img' : function (event,template) {
		Session.set("flickrSetID",this.data.id);
	}
});

Template.photoBrowser.photos = function () {
	//return photoReturn(Session.get(""));
};

Template.photoBrowser.events = ({
	'click img' : function (event,template) {
		var imageURL = 'http://farm'+this.data.farm+'.staticflickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'_c.jpg';
		Session.set("currentPhoto",imageURL);
	}
});

Template.photoScroller.photo = function(){
	return Session.get("currentPhoto");
};