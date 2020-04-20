<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="680px" 
		class="v-collage-choose-process-docker"
	>
		<div slot="header" class="g-tc">
			<span>{{ title }}</span>
		</div>

		<div style="height:540px">
			<div 
				class="g-lh-42"
				style="padding-top:3px;padding-bottom:7px;"
			>
				<i-input
					v-model.trim="keywords.search"
					clearable
					placeholder="请输入姓名"
					style="width:300px;height:32px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button type="primary" @click="handleSearch">搜索</i-button>
			</div>
			<i-tabs 
				:value="type" 
				:animated="false"
				type="card" 
				class="g-m-t-10 g-tabs-card"
				@on-click="handleChange"
			>
				<i-tab-pane 
					v-for="(item, index) in tabs"
					:key="item.value"
					:label="item.label" 
					:name="item.value"
				>
					<i-radio-group v-model="selected" style="width: 650px;padding-right: 2px;">
						<vc-paging
							:ref="index === 0 ? 'tableTarget' : 'tableRecord'"
							:show="item.value == type && showList" 
							:columns="getColumns(item.value)"
							:data-source="listInfo[item.value].data"
							:total="listInfo[item.value].total"
							:reset="listInfo[item.value].reset"
							:history="false"
							:load-data="loadData"
							:footer="!inLoading"
							:table-opts="{height: tableHeight}"
							:page-opts="{
								showTotal: true,
								showSizer: true,
								showElevator: false,
								placement: 'top',
								pageSizeOpts: [10, 20, 30]
							}"
							mode="table"
							@page-change="handlePageChange"
							@page-size-change="handleChangePageSize"
							@row-click="handleRowClick"
						/>
					</i-radio-group>
				</i-tab-pane>
			</i-tabs>
		</div>
		<div slot="footer">
			<i-button size="large" type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" size="large" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Tabs, TabPane, Button, Input, RadioGroup } from 'iview';
import { Paging, CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import orderModal from '@extends/mixins/orderModal';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { setTimeout } from 'timers';
import columns from './mixins/columns';

export default {
	name: "oa-choose-process-docker",
	components: {
		'i-modal': Modal,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		'i-button': Button,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'vc-paging': Paging,
	},
	mixins: [
		orderModal,
		columns
	],
	props: {
		title: String,
		productName: String,
		roleType: [String, Number],
		assignId: [String, Number],
		projectId: [String, Number]
	},
	data() {
		return {
			visible: false,
			inLoading: false,
			firstLoad: true,
			showList: false,
			page: 1,
			selected: '',
			type: '1',
			keywords: {
				search: ''
			},
			tabs: [
				{ label: "分配人员", value: "1" },
				{ label: "分配记录", value: "2" }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.collageProcessDocker.listInfo;
		},
		tableHeight() {
			if (this.listInfo[this.type].data[this.page] && this.listInfo[this.type].data[this.page].length > 9) {
				return 400;
			} else {
				return undefined;
			}
		},
	},
	mounted() {
		this.visible = true;
		if (this.listInfo[this.type].data[this.page]) {
			this.$store.commit('COLLAGE_PROCESS_DOCKER_LIST_INIT');
		}
		setTimeout(() => {
			this.showList = true;
		});
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(page, pageSize) {
			if (this.type == '1') {
				return this.loadPersonData(page, pageSize);
			} else {
				return this.loadRecordData(page, pageSize);
			}
		},
		loadPersonData(page, pageSize) {
			this.inLoading = true;
			return this.request({
				url: '_COLLAGE_BUSINESS_STAFF_LIST_GET',
				redirect: 'COLLAGE_PROCESS_DOCKER_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...this.keywords,
					type: this.type,
					assign_id: this.assignId,
					role_type: this.roleType,
					project_id: this.projectId,
					page,
					pageSize
				}
			}).then((res) => {
				if (this.firstLoad) {
					this.firstLoad = false;
					this.selected = +res.data.checked[0];
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			}).finally(() => {
				this.inLoading = false;
			});
		},
		loadRecordData(page, pageSize) {
			this.inLoading = true;
			return this.request({
				url: '_COLLAGE_BUSINESS_ASSIGN_RECORD_GET',
				redirect: 'COLLAGE_PROCESS_DOCKER_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...this.keywords,
					type: this.type,
					product_name: this.productName,
					page,
					pageSize
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			}).finally(() => {
				this.inLoading = false;
			});
		},
		getColumns(type) {
			if (type == '1') {
				return this.dockerColumns; 
			} else {
				return this.recordColumns;
			}
		},
		handlePageChange(page) {
			this.popContent = {};
			this.page = page;
		},
		handleChangePageSize() {
			this.popContent = {};
			this.$store.commit('COLLAGE_PROCESS_DOCKER_LIST_INIT');
		},
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 切换tab
		 */
		handleChange(type) {
			this.popContent = {};
			this.page = 1;
			this.type = type;
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.popContent = {};
			this.$store.commit('COLLAGE_PROCESS_DOCKER_LIST_INIT');
		}, 300),
		/**
		 * 点击确定
		 */
		handleOk() {
			this.visible = false;
			this.$emit('sure', {
				staff_id: this.selected
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleRowClick(row, index) {
			if (this.selected === row.staff_id) {
				this.selected = '';
			} else {
				this.selected = row.staff_id;
			}
		}
	}
};

export const ChooseProcessDocker = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-collage-choose-process-docker {
	.vc-paging {
		margin-bottom: 0px;
		.__footer {
			position: relative;
			width: auto !important ; 		
			box-shadow: none;
			border-top: none;
			padding-left: 28px !important;
		}
		
		.ivu-table {
			.ivu-table-fixed-header {
				.ivu-checkbox-wrapper {
					display: none;
				}
			}
		}
		.ivu-table-cell {
			white-space: nowrap;
		}
	}
	.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
		border-radius: 0;
	}
	.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab:nth-child(2) {
		border-radius: 4px 0 0 0!important;
	}
	.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab:last-child {
		border-radius: 0 4px 0 0!important;
	}
}
</style>

