<template>
  <div class="app-container">
    <el-form
      ref="projectForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="projectForm"
      :rules="projectFormRules"
      label-position="left"
    >
      <el-form-item prop="name" label="项目名称" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="name"
          v-model="projectForm.name"
          placeholder="请输入项目名称"
          name="name"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="type" label="项目性质" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="projectForm.type" tabindex="2" placeholder="请选择项目性质" clearable style="width: 150px">
          <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="origin" label="项目来源" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="projectForm.origin" tabindex="3" placeholder="请选择项目来源" clearable style="width: 150px">
          <el-option v-for="item in originList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="step" label="项目阶段" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="projectForm.step" tabindex="4" placeholder="请选择项目阶段" clearable style="width: 150px">
          <el-option v-for="item in stepList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="fileUploadStatus" label="上传状态" label-width="70px" style="margin-right: 20px;">
        <el-select
          v-model="projectForm.fileUploadStatus"
          tabindex="5"
          placeholder="请选择上传状态"
          clearable
          style="width: 150px"
        >
          <el-option v-for="item in uploadStatusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="businessType" label="业务类型" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="projectForm.businessType" tabindex="6" placeholder="请选择业务类型" clearable style="width: 150px">
          <el-option v-for="item in businessTypeList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="businessForms" label="业态" label-width="40px" style="margin-right: 20px;">
        <el-select
          v-model="projectForm.businessForms"
          tabindex="7"
          placeholder="请选择或搜索业态"
          multiple
          filterable
          clearable
          style="width: 300px"
        >
          <el-option v-for="item in businessFormsList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="contractStatus" label="签约状态" label-width="70px" style="margin-right: 20px;">
        <el-select
          v-model="projectForm.contractStatus"
          tabindex="8"
          placeholder="请选择签约状态"
          clearable
          style="width: 150px"
        >
          <el-option v-for="item in contractStatusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="contractSum" label="合同金额" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="contractSum"
          v-model="projectForm.contractSum"
          placeholder="请输入合同金额"
          name="contractSum"
          type="text"
          tabindex="9"
          clearable
        />
      </el-form-item>
      <el-form-item prop="deepCulture" label="是否深耕" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="projectForm.deepCulture" tabindex="10" placeholder="请选择是否深耕" clearable style="width: 150px">
          <el-option v-for="item in deepCultureList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="服务状态" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="projectForm.status" tabindex="11" placeholder="请选择服务状态" clearable style="width: 150px">
          <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="entrustCompany" label="委托方公司" label-width="85px" style="margin-right: 20px;">
        <el-input
          ref="entrustCompany"
          v-model="projectForm.entrustCompany"
          placeholder="请输入委托方公司"
          name="entrustCompany"
          type="text"
          tabindex="12"
          clearable
        />
      </el-form-item>
      <el-form-item prop="signCompany" label="签订公司" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="projectForm.signCompany" tabindex="13" placeholder="请选择签订公司" clearable style="width: 300px">
          <el-option v-for="item in signCompanyList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="principalName" label="负责人" label-width="55px" style="margin-right: 20px;">
        <el-input
          ref="principalName"
          v-model="projectForm.principalName"
          placeholder="请输入负责人姓名"
          name="principalName"
          type="text"
          tabindex="14"
          clearable
        />
      </el-form-item>
      <el-form-item prop="deptId" label="所属部门" label-width="70px">
        <treeselect
          v-model="projectForm.deptId"
          class="user-treeselect"
          :options="deptsTree"
          :default-expand-level="Infinity"
          placeholder="请选择或搜索所属部门"
        />
      </el-form-item>
      <el-form-item label="地区" label-width="40px" style="margin-right: 20px;">
        <el-cascader
          style="width: 300px;"
          :options="regionOptions"
          filterable
          clearable
          placeholder="请选择或搜索地区"
          @change="handleSearchRegionChange"
        />
      </el-form-item>
      <el-form-item label="项目时间" label-width="70px">
        <el-date-picker
          v-model="dates"
          tabindex="15"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          clearable
          @change="changeDates"
        />
      </el-form-item>
      <el-button
        style="margin-left: 20px; margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click.native.prevent="handleProjects(1)"
      >搜索</el-button>
      <el-button
        style="margin-left: 20px; margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-export"
        @click.native.prevent="handleExportProjects"
      >导出</el-button>
    </el-form>

    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddProject">新增</el-button>
    <el-button
      :disabled="delProjectsBtnDisabled"
      type="danger"
      size="small"
      icon="el-icon-delete"
      @click="handleDelete(multipleSelection)"
    >删除</el-button>

    <el-table
      :data="projectList"
      style="width: 100%; margin-top:30px;"
      :header-cell-style="tableHeaderCellStyle"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="项目ID" width="70">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目名称" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="handleProjectDetails(scope.row)">{{ scope.row.projectInfo.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目性质" width="100">
        <template slot-scope="scope">
          {{ getProjectType(scope.row.projectInfo.type) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目来源" width="100">
        <template slot-scope="scope">
          {{ getProjectOrigin(scope.row.projectInfo.origin) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目阶段" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          {{ getProjectStep(scope.row.projectInfo.step) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上传状态" width="100">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.projectInfo.fileUploadStatus === 0"
            style="color: orangered;"
            type="text"
            @click="handleProjectDetails(scope.row)"
          >
            {{ getProjectFileUploadStatus(scope.row.projectInfo.fileUploadStatus) }}
          </el-button>
          <el-button
            v-else-if="scope.row.projectInfo.fileUploadStatus === 1"
            type="text"
            @click="handleProjectDetails(scope.row)"
          >
            {{ getProjectFileUploadStatus(scope.row.projectInfo.fileUploadStatus) }}
          </el-button>
          <span v-else>
            {{ getProjectFileUploadStatus(scope.row.projectInfo.fileUploadStatus) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务类型" width="100">
        <template slot-scope="scope">
          {{ getProjectBusinessType(scope.row.projectInfo.businessType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="业态" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          {{ getProjectBusinessForms(scope.row.businessforms) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="签约状态" width="100">
        <template slot-scope="scope">
          {{ getProjectContractStatus(scope.row.projectInfo.contractStatus) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="合同金额" width="100">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.contractSum + '万' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否深耕" width="100">
        <template slot-scope="scope">
          {{ getProjectDeepCulture(scope.row.projectInfo.deepCulture) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务状态" width="100">
        <template slot-scope="scope">
          {{ getProjectStatus(scope.row.projectInfo.status) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="委托方公司" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.entrustCompany }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="签订公司" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{ getProjectSignCompany(scope.row.projectInfo.signCompany) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人" width="100">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.principalName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属部门" width="160">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.deptName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="地区" width="160">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.region }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" width="100">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.startTime.split(' ')[0] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" width="100">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.endTime.split(' ')[0] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最近上传时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.fileUploadLastTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.createdAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.projectInfo.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete([scope.row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改项目' : '新增项目'"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form ref="project" :model="project" :rules="projectRules" label-width="80px" label-position="left">
        <el-form-item prop="name" label="项目名称" label-width="80px">
          <el-input v-model="project.name" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <div style="display: flex;">
          <el-form-item prop="type" label="项目性质" label-width="80px" style="margin-right: 30px;">
            <el-select v-model="project.type" placeholder="请选择项目性质" clearable style="width: 170px">
              <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="origin" label="项目来源" label-width="80px">
            <el-select v-model="project.origin" placeholder="请选择项目来源" clearable style="width: 170px">
              <el-option v-for="item in originList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item prop="businessType" label="业务类型" label-width="80px" style="margin-right: 30px;">
            <el-select v-model="project.businessType" placeholder="请选择业务类型" clearable style="width: 170px">
              <el-option v-for="item in businessTypeList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="deepCulture" label="是否深耕" label-width="80px">
            <el-select v-model="project.deepCulture" placeholder="请选择是否深耕" clearable style="width: 170px">
              <el-option v-for="item in deepCultureList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item prop="status" label="服务状态" label-width="80px" style="margin-right: 30px;">
            <el-select v-model="project.status" placeholder="请选择服务状态" clearable style="width: 170px">
              <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="principalUid" label="负责人" label-width="80px">
            <el-select
              v-model="project.principalUid"
              placeholder="请搜索负责人"
              clearable
              filterable
              remote
              :remote-method="principalRemoteMethod"
              :loading="principalLoading"
              style="width: 170px"
            >
              <el-option v-for="item in principalUserList" :key="item.id" :label="item.realname" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item prop="contractStatus" label="签约状态" label-width="80px" style="margin-right: 30px;">
            <el-select v-model="project.contractStatus" placeholder="请选择签约状态" clearable style="width: 170px">
              <el-option v-for="item in contractStatusList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="contractSum" label="合同金额" label-width="80px">
            <el-input v-model="project.contractSum" placeholder="单位：万元" clearable />
          </el-form-item>
        </div>
        <el-form-item prop="deptId" label="所属部门" label-width="80px">
          <treeselect
            v-model="project.deptId"
            style="width: 100%;"
            class="user-treeselect"
            :options="deptsTree"
            :default-expand-level="Infinity"
            placeholder="请选择或搜索所属部门"
          />
        </el-form-item>
        <el-form-item prop="businessForms" label="业态" label-width="80px">
          <el-select
            v-model="project.businessForms"
            placeholder="请选择或搜索业态"
            multiple
            filterable
            clearable
            style="width: 100%;"
            @change="handleChange"
          >
            <el-option v-for="item in businessFormsList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="entrustCompany" label="委托方公司" label-width="95px" style="margin-left: 10px;">
          <el-input v-model="project.entrustCompany" placeholder="请输入委托方公司" clearable />
        </el-form-item>
        <el-form-item prop="signCompany" label="签订公司" label-width="80px">
          <el-select v-model="project.signCompany" placeholder="请选择签订公司" clearable style="width: 300px">
            <el-option v-for="item in signCompanyList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="region" label="地区" label-width="80px">
          <el-cascader
            v-model="regionList"
            style="width: 300px;"
            :options="regionOptions"
            filterable
            clearable
            placeholder="请选择或搜索地区"
            @change="handleRegionChange"
          />
        </el-form-item>
        <el-form-item prop="startTime" label="开始时间" label-width="80px">
          <el-date-picker v-model="project.startTime" type="date" placeholder="请选择项目开始时间" />
        </el-form-item>
        <el-form-item prop="endTime" label="结束时间" label-width="80px">
          <el-date-picker v-model="project.endTime" type="date" placeholder="请选择项目结束时间" />
        </el-form-item>
        <el-form-item style="margin-left: 10px;" label="备注" prop="remark" label-width="70px">
          <el-input
            v-model="project.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>

    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="projectForm.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="projectForm.pageSize"
      :disabled="projectForm.total <= projectForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="projectForm.total"
      @size-change="handleSizeChange"
      @current-change="handleCurChange"
    />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  downloadByRes
} from '@/utils/download'
import {
  deepClone
} from '@/utils'
import {
  regionData,
  CodeToText,
  TextToCode
} from 'element-china-area-data'
import {
  formatDate
} from '@/utils/time'
import {
  getDeptTree
} from '@/api/dept'
import {
  searchByRealname
} from '@/api/user_manager'
import {
  getClientOptions,
  getProjectList,
  addProject,
  getProject,
  updateProject,
  deleteProject,
  getExportProject
} from '@/api/wdk_project'

const defaultProject = {
  name: '',
  type: '0',
  origin: '0',
  businessType: '0',
  businessForms: [],
  contractStatus: '0',
  contractSum: '',
  deepCulture: '0',
  status: '0',
  entrustCompany: '',
  signCompany: '0',
  principalUid: null,
  deptId: null,
  region: '',
  startTime: '',
  endTime: '',
  remark: ''
}
Object.freeze(defaultProject)
Object.freeze(defaultProject.businessForms)

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    Treeselect
  },
  // 属性
  props: {},
  // 数据
  data() {
    const validateBusinessForms = (rule, value, callback) => {
      if (this.project.businessForms && this.project.businessForms.length > 0) {
        callback()
      } else {
        return callback(new Error('业态不能为空'))
      }
    }
    // 这⾥存放数据
    return {
      dates: {
        type: Array,
        default: () => [] // es6的箭头函数
      },
      regionList: {
        type: Array,
        default: () => [] // es6的箭头函数
      },
      projectForm: {
        id: null,
        name: '',
        type: null,
        origin: null,
        step: null,
        fileUploadStatus: null,
        businessType: null,
        businessForms: [],
        contractStatus: null,
        contractSum: null,
        deepCulture: null,
        status: null,
        entrustCompany: '',
        signCompany: null,
        principalName: '',
        deptId: null,
        region: '',
        startTime: '',
        endTime: '',
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      typeList: [],
      originList: [],
      stepList: [],
      uploadStatusList: [],
      businessTypeList: [],
      businessFormsList: [],
      contractStatusList: [],
      deepCultureList: [],
      statusList: [],
      signCompanyList: [],
      projectFormRules: {
        principalName: [{
          pattern: '^[\u4e00-\u9fa5]{0,10}$',
          message: '负责人姓名必须为中文且长度不能超过10',
          trigger: 'blur'
        }],
        contractSum: [{
          pattern: '^\\d*\\.*\\d*$',
          message: '合同金额必须大于等于0',
          trigger: 'blur'
        }]
      },
      projectRules: {
        name: [{
          required: true,
          message: '项目名称不能为空',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '项目性质不能为空',
          trigger: 'blur'
        }],
        origin: [{
          required: true,
          message: '项目来源不能为空',
          trigger: 'blur'
        }],
        businessType: [{
          required: true,
          message: '业务类型不能为空',
          trigger: 'blur'
        }],
        businessForms: [{
          type: 'array',
          required: true,
          validator: validateBusinessForms
        }],
        contractStatus: [{
          required: true,
          message: '签约状态不能为空',
          trigger: 'blur'
        }],
        contractSum: [{
          required: true,
          pattern: '^(\\d+\\d*)(\\.\\d+)?$',
          message: '合同金额必须大于等于0',
          trigger: 'blur'
        }],
        deepCulture: [{
          required: true,
          message: '是否为深耕不能为空',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '服务状态不能为空',
          trigger: 'blur'
        }],
        entrustCompany: [{
          pattern: '^.{0,50}$',
          message: '委托方公司长度不能超过50',
          trigger: 'blur'
        }],
        signCompany: [{
          required: true,
          message: '我方签订公司不能为空',
          trigger: 'blur'
        }],
        principalUid: [{
          required: true,
          message: '负责人不能为空',
          trigger: 'blur'
        }],
        deptId: [{
          required: true,
          message: '所属部门不能为空',
          trigger: 'blur'
        }],
        region: [{
          required: true,
          message: '地区(省/市/区县)不能为空',
          trigger: 'blur'
        }],
        startTime: [{
          required: true,
          message: '项目开始时间不能为空',
          trigger: 'blur'
        }],
        endTime: [{
          required: true,
          message: '项目结束时间不能为空',
          trigger: 'blur'
        }]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      project: deepClone(defaultProject),
      deptsTree: [],
      projectList: [],
      multipleSelection: [],
      principalUserList: [],
      principalLoading: false,
      regionOptions: regionData,
      delProjectsBtnDisabled: true,
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  // 计算属性类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用
  beforeCreate() { },
  // 在实例创建完成后被立即同步调用（可以访问当前this实例）
  created() {
    if (this.$route.query.id) {
      this.projectForm.id = this.$route.query.id
    }
    this.handleClientOptions()
    this.getDeptTree()
    this.handleGetProjectList()
  },
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
    // 表头
    tableHeaderCellStyle() {
      return 'color: #606266; background: #F2F6FC;'
    },
    handleChange() {
      this.$forceUpdate()
    },
    // 获取项目管理客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.typeList = res.data.typeList
          this.originList = res.data.originList
          this.stepList = res.data.stepList
          this.uploadStatusList = res.data.uploadStatusList
          this.businessTypeList = res.data.businessTypeList
          this.businessFormsList = res.data.businessFormsList
          this.contractStatusList = res.data.contractStatusList
          this.deepCultureList = res.data.deepCultureList
          this.statusList = res.data.statusList
          this.signCompanyList = res.data.signCompanyList
        } else {
          this.typeList = []
          this.originList = []
          this.stepList = []
          this.uploadStatusList = []
          this.businessTypeList = []
          this.businessFormsList = []
          this.contractStatusList = []
          this.deepCultureList = []
          this.statusList = []
          this.signCompanyList = []
        }
      }).catch(() => { })
    },
    // 搜索地区
    handleSearchRegionChange(regions) {
      // 用CodeToText转换成中文
      if (regions && regions.length >= 3) {
        this.projectForm.region = CodeToText[regions[0]] + '/' +
          CodeToText[regions[1]] + '/' + CodeToText[regions[2]]
      } else {
        this.projectForm.region = ''
      }
    },
    // 地区
    handleRegionChange(regions) {
      if (regions && regions.length >= 3) {
        this.project.region = CodeToText[regions[0]] + '/' +
          CodeToText[regions[1]] + '/' + CodeToText[regions[2]]
      } else {
        this.project.region = ''
      }
    },
    // 通过姓名搜索用户
    principalRemoteMethod(query) {
      if (query !== '') {
        this.principalLoading = true
        setTimeout(() => {
          searchByRealname({
            realname: query
          }).then((res) => {
            this.principalLoading = false
            this.principalUserList = res.data.list
          }).catch(() => { })
        }, 200)
      } else {
        this.principalUserList = []
      }
    },
    // 修改时间
    changeDates(dates) {
      if (dates && dates.length >= 2) {
        this.projectForm.startTime = formatDate(dates[0])
        this.projectForm.endTime = formatDate(dates[1])
      } else {
        this.projectForm.startTime = ''
        this.projectForm.endTime = ''
      }
    },
    // 递归处理部门树节点
    getDeptTreeNode(deptList) {
      var list = []
      for (const item of deptList) {
        var treeNode = item.dept
        treeNode.label = item.dept.name
        if (item.children !== undefined && item.children !== null && item.children.length !== 0) {
          treeNode.children = this.getDeptTreeNode(item.children)
        }
        list.push(treeNode)
      }
      return list
    },
    // 获取部门树
    getDeptTree() {
      getDeptTree().then((res) => {
        this.deptsTree = this.getDeptTreeNode(res.data.list)
      }).catch(() => { })
    },
    // 获取项目性质名称
    getProjectType(type) {
      type += ''
      var index = this.typeList.findIndex(item => item.value === type)
      if (index !== -1) {
        return this.typeList[index].name
      }
      return ''
    },
    // 获取项目来源名称
    getProjectOrigin(origin) {
      origin += ''
      var index = this.originList.findIndex(item => item.value === origin)
      if (index !== -1) {
        return this.originList[index].name
      }
      return ''
    },
    // 获取项目阶段名称
    getProjectStep(step) {
      step += ''
      var index = this.stepList.findIndex(item => item.value === step)
      if (index !== -1) {
        return this.stepList[index].name
      }
      return ''
    },
    // 获取项目上传状态名称
    getProjectFileUploadStatus(fileUploadStatus) {
      fileUploadStatus += ''
      var index = this.uploadStatusList.findIndex(item => item.value === fileUploadStatus)
      if (index !== -1) {
        return this.uploadStatusList[index].name
      }
      return ''
    },
    // 获取项目业务类型名称
    getProjectBusinessType(businessType) {
      businessType += ''
      var index = this.businessTypeList.findIndex(item => item.value === businessType)
      if (index !== -1) {
        return this.businessTypeList[index].name
      }
      return ''
    },
    // 获取业态名称
    getProjectBusinessForms(businessforms) {
      var tmpList = []
      for (const i of businessforms) {
        i.businessForms += ''
        var index = this.businessFormsList.findIndex(item => item.value === i.businessForms)
        if (index !== -1) {
          tmpList.push(this.businessFormsList[index].name)
        }
      }
      return tmpList.join(', ')
    },
    // 获取签约状态名称
    getProjectContractStatus(contractStatus) {
      contractStatus += ''
      var index = this.contractStatusList.findIndex(item => item.value === contractStatus)
      if (index !== -1) {
        return this.contractStatusList[index].name
      }
      return ''
    },
    // 获取项目是否深耕名称
    getProjectDeepCulture(deepCulture) {
      deepCulture += ''
      var index = this.deepCultureList.findIndex(item => item.value === deepCulture)
      if (index !== -1) {
        return this.deepCultureList[index].name
      }
      return ''
    },
    // 获取项目服务状态名称
    getProjectStatus(status) {
      status += ''
      var index = this.statusList.findIndex(item => item.value === status)
      if (index !== -1) {
        return this.statusList[index].name
      }
      return ''
    },
    // 获取项目签订公司名称
    getProjectSignCompany(signCompany) {
      signCompany += ''
      var index = this.signCompanyList.findIndex(item => item.value === signCompany)
      if (index !== -1) {
        return this.signCompanyList[index].name
      }
      return ''
    },
    // 获取项目列表
    handleProjects(curPage) {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          this.handleGetProjectList(curPage)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 导出项目信息
    handleExportProjects() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          getExportProject(this.projectForm).then((res) => {
            downloadByRes(res)
          }).catch(() => { })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取项目列表
    handleGetProjectList(curPage) {
      var paramsData = deepClone(this.projectForm)
      if (curPage) {
        paramsData.curPage = curPage
      }
      getProjectList(paramsData).then((res) => {
        if (res.data.list) {
          this.projectList = res.data.list
        } else {
          this.projectList = []
        }
        this.projectForm.curPage = res.data.curPage
        this.projectForm.total = res.data.total
      })
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.projectForm.curPage = 1
      this.projectForm.pageSize = val
      this.handleProjects()
    },
    // 当前页更改
    handleCurChange(val) {
      this.projectForm.curPage = val
      this.handleProjects()
    },
    // 进入项目详情页
    handleProjectDetails(row) {
      this.$router.push({
        name: 'WdkProjectDocument',
        query: {
          id: row.projectInfo.id
        }
      })
    },
    // 添加
    handleAddProject() {
      this.project = deepClone(defaultProject)
      this.handleRegionChange(this.regionList)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 修改
    handleEdit(row) {
      this.project = deepClone(defaultProject)
      getProject({
        id: row.projectInfo.id
      }).then((res) => {
        this.project = res.data.info.projectInfo
        this.project.type += ''
        this.project.origin += ''
        this.project.businessType += ''
        this.project.contractStatus += ''
        this.project.deepCulture += ''
        this.project.status += ''
        this.project.signCompany += ''
        this.project.contractSum += ''
        var tmpBusinessForms = []
        for (const i of res.data.info.businessforms) {
          i.businessForms += ''
          tmpBusinessForms.push(i.businessForms)
        }
        this.project.businessForms = tmpBusinessForms
        this.project.startTime = new Date(this.project.startTime)
        this.project.endTime = new Date(this.project.endTime)
        const regions = this.project.region.split('/')
        this.regionList = [
          TextToCode[regions[0]].code,
          TextToCode[regions[0]][regions[1]].code,
          TextToCode[regions[0]][regions[1]][regions[2]].code
        ]
        this.principalUserList = [{
          id: this.project.principalUid,
          realname: this.project.principalName
        }]
      }).catch(() => { })

      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delProjectsBtnDisabled = false
      } else {
        this.delProjectsBtnDisabled = true
      }
    },
    // 删除
    handleDelete(rowList) {
      var idList = []
      var nameList = []
      for (const item of rowList) {
        idList.push(item.projectInfo.id)
        nameList.push(item.projectInfo.name)
      }
      var names = nameList.join('; ')
      this.$confirm('确认要"移除" "' + names + '" 项目吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteProject({
            ids: idList
          }).then(() => {
            for (const id of idList) {
              var index = this.projectList.findIndex(item => item.projectInfo.id === id)
              if (index !== -1) {
                this.projectList.splice(index, 1)
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => { })
        }).catch(() => { })
    },
    // 添加/修改 确认
    async confirmUser() {
      this.$refs.project.validate(valid => {
        if (valid) {
          this.AddOrEditProject()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加/修改
    async AddOrEditProject() {
      const isEdit = this.dialogType === 'edit'
      this.project.startTime = formatDate(this.project.startTime)
      this.project.endTime = formatDate(this.project.endTime)

      if (isEdit) {
        await updateProject(this.project).then(() => {
          this.dialogVisible = false
          this.handleGetProjectList()
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>项目名称: ${this.project.name}</div>
                <div>备注: ${this.project.remark || '无内容'}</div>
              `,
            type: 'success'
          })
        }).catch(() => {
          this.dialogVisible = false
        })
      } else {
        await addProject(this.project).then(() => {
          this.dialogVisible = false
          this.handleGetProjectList(1)
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>项目名称: ${this.project.name}</div>
                <div>备注: ${this.project.remark || '无内容'}</div>
              `,
            type: 'success'
          })
        }).catch(() => {
          this.dialogVisible = false
        })
      }
    }
  }
}
</script>

<style lang="scss">
.el-icon-export {
  background: url('../../assets/images/custom_icon_images/export.png') center no-repeat;
  background-size: cover;
}

.el-icon-export:before {
  content: "替";
  visibility: hidden;
}
</style>
<style lang='scss' scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}

// 调整treeselect高度和横向滚动条
.user-treeselect {
  width: 340px;
  display: flex;
  margin-right: 20px;
}

::v-deep {
  .vue-treeselect__menu {
    overflow-x: auto !important;
    max-height: 280px !important;
  }

  .vue-treeselect__label {
    overflow: unset;
    text-overflow: unset;
  }

  .vue-treeselect__control {
    height: 20px !important;
  }

  .vue-treeselect__multi-value-item-container,
  .vue-treeselect--has-value .vue-treeselect__multi-value {
    height: 30px;
    line-height: 24px;
    padding: 0;
  }

  .vue-treeselect__limit-tip,
  .vue-treeselect--searchable.vue-treeselect--multi.vue-treeselect--has-value .vue-treeselect__input-container {
    padding-top: 0;
  }

  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    height: 28px;
    line-height: 32px;
    font-size: small;
    color: "#CCCFD6";
  }

  .vue-treeselect--has-value .vue-treeselect__input {
    height: 18px !important;
    line-height: 18px !important;
  }

  .vue-treeselect div,
  .vue-treeselect span {
    box-sizing: content-box;
  }

  // 选中后的溢出隐藏
  .vue-treeselect__multi-value-label {
    display: block;
    width: 140px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .vue-treeselect__value-container {
    display: block;
    height: 32px;
  }
}
</style>
