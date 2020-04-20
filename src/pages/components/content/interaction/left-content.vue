<template>
	<div class="v-content-interaction g-pd-t-15 g-flex">
		<div class="g-pd-lr-20 g-fl" style="width: 45%; max-width: 640px">
			<div style="min-width: 450px">
				<div class="g-fs-16 g-c-black1">接收部门设置</div>
				<div class="g-fs-14 g-c-black1 g-m-t-10">
					角色：
					<i-select
						v-model="receiveRole"
						:remote-method="handleSelectRole"
						:loading="isLoading"
						multiple
						filterable
						remote
						class="_role">
						<i-option v-for="(role, index) in allRoles" :value="role.role_id" :key="index">{{ role.role_name }}</i-option>
					</i-select>
				</div>
			</div>
			<div style="height: 10px"/>
			<div style="width: 100%">
				<div class="_write g-relative g-box-shadow" style="width: 100%">
					<oa-unique-textarea
						ref="uniText"
						v-model="inputValue"
						:max="200"
						:autosize="{minRows: 11, maxRows: 11}"
						placeholder="在这里输入内容.."/>
					<span class="_tip g-absolute">{{ inputValue.length }}/200</span>
					<div class="g-flex-ac _toolkit g-pd-l-10 g-pd-r-15 g-absolute">
						<!-- <i class="g-fs-20 _point">@</i> -->
						<div style="padding-top: 5px">
							<i class="iconfont icon-picture _img" @click ="isShowUpload" />
							<div
								:class="['_upload', { 'g-hide': !showUpload }, 'g-box-shadow']">
								<p style="line-height: 30px">从本地上传图片(最多上传6张)</p>
								<oa-imgs-picker 
									v-model="imgArr" 
									:max="6"
									:upload="uploadOption"
									@change="handleChange"
									@error="handleError"/>
							</div>	
						</div>
						<vc-debounce-click :tag="Button" class="g-absolute _submit" type="primary" @click="handleSendMsg">发送</vc-debounce-click>
					</div>
				</div>
				<div style="height: 130px"/>
			</div>

		</div>

		<div class="_right">
			<div>
				<i-input v-model="keyword" clearable class="_short g-m-r-10 g-m-b-10" placeholder="请输入关键字搜索"/>
				<i-date-picker 
					v-model="time"
					class="_short"
					transfer
					style="transform: translate(-3px, -5px); margin-right: 5px"
					placeholder="请选择发送时间"
					type="date"/>
				<i-select
					ref="staff"
					:remote-method="loadStaff"
					:loading="staffLoading"
					:value="staff"
					filterable
					clearable
					remote
					label-in-value
					class="_short g-m-b-10"
					placeholder="请输入员工姓名/手机号搜索"
					style="display: inline-block; margin-right: 8px"
					@on-change="handleStaffChange"
					@on-query-change="handleQueryChange"
				>
					<i-option v-for="(option, index) in staffData" :value="option.value" :key="index">{{ option.label }}</i-option>
				</i-select>
				<vc-debounce-click :tag="Button" class="g-m-r-10 g-red-btn-small g-m-b-10" type="primary" @click="handleSearch">搜索</vc-debounce-click>
			</div>
			<div class="g-m-t-10 _sale-screen g-m-r-20" style="margin-left: 3px; height: 800px">
				<oa-sale-screen
					ref="screen"
					:content="keyword"
					:date="time"
					:staff_id="staff"
					module="content"/>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from 'iview';
import moment from 'moment';
import { ImgsPicker } from 'wya-vc';
import ROOT_API from '@stores/apis/root';
import { staffByMutiTerm } from '@stores/services/hr';
import saleScreen from '@components/sale/main/screen/index';
import uniqueTextarea from "../_common/uniq-textarea/uniq-textarea";
import imgsPickerDragger from './imgs-picker';

