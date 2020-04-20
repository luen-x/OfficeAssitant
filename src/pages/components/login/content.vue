<template>
	<div :style="{ height }" class="v-login-container g-flex-cc">
		<oa-login-bg />
		<div class="_box g-c-white">
			<h1 class="g-fs-34 g-tc" style="margin-top: 50px">微一案办公系统</h1>
			<div class="_input-container g-flex-ac g-m-t-40">
				<i class="iconfont icon-account g-fs-22" />
				<input
					:value="account"
					:maxlength="11"
					class="g-col"
					placeholder="请输入账号"
					@input="handleChange($event, 'account')"
				>
				<i
					v-show="account.length > 0"
					class="iconfont icon-clear g-fs-14 g-pointer _clear"
					@click="handleClear('account')"
				/>
			</div>
			<div v-if="showCode" class="_input-container g-flex-ac g-m-t-20">
				<i class="iconfont icon-yanzhengma2 g-fs-22" />
				<input
					:value="code"
					:maxlength="6"
					class="g-col"
					placeholder="请输入验证码"
					@input="handleChange($event, 'code')"
				>
				<span
					v-if="!hasSend"
					style="color: #5b9af9;"
					class="g-pointer"
					@click="handleSendMsg">
					获取验证码
				</span>
				<span v-else style="color: #999999;">{{ time }}S</span>
			</div>
			<div class="_input-container g-flex-ac g-m-t-20">
				<i class="iconfont icon-password g-fs-22" />
				<input
					:value="password"
					class="g-col"
					type="password"
					placeholder="请输入密码"
					@input="handleChange($event, 'password')"
				>
				<i
					v-show="password.length > 0"
					class="iconfont icon-clear g-fs-14 g-pointer _clear"
					@click="handleClear('password')"
				/>
			</div>
			<!-- <div class="g-flex g-ai-fe g-m-t-20">
				<div class="_input-container" style="margin-right: 10px">
					<i class="iconfont icon-quality-test g-fs-22" />
					<input
						:value="verification"
						class="g-col"
						placeholder="请输入验证码"
						@input="handleChange($event, 'verification')"
					>
				</div>
				<div
					ref="code"
					class="g-pointer g-inline g-col _code"
					@click="handleSendCode"
				>
					<img
						v-if="codeContent"
						:src="`${API_ROOT['_LOGIN_MAIN_VERIFICATION_GET']}?v=${codeContent}`"
						alt="换一个"
					>
				</div>
			</div> -->

			<div>
				<div class="_login-btn" @click="handleValidity">登&nbsp;录</div>
			</div>
		</div>
		<div class="g-flex-cc g-fd-c" style="position: fixed; bottom: 30px">
			<img :src="OSS_WYA_LOGO_R">
			<div class="g-fs-14 g-c-white" style="opacity: 0.6; letter-spacing: 2px">
				浙江微一案信息科技有限公司
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { mapState } from 'vuex';
import { Message } from 'iview';
import { setItem, dataValidity, getHashUrl, objRegex, delItem } from '@utils/utils';
import { OSS_WYA_LOGO_R } from '@constants/constants';
import API_ROOT from '@stores/apis/root';
import { createLoginAuth, formRoutes } from '@routers/hooks';
import md5 from 'js-md5';
import { setInterval, clearInterval, clearImmediate } from 'timers';
import { getChunks } from '@components/layout/chunks';
import { serviceManager } from '@stores/services/utils';
import LoginBg from './bg';

