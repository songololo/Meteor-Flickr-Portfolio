// Created by Gareth Simons.
// Initial inspiration from flixploretest



//// Collections:
// Create flickr client-side minimongo collection.
flickrDB = new Meteor.Collection("flickrDB");



//// Variables:
var flickrDBKey = "flickrSets";
// Currently selected set for photo display.
Session.set('flickrSetID', null);



Meteor.startup(function(){
	Meteor.subscribe("sets");
});



//Template.backgroundImage.background = function(){
	//FlickrRandomPhotoFromSet(apiKey,setID);
	//return Session.get("RandomURL");
//};

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
	return Session.get("currentPhoto");
};