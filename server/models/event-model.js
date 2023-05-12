const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor, escriba un nombre para el evento'],
        trim: true
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',

        }
    ],
    date: {
        type: Date,
        required: [true, 'Por favor, introduzca la fecha del evento'],

    },
    location: {
        type: String,
        required: [true, 'Por favor, introduzca la ubicación del evento']
    },
    price: {
        type: Number,
        required: [true, 'Por favor, introduzca el precio del evento']
    },

    picture: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Por favor, especifique el ID del creador del evento']
    },
    plazas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    numPlazas: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        required: false
    },
   

    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            text: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;