const express = require('express')

const Producto = require ('../models/producto')
const { verifyToken } = require('../middlewares/authentication')

const app = express()

const _ = require('underscore')
//===================================
//   Obtener todos los productos
//===================================
app.get('/productos', verifyToken,(req,res)=>{

  let desde = req.query.desde || 0
  desde = Number(desde)
  let limite = req.query.limite || 5
  limite = Number(limite)
  let condition = { disponible: true }

  Producto.find(condition, 'nombre precioUni descripcion disponible categoria usuario')
    .skip(desde)
    .limit(limite)
    .sort('nombre')
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, productos)=>{
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      Producto.count( condition, (err, quantity) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          })
        }
        res.json({
          ok: true,
          productos,
          quantity
        })
      })

    })
})

//===================================
//   Obtener un producto por ID
//===================================
app.get('/productos/:id', (req,res)=>{
  //Trae un producto -> populate Usuario y Categoria
  let id= req.params.id
  Producto.findById(id)
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, productoDB)=>{
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok:true,
        producto: productoDB,
        message: 'Producto Borrado'
      })
    })
})

//===================================
//   Burcar Producto
//===================================
app.get('/productos/buscar/:termino', verifyToken, (req,res)=>{

  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');

  Producto.find( {nombre: regex} )
  .populate('categoria', 'descripcion')
  .exec((err,productos)=>{

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      productos
    })
  })

})


//===================================
//   Crear un nuevo producto
//===================================
app.post('/productos', verifyToken,(req,res)=>{
  //Grabar el usuario y una categoria del listado de categorias
  let body = req.body
  let producto = new Producto({
    nombre      : body.nombre,
    precioUni   : body.precioUni,
    descripcion : body.descripcion,
    disponible  : body.disponible,
    categoria   : body.categoria,
    usuario     : req.usuario._id
  })

  producto.save((err, productoDB)=>{

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.status(201).json({
      ok:true,
      producto: productoDB
    })
  })
})

//===================================
//   Actualizar un producto
//===================================
app.put('/productos/:id', verifyToken, (req,res)=>{
  //Grabar el usuario y una categoria del listado de categorias
  let id = req.params.id

  req.body.usuario = req.usuario._id

  let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario'])

  Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB){
      return res.status(400).json({
        ok: false,
        err: {
        message: 'Producto no encontrado'
        }
      })
    }

    res.json({
      ok: true,
      producto: productoDB
    })
  })
})

//===================================
//   Borrar un producto
//===================================
app.delete('/productos/:id', verifyToken,(req,res)=>{
  let id = req.params.id

  let changeState = {
    disponible: false
  }

  Producto.findByIdAndUpdate(id, changeState, {new: true},(err, productoDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      if (!productoDB){
        return res.status(400).json({
          ok: false,
          err: {
          message: 'Producto no encontrado'
          }
        })
      }

      res.json({
        ok: true,
        producto: productoDB
      })
    })
})

module.exports = app;
