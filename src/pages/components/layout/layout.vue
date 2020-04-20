<template>
	<div :style="{height: '100vh', width: '100vw'}" class="c-layout">
		<div class="_header-bar g-flex-ac g-jc-sb">
			<div class="g-fl __left">
				<img
					:src="OSS_WYA_LOGO"
					class="g-m-l-20 g-m-r-30"
					style="width: 150px">
				<div v-if="modules.length > 1 && curModuleName">
					<i-dropdown @on-click="handleChangeModule">
						<div
							class="g-pointer g-dp-ib __title-wrapper g-pd-lr-10"
						>
							<span class="g-c-white g-fs-14" style="margin-right: 4px">{{ curModuleName }}</span>
							<div class="__icon-wrapper">
								<i
									class="iconfont icon-triangle-down g-c-white g-fs-12"
								/>
							</div>
						</div>
						<i-dropdown-menu slot="list">
							<i-dropdown-item
								v-for="(it) in modules"
								:key="it.value"
								:value="it.value"
								:name="it.value"
								:selected="curModuleName === it.name"
							>
								{{ it.name }}
							</i-dropdown-item>
						</i-dropdown-menu>
					</i-dropdown>
				</div>
				<span v-else class="g-fs-20 g-m-r-30">后台管理中心</span>
			</div>
			<div v-if="!isHackRoutes" class="g-fr g-flex-ac g-m-r-20">
				<div v-for="(item,index) in operation" :key="item.key" class="_operater">
					<i-divider v-if="index!==0" type="vertical"/>
					<span class="g-pointer g-relative" @click="handleOperation(item)">
						<i 
							v-if="item.icon" 
							:class="'iconfont g-fs-16 g-relative g-pointer '+item.icon" 
							style="top:2px;" 
						/>
						<span v-if="item.key==='Notice' && count" class="_count-tag">{{ count>99?'99+':count }}</span>
						<span>{{ item.name }}</span>
					</span>
				</div>
			</div>
		</div>
		<div class="_content">
			<oa-left-menu
				v-if="!fullRouter"
				:menus="leftMenus"
				:route-path="routePath"
			>
				<div slot="avatar" class="g-flex g-fd-c g-ai-c __avatar-container">
					<div class="g-fs-16 g-m-t-20">{{ staffInfo.depart_name }}</div>
					<div class="__avatar g-m-t-20 g-flex-cc g-pointer" @click="handleLinkToStaff">
						{{ staffInfo.staff_name.slice(-2) }}
					</div>
					<i-dropdown class="g-m-b-25 g-m-t-5" @on-click="handleItemClick">
						<div class="g-flex-ac g-ai-c g-c-black2 g-fs-12 g-pointer __name-wrapper">
							<span>{{ staffInfo.staff_name }}</span>
							<div class="__icon-wrapper">
								<i class="iconfont icon-triangle-down g-fs-12" style="margin-left: 4px"/>
							</div>
						</div>
						<i-dropdown-menu slot="list">
							<i-dropdown-item name="2">修改密码</i-dropdown-item>
							<i-dropdown-item name="1">退出登录</i-dropdown-item>
						</i-dropdown-menu>
					</i-dropdown>
				</div>
			</oa-left-menu>
			<div
				class="g-flex g-fd-c"
				style="height: 100%"
			>
				<oa-top-menu
					ref="topBar"
					:full-router="fullRouter"
					:menus="topMenus"
					:route-path="routePath"
					:on-mounted="handeSetPaddingTop"
				/>
				<oa-email/>
				<div class="g-relative g-col g-flex g-fd-c" style="height: inherit; overflow-y: auto">
					<router-view v-if="refreshNotice" class="v-router g-col" style="overflow: auto; height: inherit"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Select, Option, Dropdown, DropdownMenu, DropdownItem, Divider, Badge } from 'iview';
import { OSS_WYA_LOGO } from '@constants/constants';
import { clearLoginAuth, hackRoutes } from '@routers/hooks';
import API_ROOT from '@stores/apis/root';
import { getItem, setItem, delItem } from '@utils/utils';
import { sockets } from '@stores/services/socket';
import { PWDModal } from '../login/popup/modify-password';
import { PModalLoginOut } from '../login/popup/login-out';
import callService from '../sale/call-manage/call/service';
import { handleCopyPhone, handleMouseMove } from "../sale/call-manage/call/util";

// components
import LeftMenu from './left';
import TopMenu from './top';
import { getChunks } from './chunks';
import menus from './left/root';
import FullRouter from './hack/full-router';
import FreeRouter from './hack/free-router';
import HackRouter from './hack/hack-router';
import { setClosePath } from './hack/single-page';
import { noticeDrawer } from './popup/notice';
import { expireTipService } from '../sale/_common/customer/expired-tip.vue';
import noticeHandler from './socket-notice';
import Email from '../sc/_common/email/email';
import { getChunks as getPersonalMenu, getIndexRoute } from '../hr/personnel/menu';

