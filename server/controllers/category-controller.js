const db = require("../models");
const Event = db.event;
const Category = db.category;

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

};