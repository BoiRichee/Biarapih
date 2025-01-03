const router = require("express").Router();
const ProductController = require("../controllers/ProdCont");
const CategoryController = require("../controllers/CategoryCont");
const PublicController = require("../controllers/PubCont")
const AuthorController = require("../controllers/UserCont");
const { jwtVerify } = require("../helpers/jwt");
const { Users, Products } = require("../models")

// Primary Entity =

// Testing App
router.get('/', (req, res) => {
    res.send({ message: "App Running"});
});



// Authentication Untuk Entitas Utama
async function authentication (req, res, next){
    const bearerToken = req.headers.authorization;
    // console.log(bearerToken) ----> Cek Token
    if(!bearerToken){
        next({ name: "Unauthorized"})
        return;
    }
    const [type, token] = bearerToken.split(" ");
    // console.log({ type, token }); ----> Cek Hasil Split Typer dan Token
    if(!token){
        next({ name: "Unauthorized"})
        return;
    }
   try {
    const data = jwtVerify(token);
    // console.log(data) ----> Verifikasi Token
     const user = await Users.findByPk(data.id);
     if(!user){
        next({ name: "Unauthorized"})
        return;
     }
     // Data Kemudian Masuk Ke Handler di Tahap Selanjutnya
     req.user = user;
     next();
   } catch (err) {
    next(err);
   }
}


// Membuat Kondisi Khusus Untuk Admin
function guardAdmin(req, res, next) {
    if(req.user.admin === true){
        next();
    } else {
        next({ name: "Forbidden"})
        return;
    }
}


// Membuat Kondisi Khusus Untuk Admin dan Staff
async function guardAdminOrStaff(req, res, next) {
    if (req.user.admin === true) {
        next();
    } else if (req.user.admin === false) {
        try {
            const data = await Products.findByPk(req.params.id);
            // console.log(data.authorId, req.author.id);
            
            if (!data) {
                next({ name: "Data Not Found"})
                return;
            }

            if (data.userId === req.user.id) {
                return next(); 
            } else {
                next({ name: "Forbidden"})
                return;
            }
        } catch (err) {
            next(err);
        }
    }
    else {
        next({ name: "Forbidden"})
        return;
    }
}

router.use(authentication)

// Membuat Entitas Utama (Create/POST)
router.post('/products', ProductController.createProduct)

// Mengambil Semua Data Entitas Utama (Read/GET)
router.get('/products', ProductController.getProducts)

// Mengambil Semua Detail Data Entitas Berdasarkan ID
router.get('/products/:id', ProductController.getProductsByID)

// Melakukan Editting pada Products (PUT by Id)
router.put('/products/:id', guardAdminOrStaff, ProductController.editProductsByID)

// Menghapus Products Berdasarkan ID
router.delete('/products/:id', guardAdminOrStaff, ProductController.deleteProductsByID)



// Seccondary Entity =

// Membuat Entitas Sekunder (Create/POST)
router.post('/categories', guardAdmin, CategoryController.createCategory)

// Mengambil Semua Data Entitas Sekunder (Read/GET)
router.get('/categories', CategoryController.getCategories)

// Melakukan Editting pada Category (PUT by Id)
router.put('/categories/:id', guardAdmin, CategoryController.editCategoriesByID)



// Public =

// Mengambil Semua Data Entitas Utama Untuk Public (Read/GET)
router.get('/pub/products', PublicController.getPub)

// Mengambil Semua Data Entitas Utama Berdasarkan ID Untuk Public (Read/GET)
router.get('/pub/products/:id', PublicController.getPubID)



// Author Endpoint =

// Registration (Create/POST)
router.post('/register', AuthorController.register)

// Login (Create/POST)
router.post('/login', AuthorController.login)



// Products Endpoint To Upload Cover URL (Upload File)\
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
router.patch('/products/:id/cover-url', guardAdminOrStaff, upload.single("avatar"), ProductController.uploadCover)



// Error Handler

router.use(errorHandler)

function errorHandler (err, req, res, next) {
    console.log("Routers ~ Error Handler ~ Err:", err)
    switch (err.name) {
        // 400
        case "Error Validation":
        case "SequlizedValidationError":
        case "SequlizedUniqueConstraintError":
            return res.status(400).json({ message: "Bad Request" });
        // 401
        case "Unauthorized":
        case "JsonWebTokenError":
            return res.status(401).json({ message: err.message?? "Invalid Data" });
        // 403
        case "Forbidden":
            return res.status(403).json({ message: "You're not authorized" });
        // 404
        case "Data Not Found":
            return res.status(404).json({ message: "Data Not Found" });
        default:
            res.status(500).json({ message: "Internal Server Error" })
    }
  }




module.exports = router
