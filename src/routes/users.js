const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

//show login form
router.get("/users/signin", (req, res) => {
    res.render("users/signin");
});

//log in
router.post("/users/signin", passport.authenticate("local", {
    failureRedirect: "/users/signin",
    successRedirect: "/notes", 
}));

//show the form to fill the register data
router.get("/users/signup", (req, res) => {
    res.render("users/signup");
});

//save user (register)
router.post("/users/signup", async(req, res) => {
    const { name, email, password, confirm_password } = req.body;
    let errors = [];
    if(name.length <=0)
    {
        errors.push({text: "Please insert your name"});
    }
    if(password != confirm_password)
    {
        errors.push({text: "Password do not match"});
    }
    if(password.length < 4)
    {
        errors.push({text: "Password must be at least 4 characters"});
    }
    
    if(errors.length > 0)
    {
        res.render("users/signup", {errors, name, email, password, confirm_password})
    } else
    {
        
        const emailUser = await User.findOne({email: email});
        if(emailUser)
        {
            res.redirect("/users/signup");
        }
        
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        res.redirect("/users/signin");
      
        
    }
    
});

router.get("/users/logout", async(req, res, next) => {
    await req.logOut((err) => {
        if (err) return next(err);
        req.flash("success_msg", "You are logged out now.");
        res.redirect("/users/signin");
    });
    
});
module.exports = router;