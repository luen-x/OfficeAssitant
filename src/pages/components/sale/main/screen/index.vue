<template>
	<div ref="screen" class="v-sale-screen">
		<div class="_title g-flex g-jc-sb">
			<div v-if="showToolkit" class="g-c-red-light" @click="handleSelect">
				<i class="iconfont icon-search" style="cursor: pointer"/>
			</div>
			<div>
				<div class="__title g-c-black1">互动大屏</div>
			</div>
			<div class="g-c-blue-light">
				<!-- <span v-if="showToolkit">
					<i-date-picker
						:open="open"
						:value="time"
						placeholder="选择日期"
						style="cursor: pointer"
						@on-clear="handleClear"
						@on-change="handleGetSelectedData"
						@on-open-change="handleOpenChange"
					>
						<div class="g-fs-14" @click="handleOpen">
							<template v-if="time === ''">请选择日期</template>
							<template v-else>{{ time }}</template>
						</div>
					</i-date-picker>
                </span>-->
				<!-- <span v-if="showToolkit" class="g-opeartion">|</span> -->
				<span
					style="cursor: pointer"
					class="g-opeartion g-fs-14 g-m-r-10"
					@click="handleCollect"
				>查看收藏</span>
			</div>
		</div>
		<div
			ref="scroll"
			:class="['_scroll', {'_scrollbar': !listinfo.length}]">
			<div v-if="listinfo.length">
				<oa-message-item
					v-for="(message, i) in listinfo"
					:key="i"
					:handle-praise="handlePraise"
					:handle-collect-on="handleCollectOn"
					:message="message"
				/>
				<div v-if="isLoading" class="g-tc g-c-blue-dark">加载中...</div>
				<div v-if="isEnd && !isLoading" class="g-tc g-c-blue-dark">我是有底线的哦~</div>
			</div>
			<div v-if="!listinfo.length && !isLoading" class="g-tc __img">
				<div style="margin-top: 100px">
					<img :src="OSS_NO_MESSAGE">
					<div class="g-c-black5">暂无消息记录</div>
				</div>
			</div>
		</div>
		<oa-loading v-if="loading"/>
	</div>
</template>

<script type="text/ecmascript-6">
import { DatePicker } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { OSS_NO_MESSAGE } from '@constants/constants';
import { setTimeout } from 'timers';
import { sockets } from '@stores/services/socket';
import { ModalColletcd } from './popup/collected';
import { ModalSelect } from './popup/select';
import messsageItem from './popup/message-item';

