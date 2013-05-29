//// FLICKR API LIBRARY
// Note that you need the Meteor HTTP package for the calls

// Retrieves userID
FlickrUserID = function(apiKey,userName,callback){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key="+apiKey+"&username="+userName+"&format=json&nojsoncallback=1",function (error, result) {
		if (result.statusCode === 200) {
			var idResult = JSON.parse(result.content);
// use global variable to return to code in other files
			userID = idResult.user.nsid;
			}
		if (callback && typeof(callback) === "function") {  
			callback();
		}
	});
};

// Retrieves user's sets
FlickrSetList = function(apiKey,userID,flickrDB,flickrDBKey,callback){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key="+apiKey+"&user_id="+userID+"&format=json&nojsoncallback=1", {},function (error, result) {
		if (result.statusCode === 200) {
			var setResult = JSON.parse(result.content);
			var setCount = setResult.photosets.total;
			for (var i = 0; i < setCount; i++) {
				var info = setResult.photosets.photoset[i];
				var flickrSetID = info.id;
				flickrDB.update(
					{"id":flickrSetID},//query
					{$set:{"name":flickrDBKey,"data":info}},//update
					{upsert:true}//upsert
				);
			}
		}
		if (callback && typeof(callback) === "function") {  
			callback();
		}
	});
};

// Retrieves set's photos                
FlickrSetPhotos = function(apiKey,flickrSetID,flickrDBKey,callback){
	Meteor.http.call("GET","http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key="+apiKey+"&photoset_id="+flickrSetID+"&extras=date_taken,tags,machine_tags,path_alias,url_sq,url_t,url_s,url_m,url_o&format=json&nojsoncallback=1", function(error,result){
		if (result.statusCode === 200) {
			var photos = JSON.parse(result.content);
			var photoInfo = photos.photoset;
			var count = photoInfo.total - 1;
			// trying to insert random identifier and typical photo field name
			console.log(count);
			console.log(photoInfo);
			// not working yet...
			//for (var i=0; i++; i<count){
			//	photoInfo.photo[i].name = "photo";
			//	photoInfo.photo[i].random = Math.floor();
			//}
			flickrDB.update(
				{"id":flickrSetID},//query
				{$set:{"photos":photoInfo}},//update
				{upsert:true}//upsert
			);
		}
		if (callback && typeof(callback) === "function") {  
			callback();
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
};