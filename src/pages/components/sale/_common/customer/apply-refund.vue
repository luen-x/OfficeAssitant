<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:title="data.title"
		:mask-closable="false"
		class="v-sale-apply-refund"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rule"
			:label-width="90"
			class="g-pd-l-30"
		>
			<i-form-item label="退款金额：" prop="refund_amount">
				<i-input-number
					v-model="formData.refund_amount"
					:min="0"
					:max="20000000"
					presicion
					placeholder="请输入退款金额"
					style="width: 220px"
				/>
				<i-poptip 
					v-if="data.refund_type ==2"
					ref="know"
					width="300" 
					class="_konw-tip" 
					placement="right"
					popper-class="v-sale-customer-deal-contract-order-poptip"
					title="退款金额"
					content="填写被换产品的标准价或者换后产品的价格或够扣除新产品的成本；若客户补钱换新产品，退款的金额和补款进行够下新产品即可，具体更换新产品可以退款多少由财务确认"
					transfer
					word-wrap
				>
					<i class="icon iconfont icon-info g-pointer g-fs-14 g-c-blue-mid"/>
					
				</i-poptip>

			</i-form-item>
			<i-form-item key="refund_project_id" :label="config[data.refund_type].refund_project_id.label" prop="refund_project_id">
				<i-select
					v-model="formData.refund_project_id"
					:placeholder="config[data.refund_type].refund_project_id.placeholder" 
					transfer
					multiple 
					class="g-m-r-10"
					style="width: 220px"
				>
					<i-option
						v-for="(item,index) in projects"
						:key="index"
						:value="item.project_id"
					>{{ item.product_name }}</i-option>
				</i-select>
			</i-form-item>
			
			
			<i-form-item v-if="formData.refund_type ===2" key="after_product_ids" label="换后产品：" prop="after_product_ids">
				<i-select
					ref="select"
					v-model="formData.after_product_ids"
					:remote-method="handleSearch"
					:loading="searchLoading"
					transfer
					multiple
					filterable
					remote
					class="g-m-r-10"
					style="width: 220px"
					placeholder="输入产品名称搜索"
					@on-change="handleAfterProductChange"
				>
					<i-option
						v-for="(item,index) in productList"
						:key="index"
						:value="item.product_id"
					>
						{{ item.product_name }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item class="_refund_reason_ids" label="退款原因：" prop="refund_reason_ids">
				<oa-tree-select-check
					ref="treeSelectCheck"
					v-model="formData.refund_reason_ids"
					:data="refundReasonTree"
					:width="220"
					:max-width="220"
					placeholder="请选择退款原因"
				/>
			</i-form-item>
			<i-form-item :label="config[data.refund_type].remark.label" prop="remark" class="_remark">
				<oa-limit-words
					v-model="formData.remark"
					:max="200"
					:placeholder="config[data.refund_type].remark.placeholder"
					width="220px"
				/>
			</i-form-item>
			
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, InputNumber, Button, Select, Option, Poptip } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from '@stores/apis/root';
import LimitWords from "@components/_common/limit-words/limit-words";
import { Confirm } from '@common/confirm/confirm';
import orderModal from '@extends/mixins/orderModal';
import { services } from '@stores/services/sale';
import { debounce } from 'lodash';
import TreeSelectCheck from '@components/_common/tree-select-check/tree-select-check';


const config = {
	1: {
		refund_project_id: {
			label: '退款产品：',
			placeholder: '请选择退款产品'
		},
		remark: {
			label: "备注说明",
			placeholder: "请描述直接导致客户退款的某一件或某几件事情"
		}

	},
	2: {
		refund_project_id: {
			label: '被换产品：',
			placeholder: '请选择被换产品'
		},
		remark: {
			label: "更换理由：",
			placeholder: "请输入更换产品理由"

		}


	}
};

// 退款类型  1 产品退款 2 换产品退款 3 余额退款 

