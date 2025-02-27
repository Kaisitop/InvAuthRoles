import mongoose from "mongoose";


export const ROLES = ["usuario", "admin", "moderador"]
const roleSchema = new mongoose.Schema(
    {
        name: String,
    },
    {
        versionKey: false,
    }
)
export default mongoose.model("Role", roleSchema)