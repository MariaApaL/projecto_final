//creamos nuestro user
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, 'Por favor, escriba un nombre de usuario'],
        unique: true,
        uniqueCaseInsensitive: true,
        trim: true,
        match: /^\S+$/
    },
    name: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: [true, 'Por favor, escriba una contraseña']
    },
    email: {
        type: String,
        required: [true, 'Por favor, escribe un email'],
        trim: true,
        uniqueCaseInsensitive: true,
        match: /^\S+@\S+$/
    },
    bio: {
        type: String,
        required: false
    },
    picture: {
        type: String,
        required: false

    },

    deleted: {
        type: Boolean,
        default: false
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            default: []
        }
    ],
   
    reports: [
        {
            report:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report"

            },
            created: {
                
                    type: Date,
                    default: Date.now
                },
            eventId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
            },
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
            
        
        },
        
    ],
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);
module.exports = User;