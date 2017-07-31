var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console(err);
        }else {
            res.render("comments/new", {campground: foundCampground}); 
        }
    })
    
});

// COmments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            // redirec to campgrounds
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err);
                }else {
                    // add user name and ID to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // save comment
                    newComment.save();
                    
                    campground.comments.push(newComment);
                    campground.save();
                    console.log(newComment);
                    res.redirect('/campgrounds/'+ campground._id);
                }
            })
          
        }
    });
}); 

// COMMENT edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            console.log(err);
            res.redirect("back");     
        } else {
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});        
        } 
    });
});

//Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


//COmment destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

module.exports = router;