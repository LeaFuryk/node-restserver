const express = require('express');
const fileUpload = require('express-fileupload');
const { verifyToken } = require('../middlewares/authentication')
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', verifyToken, (req, res) =>{

  let tipo = req.params.tipo
  let id = req.params.id

  if (!req.files){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No files were uploaded.'
      }
    });
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length - 1];

  //Validar tipo
  let tipoValido = ['productos', 'usuarios'];

  if (tipoValido.indexOf(tipo) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos validos son '+ tipoValido.join(', ')
      }
    })
  }

  //Validar Extensiones
  let extensionesValidas = ['pnj', 'jpg', 'gif', 'jpeg'];

  if(extensionesValidas.indexOf(extension) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones validas son '+ extensionesValidas.join(', '),
        ext: extension
      }
    })
  }

  //Cambiar nombre al archivo
  let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(err) => {

    if (err){
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (tipo === 'usuarios'){
    imagenUsuario(id,res, nombreArchivo);
    }else {
      imagenProducto(id,res, nombreArchivo);
    }

  });
});

function imagenUsuario(id, res, nombreArchivo){

  Usuario.findById(id, (err, usuarioDB)=>{

    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!usuarioDB){
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
        message: 'Usuario no encontrado'
        }
      })
    }

    borrarArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado)=>{
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    })

  })

};

function imagenProducto(id,res, nombreArchivo){

  Producto.findById(id, (err,productoDB) =>{
    if (err) {
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB){
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
        message: 'Producto no encontrado'
        }
      })
    }

    borrarArchivo(productoDB.img, 'productos');

    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado)=>{
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      res.status(200).json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      })
    })

  })

}

function borrarArchivo(nombreImg, tipo){

  let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`)

  if (fs.existsSync(pathUrl)){
    fs.unlinkSync(pathUrl);
  }

}

module.exports= app;
