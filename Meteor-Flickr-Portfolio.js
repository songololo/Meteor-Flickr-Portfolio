// Created by Gareth Simons
// Inspiration from flixploretest


//// Variables required by Flickr API
//NOTE that Meteor 0.6 scopes variables by file... 
var apiKey = "b4b033a1b3c8f74573e021bd37565336";
var userName = "garethsimons";
//userID - can be generated, but then requires use of
// global variable if methods in separate file.
var userID = "78352164@N07";
//Starter setID - also provides information for background image.
var setID = "72157631158202186";
//keys for database references
var photoDBKey = "photo";
var setsDBKey = "sets";


//// Shared Databases
photoDB = new Meteor.Collection(photoDBKey);
setsDB = new Meteor.Collection(setsDBKey);


//// Client-side javascript
if (Meteor.is_client) {
	
	Template.backgroundImage.background = function(){
		FlickrRandomPhotoFromSet(apiKey,setID);
		return Session.get("RandomURL");
	};

	Template.setsBrowser.sets = function(){
		return setsDB.find({name:setsDBKey});
	};

	Template.setsBrowser.events = ({
		'click img' : function (event,template) {
			setID = this.data.id;
			FlickrSetPhotos (apiKey,setID,photoDB,photoDBKey);
		}
	});

	Template.photoBrowser.photos = function () {
		return photoDB.find({name:photoDBKey});
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
}


//// Server-side javascript
if (Meteor.is_server){
	
	Meteor.startup(function () {

		// check to see if userID is defined
		FlickrSetList(apiKey,userID,setsDB,setsDBKey);
	
		// startup page with photos by interestingness
		FlickrSetPhotos(apiKey,setID,photoDB,photoDBKey);
	
	});
}