const TOP_BAR_HEIGHT = 56;


export default {
	components: {
		"i-select": Select,
		"i-option": Option,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'i-divider': Divider,
		'i-badge': Badge,
		"oa-left-menu": LeftMenu,
		"oa-top-menu": TopMenu,
		"oa-email": Email,
	},
	mixins: [HackRouter.indexOf(window.location.pathname) === -1 ? sockets.notice() : {}],
	data() {
		return {
			paddingTop: '0px',
			modulesData: getChunks(this.$auth),
			OSS_WYA_LOGO,
			refreshNotice: true,
			operation: [
				{ name: '搜索', key: 'Search', icon: 'icon-search', auth: this.$auth[650], path: '/content/search' },
				{ name: '通知', key: 'Notice', icon: 'icon-notice', auth: true, handler: 'handleOpenNotice' },
				{ name: '呼叫', key: 'Call', icon: 'icon-call-out', auth: this.$auth[600], handler: 'handleToCall' },
				{ name: '资料参考', key: 'Material', icon: '', auth: this.$auth[1519], path: '/material/material' },
				{ name: '工单管理', key: 'WorkSheet', icon: '', auth: this.$auth[1504], path: '/worksheet/control/bug' },
				{ name: '收藏', key: 'Collect', icon: '', auth: this.$auth[1762], path: '/collect/main' }
			].filter(it => it.auth)
		};
	},
	computed: {
		routePath() {
			return this.$route.path;
		},
		count() {
			return this.$store.state.countMain.count;
		},
		curModule() {
			return this.routePath.split('/')[1];
		},
		fullRouter() {
			return FullRouter.includes(this.routePath);
		},
		curModuleName() {
			return (this.modules.filter((item) => item.value === this.curModule)[0] || {}).name;
		},
		leftMenus() { // 当前模块下的菜单
			let curMenu = menus[this.curModule](this.$auth, this.$global.staff) || [];
			return curMenu.filter((item) => item.show);
		},
		topMenus() {
			if (this.routePath !== this.$route.path) return [];
			let leftIndex = this.leftMenus.findIndex((item) => this.routePath.indexOf(item.route) > -1);
			if (leftIndex === -1) return [];
			return this.leftMenus[leftIndex].children || [];
		},
		staffInfo() {
			return this.$global.staff;
		},
		modules() { // 用户可进入的模块
			return this.modulesData.filter((item) => item.show);
		},
		isHackRoutes() {
			return hackRoutes.indexOf(this.$route.path) > -1;
		}
	},
	beforeRouteEnter(to, from, next) {
		next();
	},
	beforeRouteUpdate(to, from, next) {
		this.$vc.clean();
		next();
	},
	beforeRouteLeave(to, from, next) {
		next();
	},
	created() {
		window.addEventListener('storage', this.handleLocalStorageChange);
		if (_global.staff.seat_number) {
			callService.init({ agentno: _global.staff.seat_number, pstnnumber: _global.staff.pstn_number, exten: _global.staff.seat_number });
		}
		if (_global.staff.staff_id && _global.auth[360]) {
			expireTipService.init();
		}
		// 检查新的通知
		this.isHackRoutes || this.checkNotice();
	},
	mounted() {
		this.socket && this.loadCount();
		// noticeHandler['113']({ "company_name": "大公司", "customer_id": 12, "alert_id": 3034, "type": 1 });
		// this.curModuleName = this.modules.filter((item) => item.value === this.curModule)[0].name;
		this.socket && this.socket.on(res => {
			const handler = noticeHandler[res.event];
			handler && handler((res.data || {}).data || {});
		});
		this.$vc.on('query-notices-url-change', () => {
			this.refreshNotice = false;
			this.$nextTick(() => {
				this.refreshNotice = true;
			});
		});
	},
	beforeDestroy() {
		this.$vc.off('query-notices-url-change');
		window.removeEventListener('storage', this.handleLocalStorageChange);
		callService.close();
		expireTipService.close();
	},
	methods: {
		loadCount() {
			this.$request({
				url: API_ROOT._NOTICE_NO_READ_COUNT_GET,
				type: 'GET',
				loading: false,
			}).then(res => {
				this.$store.commit('NOTICE_COUNT_SET', res.data.count);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handeSetPaddingTop(top) {
			this.paddingTop = top + TOP_BAR_HEIGHT + 'px';
		},
		handleChangeModule(value) {
			this.$router.push(`/${value}`);
		},
		handleItemClick(name) {
			if (name == 1) {
				PModalLoginOut.popup({}).then(res => {
					clearLoginAuth();
				});
			} else {
				PWDModal.popup({}).then((res) => {
					clearLoginAuth();
				});
			}
		},
		handleLinkToStaff() {
			if (this.$route.path.includes('/hr/personnel')) return;
			if (this.staffInfo.is_charge == 1) {
				return;
			}
			if (_global.auth[1225]) {
				const personalMenu = getPersonalMenu(this.$auth);
				const indexRoute = getIndexRoute({ children: personalMenu });
				if (indexRoute) {
					setItem('avatarLeftMenus_' + this.$global.version, this.leftMenus);
					this.$router.push({
						path: indexRoute,
						query: {
							staff_id: this.staffInfo.staff_id,
							staff_name: this.staffInfo.staff_name,
							from: "avatar"
						}
					});
				}

			} 
		},
		
		// 检查是否有新的通知
		checkNotice() {
			this.$request({
				url: API_ROOT._NOTICE_IN_COUNT_GET,
				type: 'GET',
				loading: false,
			}).then(({ data }) => {
				// data = [
				// 	{ event: '113', content: { "company_name": "大公司", "customer_id": 12, "alert_id": 3034, "type": 1 } },
				// 	{ event: '113', content: { "company_name": "大公司2", "customer_id": 13, "alert_id": 3032, "type": 1 } }
				// ];
				if (data.length) {
					
					data.forEach((noticeData, index) => {
						noticeHandler[noticeData.event](noticeData.content);
					});
				}
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOperation(item) {
			if (item.handler) {
				this[item.handler]();
				return;
			}
			if (item.path) {
				if (this.$route.path === item.path) {
					return;
				}
				if (!this.$route.path.includes(item.path)) {
					setClosePath();
				} 
				this.$router.push(item.path);
			}
		},
		// 打开通知侧边栏
		handleOpenNotice() {
			noticeDrawer.popup({}).then(res => {}).catch(err => err && console.error(err));
		},
		handleToCall() {
			if (!this.$route.path.includes("/sale/call")) {
				setClosePath();
			}
			if (this.$auth[1022]) {
				this.$router.push('/sale/call/manage');
			} else if (this.$auth[601]) {
				this.$router.push('/sale/call/record');
			}
		},
		handleLocalStorageChange(event) {
			if (event.key == `staff_${this.$global.version}` && !event.newValue) {
				clearLoginAuth();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.c-layout{
	position: relative;
	overflow: hidden;
	._header-bar{
		width: 100%;
		height: 54px;
		line-height: 54px;
        background: #e84854;
		color: #ffffff;
		box-shadow: 0 1px 1px rgba(0,0,0,.1);
		.__left {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 54px;
			.__title-wrapper {
				.__icon-wrapper {
					display: inline-block;
					transition: all .3s;
				}
				&:hover {
					height: 54px;
					background-color: #d9444f;
				}
				&:hover .__icon-wrapper {
					transform: rotate(180deg);
				}
			}
			/deep/ .ivu-select-dropdown {
				z-index: 9990 !important;
				overflow: auto;
			}
			.ivu-dropdown-menu {
				min-width: 140px;
			}
			.ivu-dropdown-item-selected, .ivu-dropdown-item-selected:hover {
				color: #e84854 !important;
			}
			.ivu-dropdown-item-selected {
				background: white !important;
			}
			.ivu-dropdown-item.ivu-dropdown-item-selected:hover {
				background: #f3f3f3 !important;
			}
		}
		._operater {
			// cursor: pointer;
			line-height: 16px;
			._count-tag {
				top: -6px;
				position: absolute;
				background: #2397F9;
				font-size: 12px;
				border-radius: 7px;
				color: white;
				display: inline-block;
				padding: 1px 4px;
				line-height: 12px;
				min-width: 14px;
				left: 8px;
			}
		}
		/deep/ .ivu-divider-vertical {
			background-color: #fff !important;
			opacity: 0.4;
			margin: 0 16px !important;
			top: 0 !important;
		}
    }
	._content {
		width: 100%;
		position: absolute;
		top: 54px;
		left: 0;
		right: 0;
		bottom: 0;
		.__avatar-container {
			.__avatar {
				width: 60px;
				height: 60px;
				border-radius: 30px;
				color: white;
				background: #e84854;
				font-size: 18px;
				font-weight: 500;
				font-family: "sans-serif";
				overflow: hidden;
			}
			.__name-wrapper {
				.__icon-wrapper {
					display: inline-block;
					transition: all .3s;
				}
				&:hover .__icon-wrapper {
					transform: rotate(180deg);
				}
			}
			.ivu-dropdown-menu {
				min-width: 160px !important;
			}
			.ivu-dropdown-item {
				line-height: 36px !important;
				height: 36px !important;
				padding: 0 16px !important;
			}
		}

	}
}
</style>