export default {
	name: "oa-sale-add-conatct",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
		'i-poptip': Poptip,
		'oa-limit-words': LimitWords,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		'oa-tree-select-check': TreeSelectCheck,
	},
	mixins: [orderModal, services.refundReasonTree()],
	props: {
		data: Object,
		/**
		 * 
		 * // {
		 * 	title,
		 * 	contract_company_id,
		 * 	refund_id (编辑才会有),
		 * 	contract_id, 
		 * 	refund_type,
		 * 	action,
		 * 	original_refund_id，
		 * }
		 *  */ 
		
	},
	data() {
		return {
			visible: false,
			searchLoading: false,
			config,
			projects: [],
			productList: [], // 搜索到的产品
			formData: {
				refund_id: this.data.action == 'update' ? this.data.refund_id : '', // 退款ID 编辑必选参数
				refund_type: this.data.refund_type || 1, // 退款类型  1 产品退款 2 换产品退款 3 余额退款 (这里不会有3)
				contract_id: this.data.contract_id, // 退款的合同ID
				contract_company_id: this.data.contract_company_id, // 合同公司ID 余额退款/合同退款必选参数 refund_type=2
				original_refund_id: this.data.action == 'readd' ? this.data.refund_id : "",
				payment_id: '', // 余额退款到账记录ID(此处为空)
				refund_mode: '', // 退款种类 1录错 2走账 3实际退款(余额退款才有此处为空)

				refund_amount: null, // 退款金额
				after_product_ids: [], // 换后产品 ID
				refund_project_id: [], // 退款的项目ID
				remark: "", // 退款事由 和其他说明
				refund_reason_ids: []
			},
			rule: {
				refund_amount: [{ required: true, type: "number", message: '请填写退款金额', trigger: 'blur' }],
				refund_project_id: [{ 
					required: true, 
					type: "array", 
					message: config[this.data.refund_type].refund_project_id.placeholder, 
					trigger: 'change'
				}],
				after_product_ids: [{ required: true, type: "array", message: '选择换后产品', trigger: 'change' }],
				remark: [{ required: true, type: "string", message: config[this.data.refund_type].remark.placeholder, trigger: 'blur' }],
				refund_reason_ids: [
					{ required: true, type: "array", message: '请选择退款原因', trigger: 'change' },
					{ validator: this.refundReasonValidator, trigger: 'change' }
				],
				
			}
		};
	},
	created() {
		this.loadProject();
		if (this.data.refund_id) {
			this.loadRefundDetail();
		}
	},
	mounted() {
		this.visible = true;
		setTimeout(() => {
			if (this.$refs.know) this.$refs.know.visible = true;
			
		}, 200);
			
	},
	methods: {
		handleOk(data) {
			this.visible = false;
			this.$emit('sure', data);
		},
		handleCancel() {
			 this.visible = false;
			this.$emit('close');
		},
		handleSearch: debounce(function (search) {
			
			this.searchLoading = true;
			this.$request({
				url: '_SALE_PRODUCT_LIST_GET',
				type: "GET",
				loading: false,
				param: {
					search,
				}
			}).then(res => {
				this.searchLoading = false;
				const curList = this.productList.filter(pro => this.formData.after_product_ids.includes(pro.product_id));
				const otherList = res.data.filter(pro => !this.formData.after_product_ids.includes(pro.product_id));
				this.productList = [...curList, ...otherList];
			}).catch(res => {
				this.searchLoading = false;
				console.error(res);
			});
			this.$refs.select.$children[0].resetInputState();
		}, 300),
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					const checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
					const refund_reason_ids = checkedTags.filter(ele => typeof ele.value == 'number').map(i => i.value);
					
					this.$request({
						url: this.data.action == "update" ? API._SALE_REFUND_UPDATE_POST : API._SALE_REFUND_SAVE_POST,
						type: "POST",
						loading: false,
						param: {
							...this.formData,
							refund_reason_ids
						}
					}).then(res => {
						if (this.data.refund_type == 1) {
							this.$Message.success(res.msg);

							this.handleOk({ refund_id: res.data.refund_id });
						} else {
							Confirm.popup({
								status: 'success',
								msg: '更换产品退款申请已提交，审核通过后，请重新下单换后产品，合同类型选择更换产品！',
								cancelText: '',
								okText: "知道了"
							}).catch((err) => err && console.error(err)).finally(() => {
								this.handleOk({ refund_id: res.data.refund_id });
							});
						}
					}).catch(res => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(res.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}

			});

		},
		loadRefundDetail() {
			this.$request({
				url: "_SAEL_REFUND_DETAIL_GET",
				type: "GET",
				param: { refund_id: this.data.refund_id },
				loading: false,
			}).then(res => {
				const { real_refund_amount, remark, project_id, after_product_ids, after_product, project, refund_reason_ids } = res.data.base_info;
				after_product.forEach(item => {
					item.product_id = +item.product_id;
					
				});
				this.formData.refund_amount = parseFloat(real_refund_amount);
				this.formData.remark = remark;
				this.formData.refund_project_id = project_id;
				this.formData.after_product_ids = after_product_ids;
				this.formData.refund_reason_ids = refund_reason_ids || [];
				this.productList = after_product;
				
				this.addProjects(project);


			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		loadProject() {
			this.$request({
				url: "_SALE_SUPPLEMENT_PROJECT_INFO_GET",
				type: "GET",
				param: {
					contract_id: this.data.contract_id,
					invalid: 1
				},
				loading: false,
			}).then(res => {
				const projects = res.data.project.map(pro => ({ 
					project_id: pro.project_id, 
					product_name: pro.product_name 
				}));
				this.addProjects(projects);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
			
		},
		handleAfterProductChange() {
			if (this.formData.after_product_ids.length > 5) {
				this.formData.after_product_ids.pop();
			}
		},
		addProjects(projects) {
			projects.forEach(pro => {
				if (!this.projects.find(p => p.project_id == pro.project_id)) {
					this.projects.push(pro);
				}
			});
		},
		refundReasonValidator(rule, value, callback) {
			const checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
			const refund_reason_ids = checkedTags.filter(ele => typeof ele.value == 'number').map(i => i.value);
			if (refund_reason_ids.length == 0) {
				callback('请选择退款原因');
			} else if (refund_reason_ids.length > 3) {
				callback("最多选择3个退款原因，请重新选择");
			} else callback();

		}
	}
		
};

export const ApplyRefund = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-apply-refund {
	._refund_reason_ids {
		.ivu-form-item-content {
			line-height: 12px !important;
		}
	}
	._remark {
		.ivu-form-item-error-tip {
			width: 180px;
		}

	}

}

</style>

