// Created by Gareth Simons.
// Initial inspiration from flixploretest

//// Collections:
// Create flickr client-side minimongo collection.
flickrDB = new Meteor.Collection("flickrDB");

//// Variables:
var flickrDBKey = "flickrSets";
// Currently selected set for photo display.
Session.setDefault('setID', null);

Meteor.startup(function(){
	Meteor.subscribe("sets");
	Deps.autorun(function(){
		var flickrSetID = Session.get("setID");
		Meteor.subscribe("photos",flickrSetID);
	});
});

//Template.backgroundImage.background = function(){
	//FlickrRandomPhotoFromSet(apiKey,setID);
	//return Session.get("RandomURL");
//};

Template.setsBrowser.sets = function(){
	var test = flickrDB.find({name:flickrDBKey});
	console.log(test);//doesn't work?
	return flickrDB.find({name:flickrDBKey});
};

Template.setsBrowser.events = ({
	'click img' : function (event,template) {
		Session.set("setID",this.data.id);
	}
});

Template.photoBrowser.photos = function () {
	var test = flickrDB.find({name:"photo"});
	console.log(test);// doesn't work?
	return flickrDB.find({name:"photo"});
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