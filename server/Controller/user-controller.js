const userService=require('../Service/user-service')
const {validationResult}=require('express-validator')
const ApiError=require('./../exeptions/api-error')

class UserController {
    
    async registration(req,res,next){
        try {
            const {email,password}=req.body

            console.log('BACKEND email,password',email,password)

            const errors=validationResult(req)

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
            }

            const userDate=await userService.registration(email,password)
            if (userDate.emailExist){
                res.json({message:userDate.emailExist})
            }
            res.cookie('refreshToken',userDate.refreshToken,{
                maxAge:30*24*60*60*1000,httpOnly:true
            })
            res.json(userDate)
            
        }catch (e) {
            next(e)
        }
    }
    async login(req,res,next){
        try {
            const {email,password}=req.body
            const userDate=await userService.login(email,password)

            res.cookie('refreshToken',userDate.refreshToken,{
                maxAge:30*24*60*60*1000,httpOnly:true
            })
            res.json(userDate)
        }catch (e) {
            next(e)
        }
    }
    async logout(req,res,next){
        try {
            const {refreshToken}=req.cookies
            const token=await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)

        }catch (e) {
            next(e)
        }
    }
    async activate(req,res,next){
        try {
            const activationLink=req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        }catch (e) {
            next(e)
        }
    }
    async refresh(req,res,next){
        try {
            const {refreshToken}=req.cookies
            const token=await userService.refresh(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)

        }catch (e) {
            next(e)
        }
    }
    async getUsers(req,res,next){
        try {
            const users=await userService.getAllUsers()
            return res.json(users)
        }catch (e) {
             next(e)
        }
    }
}

module.exports=new UserController()