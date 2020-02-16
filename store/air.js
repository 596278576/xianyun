export let state = () => {
    return {
        history: [],
        airList: {
            insurances: [], // 初始化保险数据
            seat_infos: {},
            price:0
        }
    }
}

export const mutations = {
    setHistory(state, data) {
        //给格子赋值
        state.history.push(data)
    },
    setAirList(state, data) {
        //给格子赋值
        // state.history.push(data)
        state.airList = data
    },
    setPrice(state, data){
        state.price=data
    }
};