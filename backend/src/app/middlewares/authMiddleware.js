import jwt from "jsonwebtoken"
import User from "../models/User.js"

export default async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader)
            return res.status(401).json({ error: "Token não enviado" })

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)

        if (!user)
            return res.status(401).json({ error: "Usuário inválido" })

        req.user = user

        next()
    } catch {
        return res.status(401).json({ error: "Token inválido" })
    }
}