export default {
	name: 'login',
	components: {
		'oa-login-bg': LoginBg
	},
	data() {
		return {
			OSS_WYA_LOGO_R,
			height: window.innerHeight + 'px',
			account: '',
			code: '',
			password: '',
			verification: '',
			codeContent: '',
			showCode: false,
			hasSend: false,
			time: 60,
			timer: null
		};
	},
	computed: {
		...mapState(['loginMain'])
	},
	created() {
		window.addEventListener('keyup', this.handleEnterUp);
		window.addEventListener('resize', this.getHeight);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.getHeight);
		window.removeEventListener('keyup', this.handleEnterUp);
	},
	methods: {
		// 获取浏览器窗口高度
		getHeight() {
			this.height = window.innerHeight + 'px';
		},
		handleClear(type) {
			this[type] = '';
		},
		handleChange(event, type) {
			this[type] = event.target.value;

			if (type === 'account') {
				// 根据接口判断是否显示获取验证码
				if (objRegex.validMobile.regex.test(this.account)) {
					this.$request({
						url: '_LOGIN_SHOW_CODE_GET',
						type: 'GET',
						loading: false,
						param: {
							name: this.account
						}
					}).then(res => {
						this.showCode = res.data.is_show !== 0;
						this.hasSend = false;
						clearInterval(this.timer);
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			}
		},
		handleEnterUp(event) {
			if (event.keyCode === 13) {
				this.handleValidity();
				// this.code && this.code.click();
			}
		},
		handleSendCode() {
			this.$request({
				url: API_ROOT['_LOGIN_MAIN_VERIFICATION_GET'],
				type: 'GET',
				param: {
					refresh: 1
				},
				loading: false
			}).then((response) => {
				this.codeContent = response.data.url;
			}).catch((errors) => {
				// this.$Message.error(errors.msg);
			});
		},
		handleSendMsg: lodash.debounce(function () {
			this.time = 60;
			this.timer = null;

			// 获取手机验证码
			if (!this.hasSend) {
				this.$request({
					url: '_LOGIN_SEND_CODE_GET',
					type: 'GET',
					param: {
						mobile: this.account,
						type: 2
					},
					loading: false
				}).then(res => {
					this.hasSend = true;
					this.$Message.success('验证码发送成功！');

					this.timer = setInterval(() => {
						if (this.time <= 0) {
							this.hasSend = false;
							clearInterval(this.timer);
						}
						this.time--;
					}, 1000);
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}
		}, 300),
		handleValidity: lodash.debounce(function () {
			let msg = '';
			let callback = (errors) => {
				if (errors) {
					this.$Message.warning(errors);
					return;
				}
				if (!this.password) {
					msg = '密码不能为空!';
				} else if (this.showCode && !this.code) {
					msg = '验证码不能为空!';
				}
				if (msg) {
					this.$Message.warning(msg);
					return false;
				}
				this.handleLogin();
				// this.$refs.code && this.$refs.code.click();
			};
			dataValidity({ required: true, type: 'validMobile', name: '账号' }, this.account, callback);
		}, 300),
		handleLogin() {
			this.request({
				url: 'LOGIN_MAIN_POST',
				type: 'POST',
				param: {
					name: this.account,
					code: this.code,
					password: md5(this.password),
					// verification: this.verification
				}
			}).then((res) => {			
				let chunks = getChunks(res.data.auth).filter((item) => item.show) || [];
				if (formRoutes.indexOf(this.$route.query.redirect) != -1) {
					createLoginAuth(res.data, true, { redirect: getHashUrl(this.$route.query.redirect, JSON.parse(this.$route.query.params)) });
				} else if (chunks.length > 0) {
					this.$Message.success('登录成功');
					createLoginAuth(res.data);
					this.loadFirstDepart();
				} else if (res.data.auth[678]) {
					let { staff_id, staff_name } = res.data.staff || {};
					createLoginAuth(res.data, true, {
						redirect: `/hr/employee/summary/details?staff_id=${staff_id}&staff_name=${staff_name}&from=avatar`
					});
				} else {
					this.$Message.warning('该账号暂无权限');
				}
			}).catch((error) => {
				console.error(error);
				this.$Message.error(error.msg);
			});
		},
		loadFirstDepart() {
			this.$request({
				url: "_HR_HUMAN_FIRST_DEPART_ID_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				setItem(`firstDepartId_${_global.version}`, { param: {}, res });
				Object.keys(res.data).forEach((key) => {
					if (res.data[key] == this.$global.staff.first_depart) {
						setItem(`firstDepartName_${_global.version}`, key);
					}
				});
				serviceManager.add(() => {
					delItem(`firstDepartId_${_global.version}`);
					delItem(`firstDepartName_${_global.version}`);
				});

			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}

	},
};
</script>

<style lang="scss">
.v-login-container {
	position: relative;
	// animation: bgswitch 40s;
	// animation-iteration-count: infinite;
	// animation-timing-function: linear;
	._box {
		width: 400px;
		height: 400px;
		background-color: rgba(0, 0, 0, 0.70);
		border-radius: 10px;

	}
	._input-container {
		height: 40px;
		margin-left: 36px;
		margin-right: 36px;
		padding: 0 5px;
		border-bottom: 1px solid #ffffff;
		font-size: 14px;
		input {
			background-color: transparent;
			margin: 0 15px;
			caret-color: #e84854;
			color: #ffffff;
		}
		._clear {
			opacity: 0;
			transition: opacity 0.2s cubic-bezier(0.18, 0.89, 0.32, 1);
		}
	}
	._input-container:hover {
		._clear {
			opacity: 1;
		}
	}
	._login-btn {
		height: 50px;
		line-height: 50px;
		border-radius: 25px;
		background-color: #e84854;
		color: #ffffff;
		font-size: 18px;
		text-align: center;
		margin: 36px 36px 0 36px;
		cursor: pointer;
		user-select: none !important;
		&:hover {
			background-color: #ec505b;
		}
		&:active {
			background-color: #d9444f;
		}
	}
	._code {
		height: 36px;
		line-height: 36px;
		border: 1px solid #ffffff;
		margin-right: 36px;
		text-align: center;
	}
}
// @keyframes bgswitch
// 	{
// 		0%   {background: url('./pic01.jpg') no-repeat 0 0;}
// 		15%  {background: url('./pic01.jpg') no-repeat 0 0;}

// 		25%  {background: url('./pic02.jpg') no-repeat 0 0;}
// 		40%  {background: url('./pic02.jpg') no-repeat 0 0;}

// 		50%  {background: url('./pic03.jpg') no-repeat 0 0;}
// 		65%  {background: url('./pic03.jpg') no-repeat 0 0;}

// 		75%  {background: url('./pic04.jpg') no-repeat 0 0;}
// 		90%  {background: url('./pic04.jpg') no-repeat 0 0;}

// 		100% {background: url('./pic01.jpg') no-repeat 0 0;}
// 	}
</style>
