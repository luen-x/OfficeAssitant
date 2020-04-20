<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			class="v-hr-system-assess-up-add-relation-modal"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">{{ relation_info ? "关系编辑" : "新增关系" }}</div>
			<i-form 
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="80" 
				style="marginTop: 14px">
				<i-formitem prop="full_name" label="晋升全称:">
					<i-input 
						v-model="formdata.full_name"
						:maxlength="30"
						style="width: 220px"
						placeholder="请输入晋升全称"
					/>
				</i-formitem>
				<i-formitem prop="abbreviation" label="晋升简称:">
					<i-input 
						v-model="formdata.abbreviation"
						:maxlength="10"
						style="width: 220px"
						placeholder="请输入晋升简称"
					/>
				</i-formitem>
				<i-formitem
					v-for="(item, index) of formdata.relate"
					:key="index"
					:prop="`relate.${index}.before_position_id`" 
					:rules="validator.before_position_id"
					style="marginBottom: 13px !important"
					label="原职位:">
					<div class="g-flex g-ai-c">
						<i-select
							v-model="item.before_position_id"
							style="width: 220px"
							transfer
							placeholder="请选择原职位"
						>
							<i-option 
								v-for="item of jobArr" 
								:key="item.position_id" 
								:value="item.position_id">{{ item.position_name }}</i-option>
						</i-select>
						<div class="g-flex">
							<i 
								v-if="index > 0"
								class="icon iconfont icon-remove-circle g-m-t-5 g-m-lr-5" 
								style="font-size: 16px; color: #E74854"
								@click="() => handleItemDel(index)"
							/>
							<i 
								v-if="index === formdata.relate.length - 1"
								class="icon iconfont icon-add1 g-m-t-5 g-m-l-5" 
								style="font-size: 16px; color: #2296f9"
								@click="handleItemAdd"
							/>
						</div>
					</div>
					<i-checkbox 
						v-model="item.is_auto_add"
						:true-value="1"
						:false-value="0"
					>自动添加</i-checkbox>
				</i-formitem>
				<i-formitem prop="promotion_position_id" label="晋升职位:">
					<i-select
						v-model="formdata.promotion_position_id"
						style="width: 220px"
						transfer
						placeholder="请选择晋升职位"
					>
						<i-option 
							v-for="item of jobArr" 
							:key="item.position_id" 
							:value="item.position_id">{{ item.position_name }}</i-option>
					</i-select>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Button, Form, FormItem, 
	Select, Input, InputNumber, Option, Row, Col, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import TextArea from '@components/_common/limit-words/limit-words';
import lodash from "lodash";

export default {
	name: 'hr-system-assess-up-relation',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-row': Row,
		'i-col': Col,
		'i-button': Button,
		'i-checkbox': Checkbox,
		'oa-textarea': TextArea
	},
	props: {
		name: String,
		depart_id: Number,
		relation_info: Object
	},
	data() {
		return {
			visible: false,
			formdata: this.relation_info || {
				relate: [{}]
			},
			jobArr: [],
			validator: {
				full_name: [
					{ required: true, message: '请输入晋升全称', trigger: 'blur' }
				],
				abbreviation: [
					{ required: true, message: '请输入晋升简称', trigger: 'blur' }
				],
				before_position_id: [
					{ required: true, type: 'number', message: '请选择原职位', trigger: 'blur' }
				],
				promotion_position_id: [
					{ required: true, type: 'number', message: '请选择晋升职位', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadJob();
	},
	methods: {
		handleItemDel(index) {
			this.formdata.relate.splice(index, 1);
		},
		handleItemAdd() {
			this.formdata.relate.push({});
		},
		handleOk: lodash.debounce(function (event) {
			this.$refs['form'].validateAndScroll((item) => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$request({
						url: '_HR_SYSTEM_ASSESS_PROSYSTEM_ADD_POST',
						type: 'POST',
						param: { 
							...this.formdata,
							depart_id: this.depart_id
						},
						loading: false
					}).then((res) => {
						this.$Message.success(res.msg);
						this.$emit('sure');		
					}).catch((err) => {
						this.$Message.error(err.msg);						
					});
				}
			});
		}, 300),
		loadJob() {
			this.$request({
				url: 'HR_POSITION_LIST_GET',
				type: 'GET',
				param: {
					depart_id: this.depart_id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.jobArr = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
	}
};
export const RelationModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-system-assess-up-add-relation-modal {
	.ivu-modal-body {
		max-height: 500px;
		overflow: auto;
	}		
}
</style>


