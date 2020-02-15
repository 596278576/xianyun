export let state=()=>{
    return{
        history:[]
    }
}

export const mutations = {
    setHistory(state, data) {
        //给格子赋值
        state.history.push(data)
    },
};