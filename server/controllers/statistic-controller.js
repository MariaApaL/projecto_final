
const db = require("../models");
const User = db.user;
const Event = db.event;
const Report = db.report;

exports.getUsersAvgEventCount = async (req, res) => {

  //este método obtiene el promedio de eventos por usuario
  //se utiliza el método aggregate de mongoose para realizar la consulta
  try {
    const result = await Event.aggregate([
      // se agrupan todos los eventos por el author
      {
        $group: {
          _id: '$author',
          count: { $sum: 1 },
        },
      },
      // se hace una consulta a la colección de usuarios 
      //y une los resultados con los resultados de la anterior consulta
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      // se descompone el array de 'user', para que se pueda acceder a su contenido
      {
        $unwind: '$user',
      },
      // se recogen solo los campos 'username' y 'eventCount'
      {
        $project: {
          _id: 0,
          username: '$user.user',
          eventCount: '$count',
        },
      },
      // se agrupa nuevamente, pero esta vez 
      //sin ningún campo específico, para obtener la cantidad de usuarios y el total de eventos
      {
        $group: {
          _id: null,
          eventCountSum: { $sum: '$eventCount' },
          userCount: { $sum: 1 },
        },
      },
      // Proyecta solo el campo 'avgEventCount' que es el resultado final
      {
        $project: {
          _id: 0,
          avgEventCount: { $divide: ['$eventCountSum', '$userCount'] },
        },
      },
    ]);

    // resultado de la consulta como una respuesta JSON
    res.json(result[0]);
  } catch (err) {

    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getAverageReportsPerUser = async (req, res) => {
  try {
    const users = await User.find({});
    let totalReports = 0;
    users.forEach(user => {
      totalReports += user.reports.length;
    });

    const averageReports = totalReports / users.length;

    res.json({ averageReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getAvgParticipants = async (req, res) => {
  try {
    const result = await Event.aggregate([
      // Agrupa los eventos por el número de plazas ocupadas
      {
        $group: {
          _id: null,
          totalParticipants: { $sum: { $size: '$plazas' } },
          eventCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          avgParticipants: { $divide: ['$totalParticipants', '$eventCount'] }
        }
      }
    ]);
   

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.json({ avgParticipants: 0 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};