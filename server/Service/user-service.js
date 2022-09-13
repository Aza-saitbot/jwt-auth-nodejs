const userModel=require('../Model/user-model')
const bcrypt=require('bcrypt')
const uuid=require('uuid')
const mailService=require('../Service/mail-service')
const tokenService=require('../Service/token-service')
const UserDto=require('../dtos/user-dto')

class UserService {

    async registration(email,password){
        const candidate=await userModel.findOne({email})
        if (candidate){
            throw new Error(`Пользотватель с таким email ${email} уже существует`)
            return {emailExist:`Пользотватель с таким email ${email} уже существует`}
        }
        const hashPassword=await bcrypt.hash(password,3)
        const activationLink=uuid.v4()
        const user=await userModel.create({email,password:hashPassword,activationLink})
       // await mailService.sendActivationMail(email,`${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto=new UserDto(user) // email,id,isActivated
        const tokens =tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id,tokens.refreshToken)

        return {
            ...tokens,
            user:UserDto
        }
    }

    async activate(activationLink){
        const user=await userModel.findOne({activationLink})
        if (!user){
            throw new Error('Некорректная ссылка активации')
        }
        user.activationLink=activationLink
        await user.save()
    }

}

module.exports=new UserService()