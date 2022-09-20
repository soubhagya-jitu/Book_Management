
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
  };
  
  const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
  };
  
  const isValidEmail = function (email) {
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexForEmail.test(email);
  };

  
const userLogin = async function (req, res) {

    try { const requestBody = req.body;
  
      if (!isValidRequestBody(requestBody)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide input credentials" });
      }
  
      const userName = requestBody.email;
      const password = requestBody.password;
  
      // validating userName and password
      if (!isValid(userName)) {return res.status(400).send({ status: false, message: "email is required" });}
  
      if (!isValidEmail(userName)) {return res.status(400).send({ status: false, message: "please enter a valid email address" });}
  
      if (!isValid(password)) {return res.status(400).send({ status: false, message: "password is required" });}
  
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) 
      {return res.status(400).send({status: false,message: "password should be: 8 to 15 characters, at least one letter & one number",});}
  
       const loginUser = await UserModel.findOne({email: userName, password: password,});
  
      if (!loginUser) {return res.status(404).send({ status: false, message: "invalid login credentials" });}
      
  
      const userID = loginUser._id;
      const payLoad = { userId: userID };
      const secretKey = "rass!@#512345ssar767";
  
      // creating JWT
      const token = jwt.sign(payLoad, secretKey, { expiresIn: "100s" });
  
      //res.header("x-api-key", token);
  
      res
        .status(200)
        .send({ status: true, message: "login successful", data: token });

    } catch (err) { res.status(500).send({ error: err.message });}
  };

  module.exports.userLogin = userLogin;