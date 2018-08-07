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
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  // 运维作业部分
  {
    path: '/pe',
    component: Empty,
    name: '运维作业',
    meta: { title: '运维作业' },
    module: true,
    children: [
      // 1.任务管理
      {
        path: 'taskManage',
        component: Layout,
        name: '任务管理',
        meta: { title: '任务管理', icon: 'form' },
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
        meta: { title: '作业管理', icon: 'form' },
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
            path: 'jobRecord',
            name: '作业记录',
            component: () => import('@/views/pe/job/jobRecord/index'),
            meta: { title: '作业记录' }
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
      // 1.资源管理
      {
        path: 'resouces',
        component: Layout,
        name: 'Resouces',
        meta: { title: '资源管理', icon: 'banben' },
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
        meta: { title: '应用管理', icon: 'banben' },
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
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

