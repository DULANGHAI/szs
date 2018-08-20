import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import Empty from '../views/layout/Empty'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/pe/dashboard/index'
  },
  // 运维作业部分
  {
    path: '/pe',
    component: Empty,
    name: '运维作业',
    meta: { title: '运维作业' },
    module: true,
    children: [
      // 0. DashBoard
      {
        path: 'dashboard',
        name: 'pe-dashboard',
        component: Layout,
        meta: { title: 'Dashboard', icon: 'dashboard' },
        noNest: true,
        children: [
          {
            path: 'index',
            // name: 'pe-dashboard',
            component: () => import('@/views/pe/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'dashboard' }
          }
        ]
      },
      // 1.任务管理
      {
        path: 'taskManage',
        component: Layout,
        name: '任务管理',
        meta: { title: '任务管理', icon: 'task-sidebar' },
        children: [
          {
            path: 'taskList',
            name: '任务列表',
            component: () => import('@/views/pe/task/taskList/index'),
            meta: { title: '任务列表' }
          },
          {
            path: 'taskAdd',
            name: '添加任务',
            component: () => import('@/views/pe/task/taskList/taskAdd'),
            meta: { title: '添加任务' },
            hidden: true
          },
          {
            path: 'taskEdit/:id',
            name: '编辑任务',
            component: () => import('@/views/pe/task/taskList/taskAdd'),
            meta: { title: '编辑任务' },
            hidden: true,
            props: true
          },
          {
            path: 'taskView/:id/:view',
            name: '查看任务',
            component: () => import('@/views/pe/task/taskList/taskAdd'),
            meta: { title: '查看任务' },
            hidden: true,
            props: true
          },
          {
            path: 'taskApprove',
            name: '任务审批',
            component: () => import('@/views/pe/task/taskApprove/index'),
            meta: { title: '任务审批' }
          },
          {
            path: 'approveTask/:id',
            name: '审批任务',
            component: () => import('@/views/pe/task/taskApprove/approve'),
            meta: { title: '审批任务' },
            hidden: true,
            props: true
          },
          {
            path: 'approveView/:id/:view',
            name: '审批查看',
            component: () => import('@/views/pe/task/taskApprove/approve'),
            meta: { title: '审批查看' },
            hidden: true,
            props: true
          }
        ]
      },
      // 2.作业管理
      {
        path: 'jobManage',
        component: Layout,
        name: '作业管理',
        meta: { title: '作业管理', icon: 'job-sidebar' },
        children: [
          {
            path: 'jobList',
            name: '作业列表',
            component: () => import('@/views/pe/job/jobList/index'),
            meta: { title: '作业列表' }
          },
          {
            path: 'jobAdd',
            name: '添加作业',
            component: () => import('@/views/pe/job/jobList/jobAdd'),
            meta: { title: '添加作业' },
            hidden: true
          },
          {
            path: 'jobEdit/:id',
            name: '编辑作业',
            component: () => import('@/views/pe/job/jobList/jobAdd'),
            meta: { title: '编辑作业' },
            hidden: true,
            props: true
          },
          {
            path: 'jobView/:id/:view',
            name: '查看作业',
            component: () => import('@/views/pe/job/jobList/jobAdd'),
            meta: { title: '查看作业' },
            hidden: true,
            props: true
          },
          {
            path: 'timedJob',
            name: '定时作业',
            component: () => import('@/views/pe/job/timedJob/index'),
            meta: { title: '定时作业' }
          },
          {
            path: 'instantJob',
            name: '即时作业',
            component: () => import('@/views/pe/job/instantJob/index'),
            meta: { title: '即时作业' }
          },
          {
            path: 'jobRecord/:id',
            name: '作业记录',
            component: () => import('@/views/pe/job/jobRecord/index'),
            meta: { title: '作业记录' },
            props: true
          },
          {
            path: 'recordDetail/:id',
            name: '执行详情',
            component: () => import('@/views/pe/job/jobRecord/detail'),
            meta: { title: '执行详情' },
            hidden: true,
            props: true
          }
        ]
      },
      // 3.流程管理
      {
        path: 'flowManage',
        component: Layout,
        name: '流程管理',
        meta: { title: '流程管理', icon: 'flow-sidebar' },
        children: [
          {
            path: 'flowList',
            name: '流程列表',
            component: () => import('@/views/pe/flow/flowList/index'),
            meta: { title: '流程列表' }
          },
          {
            path: 'flowAdd',
            name: '新建流程',
            component: () => import('@/views/pe/flow/flowList/addFlow'),
            meta: { title: '新建流程' },
            hidden: true
          },
          {
            path: 'flowEdit/:id',
            name: '编辑流程',
            component: () => import('@/views/pe/flow/flowList/addFlow'),
            meta: { title: '编辑流程' },
            hidden: true,
            props: true
          },
          {
            path: 'flowView/:id/:view',
            name: '查看流程',
            component: () => import('@/views/pe/flow/flowList/addFlow'),
            meta: { title: '查看流程' },
            hidden: true,
            props: true
          },
          {
            path: 'instantFlow',
            name: '即时流程',
            component: () => import('@/views/pe/flow/instantFlow/index'),
            meta: { title: '即时流程' }
          },
          {
            path: 'timedFlow',
            name: '定时流程',
            component: () => import('@/views/pe/flow/timedFlow/index'),
            meta: { title: '定时流程' }
          }
        ]
      },
      // 4.文件管理
      {
        path: 'fileManage',
        component: Layout,
        name: '文件管理',
        meta: { title: '文件管理', icon: 'folder-sidebar' },
        children: [
          {
            path: 'fileDispense',
            name: '文件分发',
            component: () => import('@/views/pe/fileManage/fileDispense/index'),
            meta: { title: '文件分发' }
          },
          {
            path: 'fileDownload',
            name: '文件下载',
            component: () => import('@/views/pe/fileManage/fileDownload/index'),
            meta: { title: '文件下载' }
          },
          {
            path: 'multipleFileDownload',
            name: '批量文件下载',
            component: () => import('@/views/pe/fileManage/multipleFileDownload/index'),
            meta: { title: '批量文件下载' }
          }
        ]
      },
      // 5.即时命令
      {
        path: 'command',
        component: Layout,
        name: '即时命令',
        meta: { title: '即时命令', icon: 'form' },
        noNest: true,
        children: [
          {
            path: 'index',
            // name: '即时命令',
            component: () => import('@/views/pe/command/index'),
            meta: { title: '即时命令', icon: 'command' }
          }
        ]
      },
      // 6.日常检查
      {
        path: 'daily',
        component: Layout,
        name: '日常检查',
        meta: { title: '日常检查', icon: 'daily' },
        children: [
          {
            path: 'index',
            name: '检查结果',
            component: () => import('@/views/pe/daily/index'),
            meta: { title: '检查结果' }
          },
          {
            path: 'detail/:id',
            name: '检查详情',
            component: () => import('@/views/pe/daily/detail'),
            meta: { title: '检查详情' },
            props: true
          }
        ]
      },
      // 7.运维审批
      {
        path: 'peApprove',
        component: Layout,
        name: '运维审批',
        meta: { title: '运维审批', icon: 'form' },
        noNest: true,
        children: [
          {
            path: 'index',
            // name: '审批列表',
            component: () => import('@/views/pe/peApprove/index'),
            meta: { title: '运维审批', icon: 'peApprove' }
          }
        ]
      }
    ]
  },
  // 资源管理 resouce
  {
    path: '/resouce',
    component: Empty,
    name: '资源管理',
    meta: { title: '资源管理' },
    module: true,
    children: [
      // 0. DashBoard
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Layout,
        meta: { title: 'Dashboard', icon: 'dashboard' },
        noNest: true,
        children: [
          {
            path: 'index',
            // name: 'dashboard',
            component: () => import('@/views/resouce/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'dashboard' }
          }
        ]
      },
      // 1.资源管理
      {
        path: 'resouces',
        component: Layout,
        name: 'Resouces',
        meta: { title: '资源管理', icon: 'resouces' },
        children: [
          {
            path: 'host',
            name: 'host',
            component: () => import('@/views/resouce/resouces/index'),
            meta: { title: '主机组管理' }
          }
        ]
      },
      // 2.应用管理
      {
        path: 'applications',
        component: Layout,
        name: 'Applications',
        meta: { title: '应用管理', icon: 'applications' },
        children: [
          {
            path: 'applist',
            name: 'applist',
            component: () => import('@/views/resouce/applications/index'),
            meta: { title: '应用列表' }
          },
          {
            path: 'applist/add',
            name: 'addApp',
            component: () => import('@/views/resouce/applications/addApp'),
            meta: { title: '添加应用' },
            hidden: true,
            props: true
          }
        ]
      },
      // 3.版本库
      {
        path: 'repository',
        component: Layout,
        name: 'Repository',
        meta: { title: '版本库', icon: 'banben' },
        children: [
          {
            path: 'risk',
            name: 'risk',
            component: () => import('@/views/resouce/risk/index'),
            meta: { title: '风险命令库' }
          },
          {
            path: 'whitelist',
            name: 'whitelist',
            component: () => import('@/views/resouce/whitelist/index'),
            meta: { title: '命令白名单' }
          },
          {
            path: 'software',
            name: 'softwareLibrary',
            component: () => import('@/views/resouce/softwareLibrary/index'),
            meta: { title: '软件包库' }
          },
          {
            path: 'script',
            name: 'scriptLibrary',
            component: () => import('@/views/resouce/scriptLibrary/index'),
            meta: { title: '脚本库' }
          },
          // {
          //   path: 'script/file',
          //   name: 'fileList',
          //   hidden: true,
          //   component: () => import('@/views/resouce/scriptLibrary/filelist'),
          //   meta: { title: '脚本库' }
          // },
          {
            path: 'config',
            name: 'configFileLibrary',
            component: () => import('@/views/resouce/configFileLibrary/index'),
            meta: { title: '配置文件库' }
          },
          {
            path: 'review',
            name: 'review',
            component: () => import('@/views/resouce/review/index'),
            meta: { title: '文件审批' }
          },
          {
            path: 'review/detail/:id',
            name: 'reviewDetail',
            component: () => import('@/views/resouce/review/detail'),
            meta: { title: '文件审批' },
            hidden: true,
            props: true
          }
        ]
      }
    ]
  },
  // 系统管理 system
  {
    path: '/system',
    component: Empty,
    name: '系统管理',
    meta: { title: '系统管理' },
    module: true,
    redirect: '/system/user',
    children: [
      //    1.用户管理
      {
        path: 'dashboard',
        name: '用户管理',
        component: Layout,
        meta: { title: '用户管理', icon: 'dashboard' },
        noNest: true,
        children: [
          {
            path: 'changepassword',
            component: () => import('@/views/system/changepassword'),
            name: 'changepassword',
            meta: { title: '修改密码', icon: 'banben' }
          },
          {
            path: 'user',
            component: () => import('@/views/system/user'),
            name: 'user',
            meta: { title: '用户管理', icon: 'banben' }
          },
          {
            path: 'personalInfo',
            component: () => import('@/views/system/personalInfo'),
            name: 'personalInfo',
            meta: { title: '个人信息', icon: 'banben' }
          }
        ]
      },
      //    2.角色管理
      {
        path: 'dashboard',
        name: '角色管理',
        component: Layout,
        meta: { title: '角色管理', icon: 'dashboard' },
        noNest: true,
        children: [
          {
            path: 'role',
            component: () => import('@/views/system/role'),
            name: 'Role',
            meta: { title: '角色管理', icon: 'banben' }
          },
          {
            path: 'role/list',
            component: () => import('@/views/system/role/list'),
            name: 'RoleList',
            meta: { title: '权限浏览', icon: 'banben' }
          }
        ]
      },
      //    3.审计与通知
      {
        path: 'dashboard',
        name: '审计与通知',
        component: Layout,
        meta: { title: '审计与通知', icon: 'dashboard' },
        noNest: true,
        children: [
          {
            path: 'info',
            component: () => import('@/views/system/info'),
            name: 'info',
            meta: { title: '消息', icon: 'banben' }
          },
          {
            path: 'audit',
            component: () => import('@/views/system/audit'),
            name: 'audit',
            meta: { title: '系统审计', icon: 'banben' }
          }
        ]
      },
      //    4.系统配置
      {
        path: 'dashboard',
        name: '系统配置',
        component: Layout,
        meta: { title: '系统配置', icon: 'dashboard' },
        noNest: true,
        children: [
          {
            path: 'setting',
            component: () => import('@/views/system/config'),
            name: 'setting',
            meta: { title: '系统配置', icon: 'banben' }
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

