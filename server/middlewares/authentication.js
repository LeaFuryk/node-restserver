const jwt = require ('jsonwebtoken')

//==================================
//     Verificación del token
//==================================

let verifyToken = ( req, res, next ) => {
  let token = req.get('Authorization')

  jwt.verify( token, process.env.SEED, (err, decoded) => {

    if (err){
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Error de Autenticación'
        }
      })
    }

    req.usuario = decoded.usuario;

    next();
  })
}

//==================================
//     Verificación del rol
//==================================
let verifyAdminRole = ( req, res, next ) =>{

  let usuario = req.usuario;

  if(usuario.role === 'ADMIN_ROLE'){
    next();
  }else {
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador.'
      }
    })
  }
}

//==================================
//     Verificación token de la imagen
//==================================
let verifyTokenImg = ( req, res, next ) =>{

  let token = req.query.token;

  jwt.verify( token, process.env.SEED, (err, decoded) => {

    if (err){
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Error de Autenticación'
        }
      })
    }

    req.usuario = decoded.usuario;

    next();
  })
}

module.exports = {
  verifyToken,
  verifyAdminRole,
  verifyTokenImg
}
