const userModel=require('../Model/user-model')
const bcrypt=require('bcrypt')
const uuid=require('uuid')
const mailService=require('../Service/mail-service')

class UserService {

    async registration(email,password){
        const candidate=await userModel.findOne(email)
        if (candidate){
            throw new Error(`Пользотватель с таким email ${email} уже существует`)
        }
        const hashPassword= bcrypt.hash(password,3)
        const activationLink=uuid.v4()
        const user=await userModel.create({email,password:hashPassword,activationLink})
await mailService.sendActivationMail(email,activationLink)
    }

}

module.exports=new UserService()