<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:mask-closable="false"
		:loading="true"
		class="v-table-title"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			配置
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:rules="validator"
			:label-width="100"
			class="g-m-t-20">
			<!-- <i-formitem label="政委" prop="staff_id">
				<i-select
					v-model="formdata.staff_id"
					:remote-method="loadStaff"
					:loading="staffLoading"
					filterable
					remote
					style="width: 220px"
					placeholder="请输入政委姓名搜索"
				>
					<i-option 
						v-for="(option, index) in staffData" 
						:value="option.value" 
						:key="index">{{ option.label }}</i-option>
				</i-select>
			</i-formitem> -->
			<i-formitem prop="depart_id" label="战区:">
				<i-select
					v-model="formdata.depart_id"
					style="width: 220px"
					placeholder="请选择战区"
				>
					<i-option 
						v-for="item of departArr" 
						:key="item.depart_id" 
						:value="item.depart_id">{{ item.depart_name }}</i-option>
				</i-select>
			</i-formitem>
			<i-formitem prop="data_type" label="数据类型:">
				<i-select
					v-model="formdata.data_type"
					style="width: 220px"
					placeholder="请选择数据类型"
					@on-change="handleChangeType"
				>
					<i-option :value="1">员工</i-option>
					<i-option :value="2">经理</i-option>
				</i-select>
			</i-formitem>
		</i-form>
		<div>
			<div>
				<div class="g-m-l-10 g-m-b-10">
					<span style="color: #4b4f57">已选择</span>
					<span style="color: #818794">（可通过拖拽移动表头顺序）</span>
				</div>
				<vc-sort-list
					v-model="dataSource"
					:mask="false"
					value-key="key"
					draggable-key="is_optional"
				>
					<template slot-scope="it">
						<oa-show-title
							:data="it"
							style="cursor:move"
							@hide="(key) => handleEdit('dataSource', 'dataOther', key)"
						/>
					</template>
				</vc-sort-list>
			</div>
			<i-divider />
			<div class="g-pd-t-10">
				<div class="g-m-l-10 g-m-b-10" style="color: #4b4f57">未选择</div>
				<div class="g-flex g-fw-w">
					<oa-hide-title
						v-for="item of dataOther"
						:key="item.key"
						:data="item"
						@add="(key) => handleEdit('dataOther', 'dataSource', key)"
					/>
				</div>
			</div>
		</div>
	</i-modal>

</template>

<script>
import { Modal, Button, Divider, Form, FormItem, Select, Option, Input } from 'iview';
import { CreatePortal, SortList } from 'wya-vc';
import { debounce } from 'lodash';
import DefaultTitle from '@components/_common/table-title/show-default-title';
import ShowTitle from '@components/_common/table-title/show-title';
import HideTitle from '@components/_common/table-title/hide-title';
import { searchStaff } from '@stores/services/hr';

const initData = [
	{
		"value": "加微信客户",
		"key": 1
	},
	{
		"value": "维护客户",
		"key": 2
	},
	{
		"value": "维护出来客户",
		"key": 3
	},
	{
		"value": "约见客户",
		"key": 4
	},
	{
		"value": "绕前台",
		"key": 5
	}
];

const secondData = [
	{
		"value": "过客户",
		"key": 6
	},
	{
		"value": "过出来客户",
		"key": 7
	},
	{
		"value": "谈判客户",
		"key": 8
	},
	{
		"value": "分析客户",
		"key": 9
	}
];
export default {
	name: 'hr-assess-statistic-deploy-modal',
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-divider': Divider,
		'vc-sort-list': SortList,
		'oa-default-title': DefaultTitle,
		'oa-show-title': ShowTitle,
		'oa-hide-title': HideTitle,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-form': Form,
		'i-formitem': FormItem
	},
	mixins: [searchStaff],
	props: {
		saveUrl: String, // 保存时请求的地址
		mutation: String, // 保存数据到vuex时的mutation
		type: { // 所在的tab的type
			type: String,
			default: '1'
		},
		data_conf_id: Number,
		scenario: Number // 保存数据时的场景
	},
	data() {
		return {
			visible: false,
			dataSource: [],
			dataOther: initData,
			formdata: {
			},
			validator: {
				depart_id: [
					{ required: true, type: 'number', message: '请选择战区', trigger: 'change' }
				],
				staff_id: [
					{ required: true, type: 'number', message: '请输入政委姓名', trigger: 'blur' }
				],
				data_type: [
					{ required: true, type: 'number', message: '请选择数据类型', trigger: 'change' }
				],
			},
			departArr: [],
			staffArr: [],
			initName: ""
		};
	},
	mounted() {
		this.visible = true;
		this.loadDepart();
		this.data_conf_id && this.loadData();
	},
	methods: {
		handleChangeType(val) {
			this.dataOther = val === 2 ? secondData : initData;
			this.dataSource = [];
		},
		loadData() {
			this.$request({
				url: '_HR_TRAIN_DATA_CONF_DETAIL_GET',
				type: 'GET',
				param: {
					data_conf_id: this.data_conf_id
				},
			}).then(res => {
				const { staff_name, selected_field, unselected_field, ...otherData } = res.data;
				this.formdata = otherData;
				this.initName = staff_name;
				this.dataSource = selected_field;
				this.dataOther = unselected_field;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadDepart() {
			this.$request({
				url: '_HR_DEPART_TWO_LEVEL_DEPART_GET',
				type: 'GET',
				noLoading: true
			}).then(res => {
				this.departArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleEdit(handeArr, targetArr, key) {
			const dataItem = this[handeArr].filter(item => item.key === key)[0];
			this[handeArr] = this[handeArr].filter(item => item.key !== key);
			this[targetArr].push(dataItem);
		},

		handleSave: debounce(function () {
			this.$refs.form.validate(valid => {
				this.$refs.modal.buttonLoading = false;
				if (valid) {
					this.request({
						url: 'HR_TRAIN_DATA_CONF_ADD_POST',
						type: 'POST',
						param: {
							...this.formdata,
							selected_field: this.dataSource.map(item => item.key),
							unselected_field: this.dataOther.map(item => item.key)
						}
					}).then(res => {
						this.$emit('sure');
						this.$store.commit('HR_SYSTEM_ASSESS_STATISTICS_LIST_INIT');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		}, 200)
	}
};

export const DeployModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-table-title{
	.vc-sort-list > div{
		cursor:auto
	}
}

</style>


