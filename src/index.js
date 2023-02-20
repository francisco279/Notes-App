const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const index = require("./routes/index");
const users = require("./routes/users");
const notes = require("./routes/notes");
const conecta = require("./database");
const passport = require("passport");
const flash = require('connect-flash');

//initialization
const app = express();
conecta();
require("./config/passport");
//settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
    ".hbs",
      engine({
      layoutsDir    : path.join(app.get("views"), "layouts"), //common views
      partialsDir   : path.join(app.get("views"), "partials"), //common views
      defaultLayout : "main",
      extname       : ".hbs",
  })
);

app.set("view engine", ".hbs");
//midlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use(session({
    secret            : "mysecretapp",
    resave            : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//global variables
app.use((req, res, next) => {
  res.locals.message = req.flash("message");
  res.locals.user = req.user || null;
  next();
});
//routes
app.use(index);
app.use(users);
app.use(notes);
//static files
app.use("/public", express.static(path.join(__dirname, "./public")));

//server listening
app.listen(app.get("port"));
console.log("server on port 3000");