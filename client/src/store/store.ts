import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import {AuthService} from "../services/AuthService";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";


export class Store {
    user={} as IUser
    isAuth=false
    isLoading=false

    constructor() {
        makeAutoObservable(this)
    }

    setUser(user:IUser){
        this.user=user
    }
    setIsAuth(bool:boolean){
        this.isAuth=bool
    }
    setLoading(bool:boolean){
        this.isLoading=bool
    }

    async registration(email:string,password:string){
        try {
            const response=await AuthService.registration(email,password)
            console.log('registr',response)
            localStorage.setItem('token',response.data.accessToken)
            this.setIsAuth(true)
            this.setUser(response.data.user)
        }catch (e:any) {
            console.log(e.response.data.message)
        }
    }
    async login(email:string,password:string){
        try {
            const response=await AuthService.login(email,password)
            console.log('login',response)
            localStorage.setItem('token',response.data.accessToken)
            this.setIsAuth(true)
            this.setUser(response.data.user)
        }catch (e:any) {
            console.log(e.response.data.message)
        }
    }
    async logout(){
        try {
            await AuthService.logout()
            localStorage.removeItem('token')
            this.setIsAuth(false)
            this.setUser({} as IUser)
        }catch (e:any) {
            console.log(e.response.data.message)
        }
    }
    async checkAuth(){
        this.setLoading(true)
        try {
            const response =await axios.get<AuthResponse>(`${API_URL}/refresh`,{
                withCredentials:true,
            })
            localStorage.setItem('token',response.data.accessToken)
            this.setIsAuth(true)
            this.setUser(response.data.user)
        }catch (e:any) {
            console.log(e.response.data.message)
        }finally {
            this.setLoading(false)
        }
    }
}