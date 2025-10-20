// 测试登录功能的脚本
const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

async function testLogin() {
  console.log('🧪 开始测试登录功能...\n');
  
  // 测试1: 健康检查
  try {
    console.log('1. 测试后端健康检查...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ 后端服务器运行正常:', healthResponse.data);
  } catch (error) {
    console.log('❌ 后端服务器未运行，请先启动后端服务器');
    console.log('   运行命令: cd backend && npm install && npm start');
    return;
  }
  
  // 测试2: 正确凭据登录
  try {
    console.log('\n2. 测试正确凭据登录...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: 'alice',
      password: 'password'
    });
    console.log('✅ 登录成功:', {
      success: loginResponse.data.success,
      token: loginResponse.data.token ? '已生成' : '未生成',
      user: loginResponse.data.user
    });
  } catch (error) {
    console.log('❌ 登录失败:', error.response?.data || error.message);
  }
  
  // 测试3: 错误凭据登录
  try {
    console.log('\n3. 测试错误凭据登录...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: 'alice',
      password: 'wrongpassword'
    });
    console.log('❌ 应该失败但成功了:', loginResponse.data);
  } catch (error) {
    console.log('✅ 正确拒绝了错误凭据:', error.response?.data?.message || error.message);
  }
  
  console.log('\n🎉 测试完成！');
}

testLogin().catch(console.error);