export default {
	components: {
		"i-date-picker": DatePicker,
		'oa-message-item': messsageItem
	},
	mixins: [sockets.notice({ isNeedDestroy: false })],
	props: {
		// 当前在首页 还是在内容管理模块
		module: {
			type: String,
			required: true
		},
		content: {
			type: String,
			default: ''
		},
		date: {
			type: [Date, String],
			default: '',
			OSS_NO_MESSAGE
		},
		staff_id: {
			type: [Number, String],
			default: '',
		}
	},
	data() {
		return {
			open: false,
			showScroll: false,
			// time: moment().format('YYYY-MM-DD'), // 不能 这样写
			loading: true,
			time: '',
			pageSize: 10,
			page: 1,
			isLoading: false,
			isEnd: false,
			is_sale_page: '',
			OSS_NO_MESSAGE
		};
	},
	computed: {
		listinfo() {
			return this.$store.state.saleMainScene.list;
		},
		showToolkit() {
			return this.module == 'sale';
		},
		canSocket() { // 是否加入socket数据
			return this.$store.state.saleMainScene.canSocket;
		}
	},
	created() {
		this.$store.commit('SALE_MAIN_SCREEN_INIT');
		this.handleScreenData().then(res => {
			this.loading = false;
			this.isLoading = false;
		}).catch(err => {
			err && console.error(err);
		});
	},
	mounted() {

		// 监听下拉加载
		this.$refs.scroll.addEventListener('scroll', this.handleScrollLoad);
		// 监听socket
		setTimeout(() => {
			this.socket.on(e => {
				if (e.data && e.event == '103') {
					const data = e.data.data;

					this.handleSocketData(data);
				}
			});
		}, 0);
	},
	beforeDestroy() {
		this.$refs.scroll.removeEventListener('scroll', this.handleScrollLoad);
	},
	methods: {
		handleEnter() {
			this.showScroll = true;
		},
		handleLeave() {
			this.showScroll = false;
		},
		handleOpen() {
			this.open = true;
		},
		handleScreenData() {
			this.isLoading = true;
			if (this.module == 'sale') {
				this.is_sale_page = 1;
			}
			return this.request({
				url: 'SALE_MAIN_SCENE_GET',
				type: "GET",
				param: {
					page: this.page,
					pageSize: this.pageSize,
					content: this.content,
					date: (this.date && moment(this.date).format('YYYY-MM-DD'))
                        || (this.time && moment(this.time).format('YYYY-MM-DD')),
					staff_id: this.staff_id,
					is_sale_page: this.is_sale_page
				}
			});
		},
		handleCollectOn(data) {
			this.$request({
				url: API_ROOT._SALE_MAIN_SCREEN_COLLECT_POST,
				type: "POST",
				param: {
					interact_id: data.interact_id,
					status: data.is_collect ? -1 : 1
				}
			}).then(res => {
				this.$store.commit("SALE_MAIN_SCREEN_COLLECT", data);
			});
		},
		handleScrollLoad() {
			// scrollTop为滚动条在Y轴上的滚动距离。
			// clientHeight为内容可视区域的高度。
			// scrollHeight为内容可视区域的高度加上溢出（滚动）的距离。
			// 滚动条到底部的条件即为scrollTop + clientHeight == scrollHeight
			const scrollDom = this.$refs.scroll;
			const scrollTop = scrollDom.scrollTop;
			const clientHeight = scrollDom.clientHeight;
			const scrollHeight = scrollDom.scrollHeight;
			if (scrollTop > 10 && scrollTop + clientHeight >= scrollHeight - 10 && !this.isLoading) {
				this.isLoading = true;
				this.page++;
				this.handleScreenData().then(res => {
					this.isLoading = false;
					// 到达最大长度 停止下拉加载监听事件
					if (this.listinfo.length && this.listinfo.length >= res.data.totalCount) {
						this.isEnd = true;
						this.$refs.scroll.removeEventListener('scroll', this.handleScrollLoad);
					}
				}).catch(err => {
					console.error(err);
				});
			}
		},
		handlePraise: debounce(function (data) {
			this.$request({
				url: API_ROOT._SALE_MAIN_SCREEN_PRAISE_POST,
				type: "POST",
				param: {
					interact_id: data.interact_id,
					status: data.is_praise ? -1 : 1
				}
			}).then(res => {
				this.$store.commit("SALE_MAIN_SCENE_PRAISE", data);
			});
		}, 300),
		// handlePraise(data) {
		// 	this.$request({
		// 		url: API_ROOT._SALE_MAIN_SCREEN_PRAISE_POST,
		// 		type: "POST",
		// 		param: {
		// 			interact_id: data.interact_id,
		// 			status: data.is_praise ? -1 : 1
		// 		}
		// 	}).then(res => {
		// 		this.$store.commit("SALE_MAIN_SCENE_PRAISE", data);
		// 	});
		// },
		handleClear() {
			// 数据初始化  恢复socket 和监听
			this.time = '';
			this.page = 1;
			this.$store.commit('SALE_MAIN_SCREEN_INIT');
			this.$refs.scroll.addEventListener('scroll', this.handleScrollLoad);
		},
		handleGetSelectedData(date) {
			// 忽略 socket 数据
			// 如果处于搜索事件（不为空）的状态下，忽略socket数据
			const canSocketBool = !this.time;
			// 如果 与当前 canSocket 状态不一致 更改 vuex 数据
			canSocketBool != this.canSocket && this.$store.commit('SALE_MAIN_SCREEN_CAN_SOCKET', { bool: canSocketBool });
			this.isLoading = true;
			this.isEnd = false;
			this.page = 1;
			this.open = false;
			this.time = date;
			if (this.module == 'sale') {
				this.is_sale_page = 1;
			}
			this.$store.commit('SALE_MAIN_SCREEN_INIT');
			this.request({
				url: 'SALE_MAIN_SCENE_GET',
				type: 'GET',
				param: {
					page: this.page,
					pageSize: 10,
					date,
					is_sale_page: this.is_sale_page
				}
			}).then(res => {
				this.isLoading = false;
			});
		},
		handleSocketData(data) {
			if (!this.canSocket) return;
			if (data.type == 1) {
				// 默认推送不可撤回 id相等 可撤回
				if (data.staff_id == this.$global.staff.staff_id) {
					data.is_own_send = 1;
				}
				this.$store.commit('SALE_MAIN_SCREEN_ADD_MSG', { message: data });
			} else if (data.type == 2) {
				this.$store.commit('SALE_MAIN_SCREEN_WITHDRAW', { interact_id: data.interact_id });
			} else if (data.type == 3) {
				this.$store.commit('SALE_MAIN_SCREEN_SOCKET_PRAISE', { ...data });
			}
		},
		handleCollect() {
			ModalColletcd.popup({
			}).then((res) => {
			}).catch((res) => {
			});
		},
		handleSelect() {
			ModalSelect.popup({
				module: this.module
			}).then((res) => {
			}).catch((res) => {
			});
		}
	}

};
</script>

<style lang="scss">
    .v-sale-screen {
        position: relative;
        display: flex;
		flex-direction: column;
        width: 100%;
        margin-bottom: 20px;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
        ._scroll {
			flex:1;
			height: 395px;
            overflow-y: hidden;
			margin-right:17px;
			// .__img{
			// 	margin-right: 17px;
			// }
        }
		._scroll:hover {
			margin-right:0px;
			overflow-y: scroll;
			//  overflow-x: scroll;
			// .__img{
			// 	margin-right: 17px;
			// }
		}
		._scrollbar::after {
				content: ' ';
				position: absolute;
				// height: 100%;
				width: 20px;
				top: 46px;
				bottom: 0;
				right: 0;
				background-color: #fff;
			}
        ._title {
            height: 46px;
            line-height: 46px;
            font-size: 14px;
            background: #f8f8f8;
            padding: 0 10px;
            position: relative;
            .ivu-input {
                cursor: pointer;
            }
            ::-webkit-input-placeholder {
                color: #2e9dfa !important;
            }
            .__title {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
</style>
