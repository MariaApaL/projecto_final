"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: [true, 'Por favor, escriba un nombre de usuario'],
        unique: true,
        uniqueCaseInsensitive: true
    },
    firstName: {
        type: String,
        required: [true, 'Por favor, escriba su nombre']
    },
    lastName: {
        type: String,
        required: [true, 'Por favor, escriba su apellido']
    },
    password: {
        type: String,
        required: [true, 'Por favor, escriba una contraseña']
    },
    email: {
        type: String,
        required: [true, 'Por favor, escribe un email']
    },
    age: {
        type: Date,
        min: '1923-01-01',
        max: '2099-01-01',
        required: [true, 'Por favor, introduzca su cumpleaños']
    },
    bio: {
        type: String,
        required: false
    },
    picture: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)('User', userSchema);
