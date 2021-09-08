var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getToken', (req, res) => {
  let body = req.body;
  let url = null;
  let platform = body.platform ? body.platform : null;
  let tempData = {};
  let reference_id = body.reference_id ? body.reference_id : null;
  let reward_gallery_key = body.reward_gallery_key ? body.reward_gallery_key : null;
  let widget = body.widget ? body.widget : null;
  let email = body.email ? body.email : null;
  let username = body.username ? body.username : null;
  let password = body.password ? body.password : null;
  if (platform) {
    if (platform == 'dev') {
      url = 'https://apidev.rybbon.net/v1.6/reward_gallery'
    } else if (platform == 'qa') {
      url = 'https://apiqa.rybbon.net/v1.6/reward_gallery'
    } else {
      res.status(400).json({ message: 'Invalid Platform' })
    }
  } else {
    res.status(400).json({ message: 'Invalid Platform' })
  }
  if (!username || !password) {
    res.status(401).json({ message: 'authentication faild' })
  }
  if (email) {
    tempData.email = email;
  }
  if (reference_id) {
    tempData.reference_id = reference_id;
  }
  if (reward_gallery_key) {
    tempData.reward_gallery_key = reward_gallery_key;
  }
  if (widget) {
    if (widget == 'true') {
      tempData.widget = true;
    }

  }

  let data = tempData;
  console.log(data);

  let Authorization = authenticateUser(username, password);

  var config = {
    method: 'post',
    url: url,
    headers: {
      'Authorization': Authorization,
      'Content-Type': 'text/plain'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      let tempData= response.data;
      if(widget){
        tempData.script='https://rybbon-rg-widget.s3-us-west-2.amazonaws.com/dist/reward-gallery-widget.min.js'
      }
      res.status(200).json({ data:tempData});
    })
    .catch(function (error) {
      console.log(error);
      res.status(400).json({ error: error });
    });

})
module.exports = router;
function authenticateUser(user, password) {
  const btoa = function (str) { return Buffer.from(str).toString('base64'); }
  var token = user + ":" + password;

  // Should i be encoding this value????? does it matter???
  // Base64 Encoding -> btoa
  var hash = btoa(token);

  return "Basic " + hash;
}
