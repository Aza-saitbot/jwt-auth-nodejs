import {observer} from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {UserService} from "./services/UserService";
import {IUser} from "./models/IUser";

function App() {
const [users,setUsers]=useState<IUser[]>([])
    const {store} = useContext(Context)

    async function getUsers() {
        try {
            const res=await UserService.fetchUsers()
            setUsers(res.data)
        }catch (e:any) {
            console.log('Ошибка при отправка запроса за юзерами',e.response.data.message)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    if (store.isLoading){
        return <div>Загрузка...</div>
    }

    if (!store.isAuth){
        return <LoginForm/>
    }

    return (
        <div>
            <h1>{store.isAuth ? `Пользователь авторизован email ${store?.user?.email}` : 'Нужно авторизоваться заново'}</h1>
           <button onClick={()=>store.logout()}>Выйти</button>
            <button onClick={getUsers} >Получит список пользователей</button>
            {users.map(i=>
            <div key={i.email}>{i.email}</div>
            )}
        </div>
    );
}

export default observer(App);
