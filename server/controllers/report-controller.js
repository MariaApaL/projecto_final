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



function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

exports.addReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportType, eventId, userId } = req.body;
        const event = await Event.findById(eventId);

        const report = await Report.findOne({ type: reportType });

        const reportedUser = await User.findById(id);

        const user = await User.findById(userId);


        if (!event || !report || !user || !reportedUser) {
            return res.status(404).json({ message: 'No se encontró el evento, el reporte o el usuario.' });
        }

        const today = new Date();
        const eventReportsToday = reportedUser.reports.filter(report =>
            report.eventId.toString() === eventId &&
            isSameDay(report.created, today) &&
            report.userId.toString() === userId
        );

        if (eventReportsToday.length >= 2) {
            return res.status(400).json({ message: 'Ya has realizado los reportes diarios máximos a este evento' });
        }

        reportedUser.reports.push({
            report: report,
            createdAt: today,
            eventId: eventId,
            userId: userId
        });

        await reportedUser.save();
        res.status(200).json({ message: 'Se ha añadido el reporte al evento.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al añadir el reporte al evento.' });
    }
};

exports.getReportsByType = async (req, res) => {
    try {
        // Verificamos que exista el usuario y el tipo de reporte
        const { id } = req.params;
        const { reportType } = req.params;
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

exports.getReportById = async (req, res) => {
    try {
      const report = await Report.findOne({ _id: req.params.id});
      if (!report) {
        return res.status(404).send({ message: "Reporte no encontrado" });
      }
      res.send(report);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  
exports.deleteReportsByEventId = async (req, res) => {
    const  eventId  = req.params.id;

    try {
      // Busca los usuarios que tienen reportes con el eventId indicado
      const usuariosConReportes = await User.find({ 'reports.eventId': eventId });
      
      // Para cada usuario, elimina el reporte que tiene el eventId indicado
      for (let i = 0; i < usuariosConReportes.length; i++) {
        const usuario = usuariosConReportes[i];
        usuario.reports = usuario.reports.filter(report => report.eventId != eventId);
        await usuario.save();
      }
  
      // Elimina los reportes que tienen el eventId indicado en la colección de reportes
      await Report.deleteMany({ eventId });
  
      res.status(200).json({ message: 'Se eliminaron todos los reportes asociados al evento indicado.' });
    } catch (error) {
      res.status(500).json({ error: 'Ocurrió un error al eliminar los reportes.' });
    }
  }