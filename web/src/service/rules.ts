export default {
  name: [
    {required: true, message: '请输入项目名称', trigger: 'blur'}
  ],
  testUrl: [
    {required: false, message: '请输入测试地址', trigger: 'blur'},
    {message: '测试地址不合法', pattern: /^((?:(?:25[0-5]|2[0-4]\d|(?:1\d{2}|[1-9]?\d))\.){3}(?:25[0-5]|2[0-4]\d|(?:1\d{2}|[1-9]?\d)))$/, trigger: 'blur'}
  ]
}
