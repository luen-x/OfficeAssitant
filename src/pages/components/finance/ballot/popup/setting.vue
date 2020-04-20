<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			class="v-hr-system-assess-up-add-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">审核设置</div>
			<i-form
				ref="form"
				:model="formdata"
				:rules="validator"
				:label-width="80"
				style="marginTop: 14px">
				<div
					v-for="(item, index) of formdata.data"
					:key="index"
					class="g-flex g-jc-sb g-ai-c g-m-b-20 _actived g-pd-tb-20">
					<div>
						<i-formitem
							:prop="`data.${index}.staff_ids`"
							:rules="validator.staff_id"
							label="审核人:"
						>
							<i-select
								v-model="item.staff_ids"
								multiple
								transfer
								style="width: 220px"
								placeholder="请选择审核人"
								clearable
							>
								<i-option
									v-for="item of staffArr"
									:value="item.staff_id"
									:key="item.staff_id">{{ item.staff_name }}</i-option>
							</i-select>
						</i-formitem>
						<i-formitem
							:prop="`data.${index}.company_ids`"
							:rules="validator.contract_company_id"
							label="审核公司:"
							class="g-m-t-20"
						>
							<i-select
								v-model="item.company_ids"
								multiple
								transfer
								style="width: 220px"
								placeholder="请选择审核公司"
								clearable
							>
								<i-option
									v-for="item of companyArr"
									:value="item.contract_company_id"
									:key="item.contract_company_id">{{ item.company_name }}</i-option>
							</i-select>
						</i-formitem>
					</div>
					<div class="g-flex g-m-r-10">
						<i
							v-if="formdata.data.length > 1"
							class="icon iconfont icon-remove-circle g-m-t-5 g-m-lr-5"
							style="font-size: 16px; color: #E74854"
							@click="() => handleItemDel(index)"
						/>
						<i
							v-if="(index === formdata.data.length - 1) && formdata.data.length < 10"
							class="icon iconfont icon-add1 g-m-t-5 g-m-l-5"
							style="font-size: 16px; color: #2296f9"
							@click="handleItemAdd"
						/>
					</div>
				</div>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Button, Form, FormItem, Select, Input, InputNumber, Option, Row, Col } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import TextArea from '@components/_common/limit-words/limit-words';
import lodash from "lodash";


export default {
	name: 'hr-system-assess-up-job',
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
		'oa-textarea': TextArea
	},
	props: {
		name: String,
		depart_id: Number,
		position_info: Object
	},
	data() {
		return {
			visible: false,
			formdata: {
				data: [{}]
			},
			staffArr: [],
			companyArr: [],
			validator: {
				staff_id: [
					{ required: true, type: 'array', message: '请选择审核人', trigger: 'change' }
				],
				contract_company_id: [
					{ required: true, type: 'array', message: '请选择审核公司', trigger: 'change' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadStaff();
		this.loadCompany();
		this.loadInfo();
	},
	methods: {
		handleItemDel(index) {
			this.formdata.data.splice(index, 1);
		},
		handleItemAdd() {
			this.formdata.data.push({});
		},
		loadStaff() {
			this.$request({
				url: '_FINANCE_BALLOT_STAFFS_GET',
				type: 'GET',
				param: {
					depart_name: 'finance'
				},
				loading: false
			}).then(res => {
				this.staffArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadCompany() {
			this.$request({
				url: '_FINANCE_BALLOT_COMPANYS_GET',
				type: 'GET',
				param: {
				},
				loading: false
			}).then(res => {
				this.companyArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadInfo() {
			this.$request({
				url: '_FINANCE_BALLOT_SETTING_INFO_GET',
				type: 'GET',
				param: {
					type: 1
				},
				loading: false
			}).then(res => {
				this.formdata.data = res.data;
			}).catch(err => {
			});
		},
		handleOk() {
			this.$refs['form'].validateAndScroll((item) => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$request({
						url: 'FINANCE_BALLOT_SETTING_INFO_POST',
						type: 'POST',
						param: {
							...this.formdata,
							type: 1
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
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const SettingModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-system-assess-up-add-modal {
	._actived {
		border-radius: 4px;
		background-color: #F8F8F8;
	}
	.ivu-form-item {
		margin-bottom: 0 !important;
	}
	.ivu-modal-body {
		max-height: 500px;
		overflow: auto;
	}		
}
</style>


