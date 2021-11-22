const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// // How many rounds should bcrypt run the salt (default [10 - 12 rounds])
// const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// router.get("/signup", isLoggedOut, (req, res) => {
//   res.render("signup");
// });

// router.post("/signup", isLoggedOut, (req, res) => {
//   const { username, password,passwordRepeat,email} = req.body;

//   if (!username || !email || !password || !passwordRepeat) {
//     return res
//       .status(400)
//       .render("signup", { errorMessage: "Please provide your username." });
//   }

//   if (password.length < 8) {
//     return res.status(400).render("auth/signup", {
//       errorMessage: "Your password needs to be at least 8 characters long.",
//     });
//   }

//   //   ! This use case is using a regular expression to control for special characters and min length
//   /*
//   const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

//   if (!regex.test(password)) {
//     return res.status(400).render("signup", {
//       errorMessage:
//         "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
//     });
//   }
//   */

//   // Search the database for a user with the username submitted in the form
//   User.findOne({ username }).then((found) => {
//     // If the user is found, send the message username is taken
//     if (found) {
//       return res
//         .status(400)
//         .render("signup", { errorMessage: "Username already taken." });
//     }

//     // if user is not found, create a new user - start with hashing the password
//     return bcrypt
//       .genSalt(saltRounds)
//       .then((salt) => bcrypt.hash(password, salt))
//       .then((hashedPassword) => {
//         // Create a user and save it in the database
//         return User.create({
//           username,
//           password: hashedPassword,
//         });
//       })
//       .then((user) => {
//         // Bind the user to the session object
//         req.session.user = user;
//         res.redirect("/");
//       })
//       .catch((error) => {
//         if (error instanceof mongoose.Error.ValidationError) {
//           return res
//             .status(400)
//             .render("signup", { errorMessage: error.message });
//         }
//         if (error.code === 11000) {
//           return res.status(400).render("auth/signup", {
//             errorMessage:
//               "Username need to be unique. The username you chose is already in use.",
//           });
//         }
//         return res
//           .status(500)
//           .render("signup", { errorMessage: error.message });
//       });
//   });
// });

// router.get("/login", isLoggedOut, (req, res) => {
//   res.render("login");
// });

// router.post("/login", isLoggedOut, (req, res, next) => {
//   const { username, password } = req.body;

//   if (!username) {
//     return res
//       .status(400)
//       .render("login", { errorMessage: "Please provide your username." });
//   }

//   // Here we use the same logic as above
//   // - either length based parameters or we check the strength of a password
//   if (password.length < 8) {
//     return res.status(400).render("auth/login", {
//       errorMessage: "Your password needs to be at least 8 characters long.",
//     });
//   }

//   // Search the database for a user with the username submitted in the form
//   User.findOne({ username })
//     .then((user) => {
//       // If the user isn't found, send the message that user provided wrong credentials
//       if (!user) {
//         return res
//           .status(400)
//           .render("login", { errorMessage: "Wrong credentials." });
//       }

//       // If user is found based on the username, check if the in putted password matches the one saved in the database
//       bcrypt.compare(password, user.password).then((isSamePassword) => {
//         if (!isSamePassword) {
//           return res
//             .status(400)
//             .render("login", { errorMessage: "Wrong credentials." });
//         }
//         req.session.user = user;
//         // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
//         return res.redirect("/");
//       });
//     })

//     .catch((err) => {
//       // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
//       // you can just as easily run the res.status that is commented out below
//       next(err);
//       // return res.status(500).render("login", { errorMessage: err.message });
//     });
// });

// router.get("/logout", isLoggedIn, (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res
//         .status(500)
//         .render("logout", { errorMessage: err.message });
//     }
//     res.redirect("/");
//   });
// });


//Renderizar el formulario de sign up
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

//Renderizar el formulario de login
router.get("/login", (req, res, next) => {
  res.render("login");
});

//POST para crear un nuevo usuario
router.post("/signup", async (req, res, next) => {
  const { username, email, password, passwordRepeat } = req.body;

  //Verificar que no hay ningún campo vacío
  if (!username || !email || !password || !passwordRepeat) {
    res.render("signup.hbs", { msg: "You need to fill all inputs" });
    return;
  }

  // Compara contraseñas
  if (password !== passwordRepeat) {
    res.render("signup.hbs", { msg: "Passwords does not match" });
    return;
  }

  //Verificar que la contraseña tiene mínimo 8 letras
  if (password.length < 8) {
    res.render("signup.hbs", {
      msg: "Your password should be at least 8 characters long",
    });
    return;
  }

  //Verificar que el usuario no existe ya
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.render("signup", { msg: "This user already has an account" });
    return;
  }

  //Verificar el correcto formato del correo
  if (/\S+@\S+\.\S+/.test(email) === false) {
    res.render("signup", { msg: "Please put a valid email" });
  }

  //Proceso para crear el usuario
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
});

//POST para hacer login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //Verificar que ningun campo esta vacio
  if (!username || !password) {
    res.render("login", { msg: "You need to fill all inputs" });
    return;
  }
  //Verificar si el usuario existe
  const existingUser = await User.findOne({ username: username });
  if (!existingUser) {
    res.render("login", { msg: "User doesn't exist" });
    return;
  }

  //Verificar si la contraseña es correcta
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    res.render("login", { msg: "Incorrect password" });
    return;
  }
  //Hacer login
  req.session.loggedUser = existingUser;
  console.log("SESSION ====> ,", req.session);
  res.redirect('/profile') 
});

//POST logout
router.get("/logout", async (req, res, next) => {
  res.clearCookie("connect.sid", { path: "/" });

  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
