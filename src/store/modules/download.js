const state = {
  progressList: [] // 文件下载进度列表
}

const mutations = {
  // 修改进度列表
  SET_PROGRESS: (state, progressObj) => {
    // 前面说的path时间戳是唯一存在的，所以如果在进度列表中找到当前的进度对象
    var index = state.progressList.findIndex(item => item.path === progressObj.path)
    if (index !== -1) {
      state.progressList[index].progress = progressObj.progress
    } else {
      state.progressList.push(progressObj)
    }
  },
  // 删除进度列表中的进度对象
  DEL_PROGRESS: (state, props) => {
    state.progressList.splice(state.progressList.findIndex(item => item.path === props), 1)
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
  }, props) {
    commit('DEL_PROGRESS', props)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
