const db = require("../models");

const Report = db.report;

exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.send(reports);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

};