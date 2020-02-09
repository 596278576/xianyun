// 小格子负责存储数据
//通过this.$store.state.user.userInfo获得整个对象
export let state = () => {
    return {
        userInfo: {
            token: '',
            user: {}
        }
    }
}
//管理员存储数据的方法
export const mutations = {
    setUserInfo(state, data) {
        //给格子赋值
        state.userInfo = data
    },

};
//异步请求获取数据
export const actions = {
    login(store, data) {
        return this.$axios({
                url: '/accounts/login',
                method: 'post',
                data
            }).then(res => {
                // store是整个仓库
                //commit 给管理员传递数据数据
                store.commit('setUserInfo', res.data)
            })
    },
    //验证码
    yanzhengma(store, data){
        return this.$axios({
            url:'/captchas',
            method:'post',
            data
        })
    },
    //注册
    register(store, data){
        return this.$axios({
            url:'/accounts/register',
            method:'post',
            data
        }).then(res=>{
            store.commit('setUserInfo',res.data)
        })
    }
};