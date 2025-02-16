import axios from "axios";

const authAxios = axios.create({
    baseURL: 'https://api.hifiv5.shop',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default authAxios;
