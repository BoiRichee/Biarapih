const {Products, Categories, Users} = require("../models");

module.exports = class PublicController {
    static async getPub (req, res){
        try {
            const options = {
                include: [
                    {
                        model: Users,         
                        attributes: { exclude: ['password'] }  
                    },
                    {
                        model: Categories
                    }
                ],
                where: {}, 
              };
            const data = await Products.findAll(options);
            res.status(200).json(data);
        } catch (err) {
            console.log("~ PublicController ~ getPub ~ error:", err);
        res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getPubID (req, res){
        try {
            const options = {
                include: [
                    {
                        model: Users,         
                        attributes: { exclude: ['password'] }  
                    },
                    {
                        model: Categories
                    }
                ],
                where: {
                    id: req.params.id
                }, 
              };
            const data = await Products.findAll(options);
            if (!data[0]) {
                res.status(404).json({ message: `Product id: ${req.params.id} not found` });
                return;
            }
            res.status(200).json(data);
        } catch (err) {
            console.log("~ PublicController ~ getPubID ~ error:", err);
        res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}