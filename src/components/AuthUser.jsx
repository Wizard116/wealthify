import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthUser() {
    // const navigate = useNavigate();
    const [token, setToken] = useState();
    const [user, setUser] = useState("");
    
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return tokenString;
    }
    
    const getUser = () => {
        // const userString = localStorage.getItem('username');
        // const userDetail = JSON.parse(userString);
        // return userDetail;
        return '';
    }
    

    const saveToken = (user, token) => {
        localStorage.setItem('token', token)
        // localStorage.setItem('user', JSON.stringify(user))

        setToken(token)
        // setUser(user)
        location.href = "/"
        // navigate('/dashboard')
    }

    const http = axios.create({
        baseURL: import.meta.env.VITE_BASE_URL+'/auth',
        headers: {
            "Content-Type": "application/json"
        }
    });
    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        http,
        getUser

    }
}