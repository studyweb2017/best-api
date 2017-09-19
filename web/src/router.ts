import Vue from 'vue'
import Router from 'vue-router'
import index from './components/index'
import project from './components/project/index'
import proAdd from './components/project/proAdd'
import proList from './components/project/proList'
import proApiList from './components/project/proApiList'
import proApiDetail from './components/project/proApiDetail'
import proApiView from './components/project/proApiView'
import test from './components/test'
import people from './components/people/index'
import doc from './components/doc'
import set from './components/set'
import user from './components/user/user'
import login from './components/user/login'

Vue.use(Router)

export default new Router({
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
          component: proList
        },
        {
          path: 'add',
          name: 'proAdd',
          component: proAdd
        },
        {
          path: ':proId/edit',
          name: 'proEdit',
          component: proAdd
        },
        {
          path: ':proId/api',
          name: 'proApiList',
          component: proApiList,
          children: [
            {
              path: 'edit/:apiId',
              name: 'proApiDetail',
              component: proApiDetail
            },
            {
              path: 'view/:apiId',
              name: 'proApiView',
              component: proApiView
            },
            {
              path: 'add',
              name: 'proApiAdd',
              component: proApiDetail
            }
          ]
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/people',
      name: 'people',
      component: people
    },
    {
      path: '/doc',
      name: 'doc',
      component: doc
    },
    {
      path: '/set',
      name: 'set',
      component: set
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      children: [
        {
          path: '/user/login',
          name: 'login',
          component: login
        }
      ]
    }
  ]
})