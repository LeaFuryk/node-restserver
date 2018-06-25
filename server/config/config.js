// =================================
//          PUERTO
// =================================

process.env.PORT = process.env.PORT || 3000;

//==================================
//          ENTORNO
//==================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==================================
//          Base de Datos
//==================================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe'
}else {
  urlDB = 'mongodb://admin:admin1234@ds117111.mlab.com:17111/cafefuryk'
}
process.env.URLDB= urlDB;
