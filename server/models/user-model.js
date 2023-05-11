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
    blocked: {
        type: Boolean,
        default: false
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
    valuations: [
        {
            type: Number,
            required: false,
            default: 0,
            min: 1,
            max: 5
        }
    ]
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);
module.exports = User;