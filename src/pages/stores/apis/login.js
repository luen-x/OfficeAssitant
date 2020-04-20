const api = {
	// 是否显示短信验证码
	_LOGIN_SHOW_CODE_GET: '/_auth/auth/login/first-login.json',
	// 发送短信验证码
	_LOGIN_SEND_CODE_GET: '/_public/api/sms/send.json',
	LOGIN_MAIN_POST: '/_auth/auth/login/login.json',
	_LOGIN_MAIN_VERIFICATION_GET: '/_auth/auth/login/captcha.json',
	_LOGIN_OUT_POST: '/_auth/auth/role/logout.json'
};
export default api;
