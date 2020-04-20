<template>
	<div class="v-worksheet-control-project-detail g-m-20">
		<div class="g-flex g-jc-fe g-m-b-20">
			<i-button class="g-m-r-10 _btn" @click="handleEdit">编辑</i-button>
			<i-select
				ref="my-select"
				clearable
				transfer
				placeholder="更多功能"
				class="_more"
				style="width: 90px;"
				@on-change="handleMoreChange"
			>
				<i-option v-if="project.status === 1" value="handleClose">关闭</i-option>
				<i-option v-else value="handleStart">开启</i-option>
				<i-option value="handleDel">删除</i-option>
			</i-select>
		</div>
		<div class="g-m-b-20 _info">
			<div class="g-flex g-jc-sb g-pd-10 g-pointer __top" @click="handleToggle('project_expand')">
				<span class="g-fs-14" style="color: #4B4F57;">项目信息</span>
				<i 
					:class="show_project ? 'icon-triangle-down' : 'icon-triangle-up'" 
					class="iconfont g-fs-10"
					style="color: #666;"
				/>
			</div>
			<vc-expand
				ref="project_expand"
				v-model="show_project"
			>
				<div class="g-fs-12 g-lh-30 g-pd-lr-20 g-pd-t-10">
					<span class="g-c-black4 g-inline-block g-tr" style="width: 70px">项目名称：</span>
					<span>{{ project.system_name || '--' }}</span>
				</div>
				<div class="g-fs-12 g-lh-30 g-pd-lr-20">
					<span class="g-c-black4 g-inline-block g-tr" style="width: 70px">项目状态：</span>
					<span>{{ ['未关闭','已关闭'][+project.status - 1] || '--' }}</span>
				</div>
				<div class="g-fs-12 g-lh-30 g-pd-lr-20 g-flex">
					<span class="g-c-black4 g-inline-block g-tr" style="width: 70px">产品描述：</span>
					<span class="g-inline-block" style="width: 80%;">
						{{ project.describe || '--' }}
					</span>
				</div>
				<div class="g-flex g-fs-12 g-lh-30 g-pd-lr-20 g-pd-tb-10">
					<span class="g-c-black4 g-inline-block g-tr" style="width: 70px">模块：</span>
					<oa-projects :data-source="project.module" :disabled="true" />
				</div>
			</vc-expand>
		</div>
		<div class="g-m-b-20 _info">
			<div class="g-flex g-jc-sb g-pd-10 g-pointer __top" @click="handleToggle('opt_log_expand')">
				<span class="g-fs-14" style="color: #4B4F57;">操作日志</span>
				<i 
					:class="show_opt_log ? 'icon-triangle-down' : 'icon-triangle-up'" 
					class="iconfont g-fs-10"
					style="color: #666;"
				/>
			</div>
			<vc-expand
				ref="opt_log_expand"
				v-model="show_opt_log"
				class="g-pd-tb-10"
			>
				<div 
					v-for="(item, index) in logs" 
					:key="index" 
					class="g-c-black2 g-fs-12 g-lh-30 g-pd-lr-20"
				>
					<span>{{ item.create_time }}</span>
					<span>{{ item.content }}</span>
				</div>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import { Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { Confirm } from '@components/_common/confirm/confirm';
import Projects from "../control-project-add/_common/projects";
import { worksheetProjectClose } from "../control-project/popup/project-close";

export default {
	name: 'oa-tpl',
	components: {
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand,
		'oa-projects': Projects
	},
	data() {
		return {
			show_project: true,
			show_opt_log: true,
			project: {},
			logs: {}
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			const { query = {} } = this.$route;
			this.$request({
				url: '_WORKSHEET_CONTROL_PROJECT_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					system_id: query.system_id
				},
				autoTip: false
			}).then(res => {
				this.project = res.data.project;
				this.logs = res.data.logs;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleToggle(value) {
			this.$refs[value].toggle();
		},
		handleClose() {
			const { query = {} } = this.$route;
			worksheetProjectClose.popup({
				systemId: query.system_id,
				status: 2
			}).then(() => {
				this.loadData();
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleStart() {
			const { query = {} } = this.$route;
			worksheetProjectClose.popup({
				systemId: query.system_id,
				status: 1
			}).then(() => {
				this.loadData();
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleEdit() {
			const { query = {} } = this.$route;
			this.$router.push({
				path: '/worksheet/control/project/add',
				query: {
					action: 'update',
					system_id: query.system_id
				}
			});
		},
		handleDel() {
			const { query = {} } = this.$route;
			Confirm.popup({
				title: "删除提示",
				msg: "是否确认删除该项目，删除后，该项目下所有模块数据将都会被删除",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_WORKSHEET_CONTROL_PROJECT_DEL_POST',
					type: 'POST',
					loading: false,
					param: {
						system_id: query.system_id
					},
					autoTip: true
				}).then(res => {
					this.$router.back();
				}).catch(err => {});
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleMoreChange(method) {
			if (method) {
				this[method]();
			}
			this.$refs["my-select"].clearSingleSelect();
		}
	},
};
</script>

<style lang="scss">
.v-worksheet-control-project-detail {
	._btn {
		border-color: #e84854;
		color: #e84854;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
	._more {
		.ivu-select-selection {
			border-color: #e84854;
			color: #e84854;
		}
		.ivu-select-placeholder {
			color: #e84854!important;
		}
		.ivu-icon-ios-arrow-down:before {
			color: #e84854!important;
		}
	}
	._info {
		border: 1px solid #E8E8E8;
		border-radius: 4px;
		.__top {
			background: #F8F8F8;
		}
	}
}
</style>
