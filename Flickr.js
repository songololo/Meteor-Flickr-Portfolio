//// Flickr API calls:
// Set your Flickr variables in the main file and pass
// into the Flickr functions called from the main.
// Note that you need the Meteor HTTP package for the calls


// Retrieves userID
FlickrUserID = function(apiKey,userName,callback){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key="+apiKey+"&username="+userName+"&format=json&nojsoncallback=1",function (error, result) {
		if (result.statusCode === 200) {
			var idResult = JSON.parse(result.content);
// use global variable to return to code in other files
// or use Session variable for client side handling
			var userID = idResult.user.nsid;
			Session.set("userID",userID);
			}
		if (callback && typeof(callback) === "function") {  
			callback();
		}
	});
};


// Retrieves user's sets
FlickrSetList = function(apiKey,userID,setsDB,setsDBKey,callback){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key="+apiKey+"&user_id="+userID+"&format=json&nojsoncallback=1", {},function (error, result) {
		if (result.statusCode === 200) {
			setsDB.remove({});
			var setResult = JSON.parse(result.content);
			var setCount = setResult.photosets.total -1;
			for (var i = 0; i < setCount; i++) {
				var info = setResult.photosets.photoset[i];
				setsDB.insert({name:setsDBKey, data:info});
			}
		}
		if (callback && typeof(callback) === "function") {  
			callback();
		}
	});
};


// Loads user's photos by interestingness
FlickrPhotosInterestingness = function(apiKey,userID,photoDB,photoDBKey){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+apiKey+"&user_id="+userID+"&extras=owner_name&sort=interestingness-desc&format=json&nojsoncallback=1", {},function (error, result) {
		if (result.statusCode === 200) {
			photoDB.remove({});
			var photoResult = JSON.parse(result.content);
			var photoCount = photoResult.photos.total -1;
			for (var i = 0; i < photoCount; i++) {
				var info = photoResult.photos.photo[i];
				photoDB.insert({name:photoDBKey, data:info});
			}
		}
	});
};


// Calls random photo from particular set
FlickrRandomPhotoFromSet = function(apiKey,setID){
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
// remember, any code out here is being run asynchronously...
};


// Calls Flickr API to retrieve photos from a specific set - run as method to allow database remove operation
FlickrSetPhotos = function(apiKey,setFlickrID,setDBid,photoDBKey){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key="+apiKey+"&photoset_id="+setFlickrID+"&format=json&nojsoncallback=1",function (error, result) {
		if (result.statusCode === 200) {
			//setsDB.setDBid.photoDBKey.remove();
			//photoDB.remove({});
			var photoResult = JSON.parse(result.content);
			var photoCount = photoResult.photoset.total -1;
			for (var i = 0; i < photoCount; i++) {
				var info = photoResult.photoset.photo[i];
				console.log(i+" "+setFlickrID);
				console.log(i+" "+setDBid);
				setsDB.update(setDBid,
					{$addToSet:
						{photos:
							{photo:photoDBKey,
							data:info}
						}
					});
			}
		}
	});
};