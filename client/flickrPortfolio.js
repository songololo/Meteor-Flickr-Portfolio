// Created by Gareth Simons.
// Initial inspiration from flixploretest



//// VARIABLES:
var flickrDBKey = "flickrSets";
// Currently selected set for photo display.
Session.set("flickrSetID", null);
Session.set("randomPhotoURL", null);
Session.set("currentPhoto", null);



//// CLIENT SIDE CODE:
Meteor.startup(function(){
	Meteor.subscribe("sets");
	Meteor.call("randomURL",function(error,result){
		Session.set("randomPhotoURL", result);
	});
});



//// TEMPLATE MANAGERS:

Template.backgroundImage.background = function(){
	return Session.get("randomPhotoURL");
};

Template.setsBrowser.sets = function(){
	return flickrDB.find();
};

Template.setsBrowser.events = ({
	'click img' : function (event,template) {
		Session.set("flickrSetID",this.data.id);
		}
});

Template.photoBrowser.photos = function () {
	var flickrSetID = Session.get("flickrSetID");
	if (flickrSetID !== null){
		var photoArray = flickrDB.findOne({id:flickrSetID});
		return photoArray.photos.photo;
	}
};

Template.photoBrowser.events = ({
	'click img' : function (event,template) {
		var imageURL = 'http://farm'+this.farm+'.staticflickr.com/'+this.server+'/'+this.id+'_'+this.secret+'_c.jpg';
		Session.set("currentPhoto",imageURL);
	}
});

Template.photoScroller.photo = function(){
	if (Session.get("currentPhoto") !== null){
		return Session.get("currentPhoto");
	}
};