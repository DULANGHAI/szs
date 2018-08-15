import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

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

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  // 运维作业部分
  // 1.任务管理
  {
    path: '/taskManage',
    component: Layout,
    name: '任务管理',
    meta: { title: '任务管理', icon: 'form' },
    children: [
      {
        path: 'taskList',
        name: '任务列表',
        component: () => import('@/views/taskList/index'),
        meta: { title: '任务列表' }
      },
      {
        path: 'taskAdd',
        name: '添加任务',
        component: () => import('@/views/taskList/taskAdd'),
        meta: { title: '添加任务' },
        hidden: true
      },
      {
        path: 'taskEdit/:id',
        name: '编辑任务',
        component: () => import('@/views/taskList/taskAdd'),
        meta: { title: '编辑任务' },
        hidden: true,
        props: true
      },
      {
        path: 'taskView/:id/:view',
        name: '查看任务',
        component: () => import('@/views/taskList/taskAdd'),
        meta: { title: '查看任务' },
        hidden: true,
        props: true
      },
      {
        path: 'taskApprove',
        name: '任务审批',
        component: () => import('@/views/taskApprove/index'),
        meta: { title: '任务审批' }
      },
      {
        path: 'approveTask/:id',
        name: '审批任务',
        component: () => import('@/views/taskApprove/approve'),
        meta: { title: '审批任务' },
        hidden: true,
        props: true
      },
      {
        path: 'approveView/:id/:view',
        name: '审批查看',
        component: () => import('@/views/taskApprove/approve'),
        meta: { title: '审批查看' },
        hidden: true,
        props: true
      }
    ]
  },
  // 2.作业管理
  {
    path: '/jobManage',
    component: Layout,
    name: '作业管理',
    meta: { title: '作业管理', icon: 'form' },
    children: [
      {
        path: 'jobList',
        name: '作业列表',
        component: () => import('@/views/jobList/index'),
        meta: { title: '作业列表' }
      }
    ]
  },

  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/example1',
    name: 'Resource',
    meta: { title: '资源管理', icon: 'ziyuan' },
    children: [
      {
        path: 'example1',
        name: 'Example1',
        component: () => import('@/views/example1/index'),
        meta: { title: 'Example1' }
      },
      {
        path: 'example2',
        name: 'Example2',
        component: () => import('@/views/example2/index'),
        meta: { title: 'Example2' }
      },
      {
        path: 'example3',
        name: 'Example3',
        component: () => import('@/views/example3/index'),
        meta: { title: 'Example3' }
      }
    ]
  },

  {
    path: '/apply',
    component: Layout,
    redirect: '/apply/example2',
    name: 'Apply',
    meta: { title: '应用管理', icon: 'yingyong' },
    children: [
      {
        path: 'example1',
        name: 'Example1',
        component: () => import('@/views/example1/index'),
        meta: { title: 'Example1' }
      },
      {
        path: 'example2',
        name: 'Example2',
        component: () => import('@/views/example2/index'),
        meta: { title: 'Example2' }
      },
      {
        path: 'example3',
        name: 'Example3',
        component: () => import('@/views/example3/index'),
        meta: { title: 'Example3' }
      }
    ]
  },
  // 版本库
  {
    path: '/repository',
    component: Layout,
    name: 'Repository',
    meta: { title: '版本库', icon: 'banben' },
    children: [
      {
        path: 'example1',
        name: '风险命令库',
        component: () => import('@/views/scriptLibrary/index'),
        meta: { title: '风险命令库' }
      },
      {
        path: 'whitelist',
        name: 'whitelist',
        component: () => import('@/views/whitelist/index'),
        meta: { title: '命令白名单' }
      },
      {
        path: 'software',
        name: 'softwareLibrary',
        component: () => import('@/views/softwareLibrary/index'),
        meta: { title: '软件包库' }
      },
      {
        path: 'script',
        name: 'scriptLibrary',
        component: () => import('@/views/scriptLibrary/index'),
        meta: { title: '脚本库' }
      },
      {
        path: 'script/file',
        name: 'fileList',
        hidden: true,
        component: () => import('@/views/scriptLibrary/filelist'),
        meta: { title: '脚本库' }
      },
      {
        path: 'example2',
        name: '配置文件库',
        component: () => import('@/views/example2/index'),
        meta: { title: '配置文件库' }
      },
      {
        path: 'examine',
        name: 'examine',
        component: () => import('@/views/examine/index'),
        meta: { title: '文件审批' }
      }
    ]
  },
  {
    path: '/repository/examine/detail',
    name: 'examineDetail',
    component: Layout,
    hidden: true,
    children: [{
      path: '/repository/examine/detail/:id',
      name: 'examineDetail',
      component: () => import('@/views/examine/detail')
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

