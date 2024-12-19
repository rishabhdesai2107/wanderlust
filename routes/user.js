const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password );
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","User was entered successfully");
        res.redirect("/listings");
    });//direct login after signup
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }

}));

router.get("/login",(req,res)=>{
    res.render("users/login");
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(async(req,res)=>{
    req.flash("success","welcome to wanderlust you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl)

;})); //authentication

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    });
})




module.exports = router;