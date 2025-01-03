const { MyProducts } = require("../models");

module.exports = class MyProductController {
    static async addProduct(req, res){
        try {
            const myProd = await MyProducts.create(req.body);
            res.status(201).json(myProd)
        } catch (err) {
            console.log("My Product Controller ~ addProduct ~ Err:", err);
            if (err.name === "SequlizedValidationError"){
                res.status(400).json({ message : err.errors[0].message })
            } else {
                res.status(500).json({ message: "Internal Server Error"});
            }
        }
    }

    static async getMyProd(req, res){
        try {
            const myProd = await MyProducts.findAll();
            res.status(200).json(myProd)
        } catch (err) {
            console.log("My Product Controller ~ getMyProd ~ Err:", err);
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async editMyProdByID(req, res){
        try {
            const myProd = await MyProducts.findByPk(req.params.id);
            // Data Not Found Handler
            if (!myProd) {
                res.status(404).json({ message: `Product id: ${req.params.id} not found` });
                return;
            }
            await myProd.update(req.body)
            res.status(200).json({message: `Product id: ${req.params.id} updated`});
        } catch (err) {
            console.log("MyProduct Controller ~ editMyProdByID ~ Err:", err);
            if (!req.body.name){
                res.status(400).json({ message : "ID is Required!" })
            } else {
                res.status(500).json({ message: "Internal Server Error"});
            }
        }
    }
}