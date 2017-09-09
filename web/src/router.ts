import Vue from 'vue'
import Router from 'vue-router'
import index from './components/index'
import project from './components/project/index'
import proAdd from './components/project/proAdd'
// import proEdit from './components/project/proEdit'
import proList from './components/project/proList'
import proApi from './components/project/proApi'
import test from './components/test'
import people from './components/people/index'
import doc from './components/doc'
import set from './components/set'
import user from './components/user/user'
import login from './components/user/login'


Vue.use(Router)

export default new Router({
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
          path: ':id/edit',
          name: 'proEdit',
          component: proAdd
        },
        {
          path: ':id/api',
          name: 'proApi',
          component: proApi
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
