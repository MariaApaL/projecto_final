import { model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user-interface';

const userSchema = new Schema({

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
}
);

export const User = model<IUser>('User', userSchema);
