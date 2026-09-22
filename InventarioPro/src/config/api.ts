import axios from 'axios';

const API_URL = 'http://192.168.1.48:3001'

export const api= axios.create({
    baseURL: API_URL,
    headers:{
        'Content-Type': 'application/json'
    }
})