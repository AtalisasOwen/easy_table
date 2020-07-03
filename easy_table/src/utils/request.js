import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'

// create an axios instance
const service = axios.create({
    baseURL: 'http://10.9.8.52:8088/api', // url = base url + request url
    // baseURL: 'http://127.0.0.1:8088/api', // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 2000 // request timeout
})

service.interceptors.response.use(response => {
    const { data } = response
    if (data.message !== 'success') {
        Message({
            message: data.message || 'Error',
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(new Error(data.message || 'Error'))
    } else {
        return data.data
    }
}, err => {
    // console.log(err.config.url)
    if (err.config.url.startsWith('http://10.9.8.162/oauth/logout')) {
        console.log('吃掉一个注销重定向，不要管他')
        return
    }
    console.log(err.response.data.message)
    Message({
        message: err.response.data.message.substring(0, 40) || 'Error',
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(err)
})

export default service
