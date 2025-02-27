import mongoose, { Schema, model } from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    username: { type: String, unique: true},
    email: { type: String, unique: true},
    password: { type: String, unique: true},
    roles: [{
        ref: "Role",
        type: Schema.Types.ObjectId
    }]
},
    {
        timestamps: true,
        versionKey: false
    }
)

const Usuario = mongoose.model('Usuario', UsuarioSchema)
export default Usuario  