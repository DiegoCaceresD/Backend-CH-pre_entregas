import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default __dirname;

//bcrypt
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user , password) =>{
    console.log(`Datos a validar_ user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
}

//JWT
export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";
export const generateJWToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h'});
};

// export const authToken = (req, res, next) => {
//     //El JWT token se guarda en los headers de autorización.
//     const authHeader = req.headers.authorization;
//     console.log("reqq: ", req.headers);
//     console.log("Token present in header auth: ", authHeader);
//     if (!authHeader) {
//         return res.status(401).send({ error: "User not authenticated or missing token." });
//     }
//     const token = authHeader.split(' ')[1]; //Se hace el split para retirar la palabra Bearer.
//     //Validar token
//     jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
//         if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });
//         //Token OK
//         req.user = credentials.user;
//         console.log("metodo-authToken req.user: ",req.user);
//         next();
//     });
// };


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