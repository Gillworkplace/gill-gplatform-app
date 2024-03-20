export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/home',
    name: '欢迎',
    icon: 'smile',
    access: 'home',
    component: './Home',
  },
  {
    path: '/voice-chat',
    name: '语音聊天',
    icon: 'AudioOutlined',
    access: 'chat',
    component: './VoiceChat',
  },
  {
    path: '/register',
    name: '用户注册',
    icon: 'UserAddOutlined',
    access: 'register',
    component: './Register',
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'admin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/home' },
  { path: '/403', layout: false, component: './403' },
  { path: '*', layout: false, component: './404' },
];
