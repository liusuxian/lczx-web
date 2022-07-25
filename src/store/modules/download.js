const state = {
  progressList: [] // 文件下载进度列表
}

const mutations = {
  // 修改进度列表
  SET_PROGRESS: (state, progressObj) => {
    // path时间戳是唯一存在的
    var index = state.progressList.findIndex(item => item.path === progressObj.path)
    if (index !== -1) {
      state.progressList[index].progress = progressObj.progress
    } else {
      state.progressList.push(progressObj)
    }
  },
  // 删除进度列表中的进度对象
  DEL_PROGRESS: (state, path) => {
    state.progressList.splice(state.progressList.findIndex(item => item.path === path), 1)
  }
}

const actions = {
  setProgress({
    commit
  }, progressObj) {
    commit('SET_PROGRESS', progressObj)
  },
  delProgress({
    commit
  }, path) {
    commit('DEL_PROGRESS', path)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
