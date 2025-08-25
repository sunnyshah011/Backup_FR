import express from 'express'
import { loginUser, registerUser, adminLogin, sendVerifyOtp, verifyEmail } from '../controllers/user.controller.js'
import authUser from '../middleware/auth.middleware.js'

const userRouter = express.Router()

//normal customer auth
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

//verify admin role
userRouter.post('/admin', adminLogin)

//account verification
userRouter.post('/send-verify-otp', authUser, sendVerifyOtp)
userRouter.post('/verify-account', authUser, verifyEmail)



export default userRouter