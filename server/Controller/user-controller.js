const userService=require('../Service/user-service')

class UserController {
    
    async registration(req,res,nest){
        try {
            const {email,password}=req.body
            const userDate=await userService.registration(email,password)
            if (userDate.emailExist){
                res.json({message:userDate.emailExist})
            }
            res.cookie('refreshToken',userDate.refreshToken,{
                maxAge:30*24*60*60*1000,httpOnly:true
            })
            res.json(userDate)
            
        }catch (e) {
            console.log('Ошибка при регистрации',e)
        }
    }
    async login(req,res,nest){
        try {

        }catch (e) {

        }
    }
    async logout(req,res,nest){
        try {

        }catch (e) {

        }
    }
    async activate(req,res,nest){
        try {
            const activationLink=req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        }catch (e) {
console.log('ошибка при активации',e)
        }
    }
    async refresh(req,res,nest){
        try {

        }catch (e) {

        }
    }
    async getUsers(req,res,nest){
        try {
            res.json(["aza",'alina','diana'])
        }catch (e) {

        }
    }
}

module.exports=new UserController()