export default {
	name: 'oa-interaction-left',
	components: {
		'i-input': Input,
		'i-button': Button,
		'v-imgs-picker': ImgsPicker,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-sale-screen': saleScreen,
		'oa-imgs-picker': imgsPickerDragger,
		'oa-unique-textarea': uniqueTextarea
	},
	mixins: [staffByMutiTerm],
	data() {
		return {
			inputValue: '',
			showUpload: 0,
			imgs: [],
			imgArr: [],
			keyword: '',
			time: '',
			staff: '',
			staff_label: '',
			page: 0,
			pageSize: 10,
			receiveRole: [],
			isLoading: false,
			allRoles: [],
			uploadOption: {
				multiple: true,
				max: 6,
				size: 200
			}
		};
	},
	computed: {
		canSocket() { // 是否加入socket数据
			return this.$store.state.saleMainScene.canSocket;
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.$store.commit('SALE_MAIN_SCREEN_INIT');
	},
	methods: {
		isShowUpload(bool) {
			this.showUpload = !this.showUpload;
		},
		handleSelectRole(query) {
			this.isLoading = true;
			this.$request({
				url: ROOT_API._AUTH_ROLE_LIST_GET,
				type: 'GET',
				param: {
					role_name: query
				}
			}).then(res => {
				this.isLoading = false;
				this.allRoles = res.data.list;
			});
		},
		handleSendMsg() {
			if (!this.inputValue) {
				this.$Message.error('请输入发送内容 ');
				return;
			}
			if (!this.receiveRole.length) {
				this.$Message.error('至少选择一个角色');
				return;
			}
			if (this.imgArr.length > 6) {
				this.$Message.error('最多只能选择6张哦~');
			}
			this.$request({
				url: ROOT_API['_CONTENT_INTERACTION_SEND_POST'],
				type: 'POST',
				param: {
					content: this.inputValue.replace(/[\r\n]/g, " "), // 替换换行符
					image_url: this.imgArr.filter(v => typeof v == 'string'),
					role_id: this.receiveRole
				}
			}).then(res => {
				this.$Message.success(res.msg);
				if (this.canSocket) {
					// 如果此时忽略 socket 数据 则不更新数据
					const message = {
						...res.data,
					};
					// this.$store.commit('SALE_MAIN_SCREEN_ADD_MSG', { message });
				} 
				this.inputValue = '';
				this.$refs.uniText.textvalue = '';
				this.imgArr = [];
				this.showUpload = false;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSearch() {
			const screen = this.$refs.screen;
			if (!this.keyword && !this.time && !this.staff) {
				// screen.isEnd = false;
				// 继续socket
				this.$store.commit('SALE_MAIN_SCREEN_CAN_SOCKET', { bool: true });
				screen.$refs.scroll.addEventListener('scroll', screen.handleScrollLoad);
			} else { 
				// 请求数据时 忽略socket数据
				this.$store.commit('SALE_MAIN_SCREEN_CAN_SOCKET', { bool: false });
			}
			this.$store.commit('SALE_MAIN_SCREEN_INIT');
			screen.page = 1;
			screen.handleScreenData().then(res => {
				screen.isLoading = false;
			}).catch(console.error);
		},
		handleChange(arr) {
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleStaffChange(staff = {}) {
			this.staff = staff.value || '';
			this.staff_label = staff.label || '';
		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_label || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		}
	},
};
</script>

<style lang="scss">
	.v-content-interaction {
		// 修改iview样式
		height: 100%;
		// overflow-x: scroll;
    min-width: 1000px;
		._toolkit {
			width: 100%;
			height: 50px;
			line-height: 50px;
			bottom: 0px;
			left: 0px;
			background-color: #f5f5f6;
			border-bottom: 5px;
		}
		._write {
			width: 100%;
			text-align: left;
			border-radius: 5px;
			border-radius: 5px;
			box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);

			// 修改iview样式
			.ivu-input {
			border: none;
			border-radius: 5px;
			box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
			.ivu-input:focus {
			outline: none;
			box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
			border: none!important;
		}
		.ivu-input:focus, .ivu-input:hover {
			border-color: #dcdee2;
			box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
			border: none;
		}
		}
		}
		._tip {
			color: #bbb;
			right: 10px;
			bottom: 55px;
		}
		._img {
			font-size: 25px;
			cursor: pointer;
		}
		._submit {
			right: 10px;
		}
		._point {
			margin: 0 20px 2px 10px;
			cursor: pointer;
		}
		._upload {
			position: absolute;
			bottom: -108px;
			height: 118px;
			left: 15px;
			z-index: 99;
			width: 540px;
			padding: 0 20px;
			background-color: #fff;
			border-radius: 5px;
		}
		._right {
			width: 55%;
			flex: 1;
			margin-left: 25px;
		}
		._short {
			width: 220px!important;
		}
		._role {
			display: inline-block;
			margin-top: 5px;
			margin-bottom: 10px;
			width: 325px;
		}
		.ivu-select-multiple .ivu-select-selection {
		max-height: 100px;
		overflow-y: scroll;
		}
		.vcp-imgs-picker {
			// >>> /deep/ 支持chrome firfox
			>>> .__normal {
				width: 72px!important;
				height: 72px!important;
				border-radius: 0!important;
				margin-bottom: 5px;
				.__img {
					width: 70px;
					height: 70px;
					border: 1px solid #d9d9d9;

				}
			}
			>>> .__item {
				padding: 0!important;
			}
			>>> .__upload {
				border: 1px solid #d9d9d9
			}
		}
		.vcp-imgs-picker {
			/deep/ .__normal {
				width: 72px!important;
				height: 72px!important;
				border-radius: 0!important;
				margin-bottom: 5px;
				.__img {
					width: 70px;
					height: 70px;
				}
			}
			/deep/ .__item {
				padding: 0!important;
			}
			/deep/ .__upload {
				border: 1px solid #d9d9d9
			}
		}
		._sale-screen {
			>>> .v-sale-screen {
			width: 100%;
			height: 98%;
			>>> ._scroll {
				height: 720px;
			}
		}
			min-width: 600px;
		}
		._sale-screen {
			/deep/ .v-sale-screen {
			width: 100%;
			height: 98%;
			/deep/ ._scroll {
				height: 720px;
			}
		}
			min-width: 600px;
		}
	}
</style>
