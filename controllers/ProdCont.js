const { Products } = require("../models");

const cloudinary = require("cloudinary").v2;
                cloudinary.config({ 
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
                api_key: process.env.CLOUDINARY_API_KEY, 
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

module.exports = class ProductController {
    static async getProducts(req, res){
        try {
            const product = await Products.findAll();
            res.status(200).json(product)
        } catch (err) {
            console.log("Product Controller ~ getProducts ~ Err:", err);
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async getProductsByID(req, res){
        try {
            const product = await Products.findByPk(req.params.id);
            if (!product) {
                res.status(404).json({ message: `Product id: ${req.params.id} not found` });
                return;
            } res.status(200).json(product)
        } catch (err) {
            console.log("Product Controller ~ getProductsByID ~ Err:", err);
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async createProduct(req, res){
        try {
            const product = await Products.create(req.body);
            res.status(201).json(product)
        } catch (err) {
            console.log("Product Controller ~ createProduct ~ Err:", err);
            if (err.name === "SequlizedValidationError"){
                res.status(400).json({ message : err.errors[0].message })
            } else {
                res.status(500).json({ message: "Internal Server Error"});
            }
        }
    }

    static async editProductsByID(req, res){
        try {
            const product = await Products.findByPk(req.params.id);
            if (!product) {
                res.status(404).json({ message: `Product id: ${req.params.id} not found` });
                return;
            }
            await product.update(req.body)
            res.status(200).json({message: `Product id: ${req.params.id} updated`});
        } catch (err) {
            console.log("Product Controller ~ editProductsByID ~ Err:", err);
            if (!req.body.name){
                res.status(400).json({ message : "Name is Required!" })
            } else {
                res.status(500).json({ message: "Internal Server Error"});
            }
        }
    }

    static async deleteProductsByID (req, res){
        try {
            const product = await Products.findByPk(req.params.id);
            if (!product) {
                res.status(404).json({ message: `Product id: ${req.params.id} not found` });
                return;
            }
            await product.destroy(req.body)
            res.status(200).json({message: `Product id: ${req.params.id} deleted`});
        } catch (err) {
            console.log("Product Controller ~ deleteProductsByID ~ Err:", err);
            res.status(500).json({ message: "Internal Server Error"});
        }
    }

    static async uploadCover (req, res, next){
        try {
            //Update & Validation
            const productId = +req.params.id
            const product = await Products.findByPk(productId);
            if(!product){
                throw { name: "Data Not Found", message: "Product Not Found"};
            }
            // Upload Image
            const result = await cloudinary.uploader.upload(
           `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`, {
            folder: "rmt-56",   
            public_id: req.file.originalname,
           }
       )
            await product.update ({ imgUrl: result.secure_url });
            res.json({ message: "Image Been Uploaded!"});
        } catch (err) {
            console.log("Product Controller ~ uploadCover ~ Err:", err);
            res.status(500).json({ message: "Internal Server Error"});
        }
    }
}