import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index'
import project from '../components/project/index'
import proAdd from '../components/project/proAdd'
import proList from '../components/project/proList'
import apiList from '../components/project/apiList'
import apiView from '../components/project/apiView'
import apiEdit from '../components/project/apiEdit'
import apiHistory from '../components/project/apiHistory'
import test from '../components/test'
import message from '../components/message'
import member from '../components/member'
import doc from '../components/doc'
import set from '../components/set'
import userSet from '../components/user/set'
import login from '../components/user/login'

Vue.use(Router)

const router:any = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/project',
      name: 'project',
      component: project,
      children: [
        {
          path: 'list',
          name: 'proList',
          component: proList,
          meta: {
            requireLogin: true
          }
        },
        {
          path: 'add',
          name: 'proAdd',
          component: proAdd,
          meta: {
            requireLogin: true
          }
        },
        {
          path: ':proId/edit',
          name: 'proEdit',
          component: proAdd,
          meta: {
            requireLogin: true
          }
        },
        {
          path: ':proId/api',
          name: 'proApiList',
          component: apiList,
          children: [
            {
              path: 'add',
              name: 'apiAdd',
              component: apiEdit,
              meta: {
                requireLogin: true
              }
            },
            {
              path: ':apiId/detail',
              name: 'apiView',
              component: apiView,
              meta: {
                requireLogin: true
              },
            },
            {
              path: ':apiId/edit',
              name: 'apiEdit',
              component: apiEdit,
              meta: {
                requireLogin: true
              }
            },
            {
              path: ':apiId/history',
              name: 'apiHistory',
              component: apiHistory,
              meta: {
                requireLogin: true
              }
            }
          ]
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: test,
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/message',
      name: 'message',
      component: message,
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/member',
      name: 'member',
      component: member,
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/doc',
      name: 'doc',
      component: doc
    },
    {
      path: '/set',
      name: 'set',
      component: set,
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/user/set',
      name: 'userSet',
      component: userSet,
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/user/login',
      name: 'login',
      component: login
    }
  ]
})

router.beforeEach((to:any, from:any, next:any) => {
  if (to.matched.some((res:any) => res.meta.requireLogin)) {
    if (localStorage.getItem('token')) {
      next()
    } else {
      next('/user/login')
    }
  } else {
    next()
  }
})
export default router
