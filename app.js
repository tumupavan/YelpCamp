var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override");
    
// requiring routes
var campgroundRoutes= require("./routes/campgrounds"),
    commentRoutes= require("./routes/comments"),
    authRoutes= require("./routes/index");
    

mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();


// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "once again rusty is cutest dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(authRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

//Configuring listening port
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp camp app has started");
});
