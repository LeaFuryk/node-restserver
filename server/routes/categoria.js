const express = require('express')

const _ = require('underscore')

const Categoria = require ('../models/categoria')
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication')

const app = express()

//===============================
//   Mostrar todas las categorias
//===============================
app.get('/categoria', verifyToken, (req,res)=>{
  Categoria.find({}, 'descripcion usuario')
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias)=>{
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      Categoria.count((err, quantity) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          })
        }
        res.json({
          ok: true,
          categorias,
          quantity
        })
      })

    })

  })

  //===============================
  //   Mostrar una categoria por ID
  //===============================

  app.get('/categoria/:id', verifyToken,(req,res)=>{
    let id = req.params.id
    Categoria.findById(id, (err, categoriaDB)=>{

      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok:true,
        categoria: categoriaDB
      })
    })
})

//===============================
//   Crear nueva categoria
//===============================
app.post('/categoria', verifyToken, (req,res)=>{
  //Regresa la nueva categorias
  //req.usuario._id
  let body = req.body
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  })

  categoria.save((err, categoriaDB)=>{

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok:true,
      categoria: categoriaDB
    })
  })
})

//===============================
//   Actualizar la categoria
//===============================
app.put('/categoria/:id', verifyToken, (req,res)=>{
  let id = req.params.id
  let body = _.pick(req.body, ['descripcion'])

  Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
        message: 'Categoria no encontrado'
        }
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
})

//===============================
//   Borrar categoria
//===============================
app.delete('/categoria/:id', [verifyToken, verifyAdminRole], (req,res)=>{
  //Solo un administrador puede borrar una categorias
  //Categoria.findByIdAndRemove
  let id = req.params.id

  Categoria.findByIdAndRemove(id,(err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
        message: 'Categoria no encontrada'
        }
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
})

module.exports = app;
