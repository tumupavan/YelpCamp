var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// INDEX routing which shows all the campgrounds
router.get("/", function(req, res){
    // get all campgrounds from DB 
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});


// CREATE routing which creates new campground and save it to DB
router.post("/", middleware.isLoggedIn ,function(req, res){
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.desc,
        price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var obj = { name: name, image: image, description: desc, author: author, price: price };
    //create a new campground and save to DB
    Campground.create(obj, function(err, newCampground){
        if(err){
            console.log(err);
        } else {
            //console.log(newCampground);
            res.redirect("/campgrounds");        
        }
    });
    
});


//NEW routing - show the form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


// SHOW routing - shows information about one single campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("error finding id");
        } else {
            // find campground with provided id and show that on page
            //console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
     
});


// EDIT campground 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});        
    });
});


//UPDATE campground

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            //console.log(updatedCampground);
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect to show page
})


//DESTROY campground route

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    }) 
});


module.exports = router;
