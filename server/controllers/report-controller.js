const db = require("../models");
const User = db.user;
const Event = db.event;
const Report = db.report;

exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.send(reports);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

};

// exports.checkReportLimit = async (req, res) => {
//     const userId = req.params.id;
//     const eventId = req.body.eventId;

//     // consulta a la base de datos para obtener el número de reportes realizados por el usuario para el evento en las últimas 24 horas
//     const today = new Date();
//     const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
//     const reportCount = await Report.countDocuments({
//         user: userId,
//         event: eventId,
//         createdAt: { $gte: yesterday }
//     });

//     res.send({ reports: reportCount });
// }


function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

exports.addReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportType, eventId } = req.body;
        const user = await User.findById(id);
        const report = await Report.findOne({ type: reportType });
        if (!user || !report) {
            return res.status(404).json({ message: 'No se encontró el usuario o el reporte.' });
        }
        const today = new Date();
        const eventReportsToday = user.reports.filter(report => report.eventId.toString() === eventId && isSameDay(report.created, today));
        if (eventReportsToday.length >= 2) {
            return res.status(400).json({ message: 'Ya has realizado los reportes diarios máximos a este evento' });
        }
        user.reports.push({
            report: report,
            createdAt: today,
            eventId: eventId
        });
        await user.save();
        res.status(200).json({ message: 'Se ha añadido el reporte al usuario.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al añadir el reporte al usuario.' });
    }
};

exports.getReportsByType = async (req, res) => {
    try {
        // Verificamos que exista el usuario y el tipo de reporte
        const { id } = req.params;
        const { reportType } = req.body;
        const user = await User.findById(id).populate('reports');
        if (!user) {
            return res.status(404).json({ message: 'No se encontró el usuario.' });
        }
        const reportsByType = user.reports.filter(report => report.type === reportType);
        res.status(200).json({ reports: reportsByType });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al obtener los reportes por tipo.' });
    }
};