export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/home', name: '欢迎', icon: 'smile', component: './Home' },
  { path: '/voice-chat', name: '语音聊天', icon: 'AudioOutlined', component: './VoiceChat' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/home' },
  { path: '/403', layout: false, component: './403' },
  { path: '*', layout: false, component: './404' },
];
