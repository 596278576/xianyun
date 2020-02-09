import {Message} from 'element-ui'
export default (data)=>{
    data.$axios.onError(err=>{
        let {statusCode,message}=err.response.data
        if(statusCode===400){
            Message.error(message)
        }
    })
}