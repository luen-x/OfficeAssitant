<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="选择素材"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-input
			v-model="keyword"
			placeholder="请输入素材名称或素材提供人"
			style="width: 220px"
		/>
		<i-select class="g-m-l-5" style="width: 220px" placeholder="请选择素材类型">
			<i-option value="1">选择素材</i-option>
			<i-option value="2">选择素材</i-option>
		</i-select>
		<i-select class="g-m-l-5" style="width: 220px" placeholder="请选择素材类型">
			<i-option value="1">选择素材</i-option>
			<i-option value="2">选择素材</i-option>
		</i-select>
		<i-button
			type="primary"
			class="g-m-l-5"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<i-table ref="selection" :columns="columns" :data="data" class="g-m-t-20"/>
		<i-page :total="100" show-sizer show-elevator/>
		<div slot="footer">
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Form, FormItem, Icon, Button, Input, Select, Option, DatePicker, Table, Page } from 'iview';
import { CreatePortal, CreateCustomer, ImgsPicker } from 'wya-vc';
import { debounce } from 'lodash';

const Content = CreateCustomer({
});
export default {
	name: "v-choose-material",
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-modal': Modal,
		'i-icon': Icon,
		'i-button': Button,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-table': Table,
		'i-page': Page,
		'i-date-picker': DatePicker,
		'vc-imgs-picker': ImgsPicker,
		'oa-content': Content
	},
	data() {
		return {
			visible: false,
			formData: {},
			 columns: [
				{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '素材名称',
					key: 'name'
				},
				{
					title: '素材类型',
					key: 'age'
				},
				{
					title: '素材提供人',
					key: 'address'
				},
				{
					title: '类目名称',
					key: 'address'
				}
			],
			data: [
				{
					name: 'John Brown',
					age: 18,
					address: 'New York No. 1 Lake Park',
					date: '2016-10-03'
				},
				{
					name: 'Jim Green',
					age: 24,
					address: 'London No. 1 Lake Park',
					date: '2016-10-01'
				},
				{
					name: 'Joe Black',
					age: 30,
					address: 'Sydney No. 1 Lake Park',
					date: '2016-10-02'
				},
				{
					name: 'Jon Snow',
					age: 26,
					address: 'Ottawa No. 2 Lake Park',
					date: '2016-10-04'
				}
			]
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk: debounce(function () {
			this.visible = false;
			this.$emit('sure', 1);
		}, 200),
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);
		},
		handleError(err) {
			this.$Message.error(err.msg);
		}
	}
};
export const ChooseMaterial = CreatePortal({}, module.exports.default);
</script>
