import User from "../models/User.js"
import AppError from "../../utils/AppError.js"

class UserController {
    async store(req, res, next) {
    try {
        const { name, email, password, role } = req.body

        const exists = await User.findOne({ email })
        if (exists) throw new AppError("Usuário já existe", 409)

        const user = await User.create({
            name,
            email,
            password,
            role: role === "admin" ? "admin" : "user",
        })

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })
    } catch (err) {
        next(err)
    }
}

    async index(req, res, next) {
        try {
            const users = await User.find().select("-password")
            res.json(users)
        } catch (err) {
            next(err)
        }
    }

    async profile(req, res, next) {
        try {
            const user = await User.findById(req.user._id).select("-password")
            if (!user) throw new AppError("Usuário não encontrado", 404)
            res.json(user)
        } catch (err) {
            next(err)
        }
    }
}

export default new UserController()