export let state = () => {
    return {
        userInfo: {
            token: '',
            user: {}
        }
    }
}
export const mutations = {
    setUserInfo(state, data) {
        state.userInfo = data
    }
};

export const actions = {
    login(store, data) {
        return this.$axios({
                url: '/accounts/login',
                method: 'post',
                data
            }).then(res => {
                store.commit('setUserInfo', res.data)
            })
    }
};