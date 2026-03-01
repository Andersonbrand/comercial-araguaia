import jwt from "jsonwebtoken"
import User from "../models/User.js"
import AppError from "../../utils/AppError.js"

class SessionController {
  async store(req, res, next) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user) throw new AppError("Usuário não encontrado", 401)

      const passwordMatch = await user.checkPassword(password)
      if (!passwordMatch) throw new AppError("Senha incorreta", 401)

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      )

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
    } catch (err) {
      next(err)
    }
  }
}

export default new SessionController()