const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("message", "Not Authorized");
    res.redirect("/users/signin");
};

module.exports = isAuthenticated;