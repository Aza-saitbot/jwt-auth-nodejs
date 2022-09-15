const userModel=require('../Model/user-model')
const bcrypt=require('bcrypt')
const uuid=require('uuid')
const mailService=require('../Service/mail-service')
const tokenService=require('../Service/token-service')
const UserDto=require('../dtos/user-dto')
const ApiError=require('./../exeptions/api-error')

class UserService {

    async registration(email,password){
        const candidate=await userModel.findOne({email})
        if (candidate){
            throw ApiError.BadRequest(`Пользотватель с таким email ${email} уже существует`)
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
    async login(email,password){
        const user=await userModel.findOne({email})
        if (!user){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals= await bcrypt.compare(password,user.password)

        if (!isPassEquals){
            throw ApiError.BadRequest('Не верный пароль')
        }

        const userDto=new UserDto(user)
        const tokens =tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id,tokens.refreshToken)

        return {
            ...tokens,
            user:userDto
        }
    }

    async activate(activationLink){
        const user=await userModel.findOne({activationLink})
        if (!user){
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        user.activationLink=activationLink
        await user.save()
    }

    async logout(refreshToken){
        const token=await tokenService.removeToken(refreshToken)
        return token
    }
    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError()
        }

        const userData= await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb=await tokenService.findToken(refreshToken)
        if (!tokenFromDb || !userData){
            throw ApiError.UnauthorizedError()
        }
        const user=await userModel.findById(userData.id)
        const userDto=new UserDto(user) // email,id,isActivated
        const tokens =tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id,tokens.refreshToken)

        return {
            ...tokens,
            user:userDto
        }

    }

    async getAllUsers(){
        const users=await userModel.find()
        return users
    }

}

module.exports=new UserService()