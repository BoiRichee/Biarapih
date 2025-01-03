const { Categories } = require("../models");

module.exports = class CategoryController {
    static async createCategory(req, res){
        try {
            const category = await Categories.create(req.body);
            res.status(201).json(category)
        } catch (err) {
            console.log("Category Controller ~ createCategory ~ Err:", err);
            if (err.name === "SequlizedValidationError"){
                res.status(400).json({ message : err.errors[0].message })
            } else {
                res.status(500).json({ message: "Internal Server Error"});
            }
        }
    }

    static async getCategories(req, res){
        try {
            const category = await Categories.findAll();
            res.status(200).json(category)
        } catch (err) {
            console.log("Category Controller ~ getCategories ~ Err:", err);
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async editCategoriesByID(req, res){
        try {
            const category = await Categories.findByPk(req.params.id);
            // Data Not Found Handler
            if (!category) {
                res.status(404).json({ message: `Category id: ${req.params.id} not found` });
                return;
            }
            await category.update(req.body)
            res.status(200).json({message: `Category id: ${req.params.id} updated`});
        } catch (err) {
            console.log("Category Controller ~ editCategoriesByID ~ Err:", err);
            if (!req.body.name){
                res.status(400).json({ message : "ID is Required!" })
            } else {
                res.status(500).json({ message: "Internal Server Error"});
            }
        }
    }
}