import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () => import('@/views/login/auth-redirect'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/error-page/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/error-page/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    name: 'Dashboard',
    meta: {
      title: '首页',
      icon: 'dashboard',
      affix: true
    }
  }]
},
{
  path: '/profile',
  component: Layout,
  redirect: '/profile/index',
  hidden: true,
  children: [{
    path: 'index',
    component: () => import('@/views/profile/index'),
    name: 'Profile',
    meta: {
      title: '个人中心',
      icon: 'user',
      noCache: true
    }
  }]
},
{
  path: '/wdk/project_document',
  component: Layout,
  redirect: '/wdk/project_document/index',
  hidden: true,
  children: [{
    path: 'index',
    component: () => import('@/views/wdk/project_document/index'),
    name: 'WdkProjectDocument',
    meta: {
      title: '项目文档'
    }
  }]
},
{
  path: '/wdk/report_audit_page',
  component: Layout,
  redirect: '/wdk/report_audit_page/index',
  hidden: true,
  children: [{
    path: 'index',
    component: () => import('@/views/wdk/report_audit_page/index'),
    name: 'WdkReportAuditPage',
    meta: {
      title: '文档库报告审核页'
    }
  }]
},
{
  path: '/wdk/report_page',
  component: Layout,
  redirect: '/wdk/report_page/index',
  hidden: true,
  children: [{
    path: 'index',
    component: () => import('@/views/wdk/report_page/index'),
    name: 'WdkReportPage',
    meta: {
      title: '文档库报告查看'
    }
  }]
},
{
  path: '/wdk/document_page',
  component: Layout,
  redirect: '/wdk/document_page/index',
  hidden: true,
  children: [{
    path: 'index',
    component: () => import('@/views/wdk/document_page/index'),
    name: 'WdkDocumentPage',
    meta: {
      title: '文档库文档查看'
    }
  }]
}
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/auth',
  component: Layout,
  redirect: '',
  alwaysShow: true, // will always show the root menu
  name: 'Auth',
  meta: {
    title: '权限管理',
    icon: 'lock',
    menu: 'auth'
  },
  children: [{
    path: 'role',
    component: () => import('@/views/auth/role'),
    name: 'AuthRole',
    meta: {
      title: '角色管理',
      icon: 'role',
      menu: 'auth/role/list'
    }
  },
  {
    path: 'dept',
    component: () => import('@/views/auth/dept'),
    name: 'AuthDept',
    meta: {
      title: '部门管理',
      icon: 'dept',
      menu: 'auth/dept/list'
    }
  },
  {
    path: 'user',
    component: () => import('@/views/auth/user'),
    name: 'AuthUser',
    meta: {
      title: '用户管理',
      icon: 'user',
      menu: 'auth/user/list'
    }
  }
  ]
},
{
  path: '/monitor',
  component: Layout,
  redirect: '',
  alwaysShow: true, // will always show the root menu
  name: 'Monitor',
  meta: {
    title: '系统监控',
    icon: 'monitor',
    menu: 'monitor'
  },
  children: [{
    path: 'user_online',
    component: () => import('@/views/monitor/user_online'),
    name: 'MonitorUserOnline',
    meta: {
      title: '在线用户',
      icon: 'cascader',
      menu: 'monitor/userOnline/list'
    }
  },
  {
    path: 'login_log',
    component: () => import('@/views/monitor/login_log'),
    name: 'MonitorLoginLog',
    meta: {
      title: '登录日志',
      icon: 'chart',
      menu: 'monitor/loginLog/list'
    }
  },
  {
    path: 'oper_log',
    component: () => import('@/views/monitor/oper_log'),
    name: 'MonitorOperLog',
    meta: {
      title: '操作日志',
      icon: 'operLog',
      menu: 'monitor/operLog/list'
    }
  },
  {
    path: 'crontab',
    component: () => import('@/views/monitor/crontab'),
    name: 'MonitorCrontab',
    meta: {
      title: '定时任务',
      icon: 'crontab',
      menu: 'monitor/crontab/list'
    }
  },
  {
    path: 'server_monitor',
    component: () => import('@/views/monitor/server_monitor'),
    name: 'MonitorServerMonitor',
    meta: {
      title: '服务监控',
      icon: 'server_monitor',
      menu: 'monitor/server_monitor/info'
    }
  }
  ]
},
{
  path: '/wdk',
  component: Layout,
  redirect: '',
  alwaysShow: true, // will always show the root menu
  name: 'Wdk',
  meta: {
    title: '文档库',
    icon: 'wdk',
    menu: 'wdk'
  },
  children: [{
    path: 'project',
    component: () => import('@/views/wdk/project'),
    name: 'WdkProject',
    meta: {
      title: '项目管理',
      icon: 'project',
      menu: 'wdk/project/list'

    }
  },
  {
    path: 'report_type_cfg',
    component: () => import('@/views/wdk/report_type_cfg'),
    name: 'WdkReportTypeCfg',
    meta: {
      title: '报告类型配置',
      icon: 'report',
      menu: 'wdk/reportTypeCfg/list'
    }
  },
  {
    path: 'report_audit',
    component: () => import('@/views/wdk/report_audit'),
    name: 'WdkReportAudit',
    meta: {
      title: '审核记录',
      icon: 'audit',
      menu: 'wdk/reportAudit/list'
    }
  },
  {
    path: 'report_upload_audit',
    component: () => import('@/views/wdk/report_upload_audit'),
    name: 'WdkReportUploadAudit',
    meta: {
      title: '上传审核记录',
      icon: 'beaudit',
      menu: 'wdk/reportAudit/uploadAuditList'
    }
  },
  {
    path: 'report',
    component: () => import('@/views/wdk/report'),
    name: 'WdkReport',
    meta: {
      title: '报告管理',
      icon: 'report_manager',
      menu: 'wdk/report/list'
    }
  }
  ]
},
{
  path: '/greendisk',
  component: Layout,
  redirect: '',
  name: 'GreenDisk',
  meta: {
    menu: 'greendisk'
  },
  children: [{
    path: '/manager',
    component: () => import('@/views/greendisk/index'),
    name: 'GreenDiskManager',
    meta: {
      title: '绿盘',
      icon: 'network_disk',
      menu: 'greendisk/manager/fileList'
    }
  }]
},
// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
