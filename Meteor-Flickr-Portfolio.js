//inspiration from flixploretest





//// Shared variables
var apiKey = "b4b033a1b3c8f74573e021bd37565336";
var userName = "garethsimons";
var userID ='78352164@N07';//starter userID - otherwise server code executes before Flickr returns the value to the userID function.
var photoDBKey = "photo";//key for photo database references
var setsDBKey = "sets";
var setID = "72157631158202186";//Starter setID - also provides information for background image.



//// Shared Databases
photoDB = new Meteor.Collection(photoDBKey);
setsDB = new Meteor.Collection(setsDBKey);



//// Shared Functions
// Calls Flickr API to retrieve user's sets
var FlickrSetList = function(){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key="+apiKey+"&user_id="+userID+"&format=json&nojsoncallback=1", {},function (error, result) {
		if (result.statusCode === 200) {
			setsDB.remove({});
			var setResult = JSON.parse(result.content);
			var setCount = setResult.photosets.total -1;
			for (i = 0; i < setCount; i++) {
				info = setResult.photosets.photoset[i];
				setsDB.insert({name:setsDBKey, data:info});
			}
		}
	});
};

// Calls Flickr API to load user's photos by interestingness
var FlickrPhotosInterestingness = function(){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+apiKey+"&user_id="+userID+"&extras=owner_name&sort=interestingness-desc&format=json&nojsoncallback=1", {},function (error, result) {
		if (result.statusCode === 200) {
		//console.log(result.content);
			photoDB.remove({});
			var photoResult = JSON.parse(result.content);
			var photoCount = photoResult.photos.total -1;
			for (i = 0; i < photoCount; i++) {
				info = photoResult.photos.photo[i];
				photoDB.insert({name:photoDBKey, data:info});
			}
		}
	});
};

// Calls random photo from particular set
var FlickrRandomPhotoFromSet = function(setID){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key="+apiKey+"&photoset_id="+setID+"&format=json&nojsoncallback=1",function (error, result) {
		if (result.statusCode === 200) {
//console.log(result.content);
		var photoResult = JSON.parse(result.content);
		var photoCount = photoResult.photoset.total;
		var randomPhoto = Math.floor((Math.random()*photoCount)+1);
		var selectedPhoto = photoResult.photoset.photo[randomPhoto];
		var imageURL = 'http://farm'+selectedPhoto.farm+'.staticflickr.com/'+selectedPhoto.server+'/'+selectedPhoto.id+'_'+selectedPhoto.secret+'_b.jpg';
		Session.setDefault("RandomURL",imageURL);		
		}
	});
// any code out here is being run asynchronously...from what is inside...
};

//// Client-side javascript
if (Meteor.is_client) {

	Template.backgroundImage.background = function(){
		FlickrRandomPhotoFromSet(setID);
		return Session.get("RandomURL");
	};

	Template.setsBrowser.sets = function(){
		return setsDB.find({name:setsDBKey});
	};

	Template.setsBrowser.events = ({
		'click img' : function (event,template) {
			setID = this.data.id;
			Meteor.call('FlickrSetPhotos',setID);
		}
	});

	Template.photoBrowser.photos = function () {
		return photoDB.find({name:photoDBKey});
	};
	
	Template.photoBrowser.events = ({
		'click img' : function (event,template) {
			var imageURL = 'http://farm'+this.data.farm+'.staticflickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'_c.jpg';
			Session.set("currentPhoto",imageURL);
			//console.log(Session.get("currentPhoto"));

		}
	});
	
	Template.photoScroller.photo = function(){
		return Session.get("currentPhoto");
	};
}



//// Server-side javascript
if (Meteor.is_server){
	Meteor.startup(function () { // code to run on server at startup


			
//// Methods
// Calls Flickr API to retrieve the userID
	Meteor.methods({
		FlickrUserID : function(){
			Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key="+apiKey+"&username="+userName+"&format=json&nojsoncallback=1",function (error, result) {
				if (result.statusCode === 200) {
					var idResult = JSON.parse(result.content);
					userID = idResult.user.nsid;
					console.log("User ID updated to "+userID);
				}
			});
		}
	});

// Calls Flickr API to retrieve photos from a specific set - run as method to allow database remove operation
	Meteor.methods({
		FlickrSetPhotos : function(setID){
			Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key="+apiKey+"&photoset_id="+setID+"&format=json&nojsoncallback=1",function (error, result) {
				if (result.statusCode === 200) {
					//console.log(result.content);
					photoDB.remove({});
					var photoResult = JSON.parse(result.content);
					var photoCount = photoResult.photoset.total -1;
					for (i = 0; i < photoCount; i++) {
						info = photoResult.photoset.photo[i];
						photoDB.insert({name:photoDBKey, data:info});
					}
				}
			});
		}
	});
		
		
		
		
		
		// retrieve userID if undefined
		if (userID === undefined) {
			updateUserID(apiKey,userName);
		}

// retrieve the sets photos and populate setsDB
		FlickrSetList();
		
// startup page with photos by interestingness
		Meteor.call('FlickrSetPhotos',setID);

	});
}
