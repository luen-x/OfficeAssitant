<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="680px" 
		class="v-collage-transfer-customer"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>选择部门</span>
		</div>

		<div style="height:540px">
			<div 
				class="g-lh-42"
				style="padding-top:3px;padding-bottom:7px;"
			>
				<i-input
					v-model.trim="keywords.search"
					clearable
					placeholder="请输入部门或主管名字"
					style="width:300px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button type="primary" class="g-m-l-10" @click="handleSearch">搜索</i-button>
			</div>
			<i-radio-group 
				v-model="selected" 
				style="width: 650px;height: 500px;overflow: auto;"
			>
				<i-table 
					:columns="columns" 
					:data="list" 
					:loading="loading"
					@on-row-click="handleRowClick"
				/>
			</i-radio-group>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Input, Table, RadioGroup, Radio } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-transfer-customer",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-table': Table
	},
	mixins: [
		orderModal
	],
	props: {
		projectId: [String, Number]
	},
	data() {
		return {
			visible: false,
			loading: false,
			firstLoad: true,
			selected: '',
			list: [],
			keywords: {
				search: ''
			},
			columns: [
				{
					title: ' ',
					width: 60,
					fixed: "left",
					render: (h, { row }) => {
						return (
							<div onClick={() => window.event.stopPropagation()}>
								<Radio label={row.depart_id}>
									<span></span>
								</Radio>
							</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 120
				},
				{
					title: '主管',
					key: 'manager',
					minWidth: 120
				}
			]
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loading = true;
			this.$request({
				url: '_COLLAGE_BUSINESS_DEPART_LIST_GET',
				type: 'GET',
				param: {
					...this.keywords,
					project_id: this.projectId
				},
				autoTip: false
			}).then((res) => {
				this.list = res.data;
				if (this.firstLoad) {
					this.firstLoad = false;
					this.selected = +res.data.filter(it => it._checked === true)[0].depart_id;
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			}).finally(() => {
				this.loading = false;
			});
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
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.loadData();
		}, 300),
		/**
		 * 点击确定
		 */
		handleOk() {
			this.visible = false;
			this.$emit('sure', {
				depart_id: this.selected
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
			this.selected = row.depart_id;
		}
	}
};

export const TransferCustomer = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-collage-transfer-customer {
	.ivu-table-cell {
		white-space: nowrap;
	}
	.ivu-modal-body {
		overflow: hidden;
	}
}
</style>

