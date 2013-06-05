// Created by Gareth Simons.
// Initial inspiration from flixploretest



//// VARIABLES ////
var flickrDBKey = "flickrSets";
// Currently selected set for photo display.
Session.set("setsDisplay", true);
Session.set("setID", null);
Session.set("setName", null);
Session.set("photoName", null);
Session.set("currentPhoto", null);
Session.set("randomURL", null);



//// CLIENT SIDE CODE ////
Meteor.startup(function(){
	if (Session.get("randomURL")===null){
		Meteor.call("fetchRandomURL", function(error,result){
			console.log("Random photo URL is "+result);
			Session.set("randomURL", result);
		});
	}
	Meteor.subscribe("sets");
});



//// TEMPLATE MANAGERS ////
Template.backgroundImage.background = function(){
	return Session.get("randomURL");
};

Template.header.set = function(){
	if (Session.get('setName') !== null){
		return Session.get('setName');
	}
};

Template.header.photo = function(){
	if (Session.get("photoName") !== null){
		return Session.get('photoName');
	}
};

Template.setsBrowser.sets = function(){
	if (Session.get("setsDisplay") === true){
		return flickrDB.find();
	}
};

Template.photoBrowser.photos = function () {
	if(Session.get("setID") !== null){
		var flickrSetID = (Session.get("setID"));
		var photoArray = flickrDB.findOne({id:flickrSetID});
		return photoArray.photos.photo;
	}
};

Template.photoScroller.photo = function(){
	if (Session.get('currentPhoto') !== null){
		return Session.get("currentPhoto");
	}
};



//// TEMPLATE EVENTS ////
Template.header.events = ({
	'click button' : function () {
		Meteor.call("newBackgroundImage", function(error,result){
			Session.set("randomPhotoURL", result);
		});
	}
});

Template.header.events = ({
	'click #title' : function (){
		Session.set("setID", null);
		Session.set("setName", null);
		Session.set("currentPhoto", null);
		Session.set("photoName", null);
	}
});

Template.header.events = ({
	'click #setsIntro' : function (){
		console.log("button clicked");
		Session.set("setsDisplay", true);
		console.log("setsDisplay");
	}
});

Template.header.events = ({
	'click #setTitle' : function (){
		Session.set("currentPhoto", null);
		Session.set("photoName", null);
	}
});

Template.setsBrowser.events = ({
	'click img' : function (event,template) {
		Meteor.call("newRandomURL", function(error,result){
			console.log("Random photo URL is "+result);
			Session.set("randomURL", result);
		});
		
		Session.set("setID", this.data.id);
		Session.set("setName", this.data.title._content);
		Session.set("currentPhoto", null);
		Session.set("photoName", null);
	}
});

Template.photoBrowser.events = ({
	'click img' : function (event,template) {
		Session.set('photoName',this.title);
		var imageURL = 'http://farm'+this.farm+'.staticflickr.com/'+this.server+'/'+this.id+'_'+this.secret+'_c.jpg';
		Session.set("currentPhoto",imageURL);
		Session.set("setID", null);
	}
});


//// TEMPLATE JQUERY ////
Template.header.rendered = function(){
	$('.path').mouseenter(function(){
		$(this).fadeTo('fast',0.8);
	});
	$('.path').mouseleave(function(){
		$(this).fadeTo('fast', 0.5);
	});
};

Template.footer.rendered = function(){
	$('li').hover(function(){
		$(this).fadeOut(200);
		$(this).fadeIn(200);
	});
};