const express = require('express');
const fileUpload = require('express-fileupload');
const { verifyTokenImg } = require('../middlewares/authentication')
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.get('/imagen/:tipo/:img', verifyTokenImg, (req,res)=>{

  let tipo = req.params.tipo;
  let img  = req.params.img;

  let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

  if (fs.existsSync(pathImg)){
    res.status(200).sendFile(pathImg)
  }else {
    let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`)
    res.status(200).sendFile(noImagePath);
  }
})

module.exports = app;
