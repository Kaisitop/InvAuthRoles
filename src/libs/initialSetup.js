import Role from '../models/Role.js'

export const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount()

        if (count > 0) return;

        const values = await Promise.all([
            new Role({ name: "usuario" }).save(),
            new Role({ name: "moderador" }).save(),
            new Role({ name: "admin" }).save()
        ])

        console.log(values)
    } catch (error) {
        console.log(error)
    }

}