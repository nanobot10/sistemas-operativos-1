import {Schema, model, Document} from 'mongoose'

const pacienteSchema = new Schema({
    nombre: {
        type: String,
        default: 'unnamed'
    },
    departamento: {
        type: String,
        default: 'sin departamento'
    },
    edad: {
        type: Number,
        default: 0
    },
    "Forma de contagio": {
        type: String,
        default: 'desconocida'
    },
    estado: {
        type: String
    }
});

interface IPaciente extends Document {
    nombre: string,
    departamento: string,
    edad: number,
    "Forma de contagio": string,
    estado: string
}

export const Paciente = model<IPaciente>('infectados', pacienteSchema);