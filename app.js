// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

// hbs.registerHelper('formatUrl' , (url) =>{

//     return url.replace('https', 'http')
// })

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const projectName = "raquelhidalgo-My-Critterpedia-Maker";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

const critters = require("./routes/critters");
app.use("/", critters);

const fish = require("./routes/fish");
app.use("/", fish);

const bugs = require("./routes/bugs");
app.use("/", bugs);

const sea = require("./routes/seacreatures");
app.use("/", sea);

const profile = require("./routes/profile");
app.use("/", profile);

const catched = require("./routes/catched");
app.use("/", catched);

const toCatch = require("./routes/toCatch");
app.use("/", toCatch);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
