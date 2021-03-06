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
  urlDB = process.env.MONGO_URI
}
process.env.URLDB= urlDB;

//==================================
//          Vencimiento del token
//==================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.EXPIRATION_TOKEN= '48h'


//==================================
//        SEED de Autenticación
//==================================
process.env.SEED= process.env.SEED || 'este-es-el-seed-de-desarrollo'

//==================================
//          Google Client ID
//==================================
process.env.CLIENT_ID= process.env.CLIENT_ID || '1082790972715-ee9v65eeamf1oleumoimp7pof3n6fb40.apps.googleusercontent.com'
