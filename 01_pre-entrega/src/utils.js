import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import exp from 'constants';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default __dirname;

//bcrypt
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user , password) =>{
    console.log(`Datos a validar_ user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
}


// Configuracion MULTER
const storage = multer.diskStorage(
    {
        // ubicaion del directorio donde voy a guardar los archivos
        destination: function (req, file, cb) {
            cb(null, `${__dirname}/public/img`)
        },

        // el nombre que quiero que tengan los archivos que voy a subir
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)

        }
    }
)
// este seria nuestro Middleware
export const uploader = multer({
    storage,
    // si se genera algun error, lo capturamos
    onError: function (err, next) {
        console.log(err);
        next();
    }
});