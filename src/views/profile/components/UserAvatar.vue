<template>
  <div>
    <img :src="options.img" title="点击上传头像" class="img-circle img-lg" @click="editCropper()">
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal="false" append-to-body>
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            @realTime="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            action=""
            accept=".jpg,.jpeg,.png"
            :show-file-list="false"
            :http-request="requestUpload"
            :before-upload="beforeUpload"
          >
            <el-button slot="trigger" icon="el-icon-upload" size="small">选取照片</el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()" />
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { VueCropper } from 'vue-cropper'
import {
  uploadAvatar
} from '@/api/user'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    VueCropper
  },
  // 属性
  props: {
    avatar: {
      type: String,
      default: ''
    }
  },
  // 数据
  data() {
    // 这⾥存放数据
    return {
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '修改头像',
      options: {
        img: '', // 裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true // 固定截图框大小 不允许改变
      },
      previews: {}
    }
  },
  // 计算属性类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    avatar: function(val) {
      if (val) {
        this.setAvatarBase64(val, (base64) => {
          this.options.img = base64
        })
      }
    }
  },
  // 在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用
  beforeCreate() { },
  // 在实例创建完成后被立即同步调用（可以访问当前this实例）
  created() { },
  // 在挂载开始之前被调用
  beforeMount() { },
  // 实例被挂载后调用（可以访问DOM元素）
  mounted() { },
  // 在数据发生改变后，DOM被更新之前被调用
  beforeUpdate() { },
  // 在数据更改导致的虚拟DOM重新渲染和更新完毕之后被调用
  updated() { },
  // 被keep-alive缓存的组件激活时调用
  activated() { },
  // 被keep-alive缓存的组件失活时调用
  deactivated() { },
  // 实例销毁之前调用
  beforeDestroy() { },
  // 实例销毁后调用
  destroyed() { },
  // 在捕获一个来自后代组件的错误时被调用
  errorCaptured() { },
  // ⽅法集合
  methods: {
    // 编辑头像
    editCropper() {
      this.open = true
    },
    // 覆盖默认的上传行为
    requestUpload() {
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 上传预处理
    beforeUpload(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob((data) => {
        var type = data.type
        var types = {
          'image/jpeg': 'jpeg',
          'image/png': 'png'
        }
        var fileName = 'avatar.png'
        if (types[type]) {
          fileName = 'avatar.' + types[type]
        }
        var formData = new FormData()
        formData.append('avatarFile', data, fileName)
        uploadAvatar(formData).then((res) => {
          this.open = false
          if (res.code === 0) {
            this.options.img = res.data.fileInfo.originFileUrl
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }
          this.$refs.cropper.clearCrop()
        }).catch(() => { })
      })
    },
    // 实时预览
    realTime(data) {
      this.previews = data
    },
    // 设置头像base64
    setAvatarBase64(src, callback) {
      const _this = this
      const image = new Image()
      // 处理缓存
      // image.src = src + '?v=' + Math.random()
      image.src = src
      // 支持跨域图片
      image.crossOrigin = '*'
      image.onload = function() {
        const base64 = _this.transBase64FromImage(src, image)
        callback && callback(base64)
      }
    },
    // 将网络图片转换成base64格式
    transBase64FromImage(src, image) {
      var tmpImgType = src.substring(src.lastIndexOf('.') + 1)
      var imgType = 'image/png'
      if (tmpImgType === 'png') {
        imgType = 'image/png'
      } else if (tmpImgType === 'jpeg') {
        imgType = 'image/jpeg'
      }
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, image.width, image.height)
      return canvas.toDataURL(imgType)
    }
  }
}
</script>

<style lang='scss' scoped>
.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
}

.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}
</style>
