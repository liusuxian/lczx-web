const state = {
  progressList: [] // 文件下载进度列表
}

const mutations = {
  // 修改进度列表
  SET_PROGRESS: (state, progressObj) => {
    // 如果进度列表存在
    if (state.progressList.length) {
      // 前面说的path时间戳是唯一存在的，所以如果在进度列表中找到当前的进度对象
      if (state.progressList.find(item => item.path === progressObj.path)) {
        // 改变当前进度对象的progress
        state.progressList.find(item => item.path === progressObj.path).progress = progressObj.progress
      }
    } else {
      // 当前进度列表为空，没有下载任务，直接将该进度对象添加到进度数组内
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
