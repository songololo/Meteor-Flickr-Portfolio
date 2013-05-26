// Created by Gareth Simons
// Inspiration from flixploretest

//keys for database references
var flickrDBKey = "flickrSet";

//// Shared Databases
flickrDB = new Meteor.Collection(flickrDBKey);

//// Client-side javascript
if (Meteor.is_client) {
	Meteor.startup(function(){
		Meteor.subscribe("sets");
		Deps.autorun(function(){
			Meteor.subscribe("photos",Session.get("flickrSetID"));
		});
	});
	
	Template.backgroundImage.background = function(){
		//FlickrRandomPhotoFromSet(apiKey,setID);
		//return Session.get("RandomURL");
	};

	Template.setsBrowser.sets = function(){
		return sets.find();
		//return setsDB.find();
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
}



//// Server-side javascript
if (Meteor.is_server){

//// Variables required by Flickr API
//NOTE that Meteor 0.6 scopes variables by file... 
	var apiKey = "b4b033a1b3c8f74573e021bd37565336";
// userName only required if generating userID
	var userName = "garethsimons";
// userID - can be generated, but then requires use of
// global variable if methods in separate file.
	var userID = "78352164@N07";
//Starter setID - also provides information for background image.


	Meteor.startup(function () {	
		FlickrSetList(apiKey,userID,flickrDB,flickrDBKey,function(){
			Meteor.publish("sets",function(){
				return flickrDB.find();
			//Meteor.publish("photos",);
			});
			Meteor.publish("photos",function(){
				return flickrDB.find();
			});
		});
	});
}