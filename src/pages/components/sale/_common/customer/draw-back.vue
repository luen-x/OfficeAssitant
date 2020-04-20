<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		class-name="v-sale-customer-draw-back"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rule"
			:label-width="83"
			class="g-pd-l-20"
		>
			<div v-if="mode=='drawBack'" class="g-c-black3 g-fs-14 g-m-b-10 ">
				<span v-if="$global.staff.is_charge == 1 ">确定归还到公海中？</span>
				<span v-else>归还到公海中30天内将无法再次领取，确定归还？</span>
				<span v-if="property_id">你已对该客户使用了(“{{ propertyName[property_id] }}”，归还后该券失效，并且不释放名额。）</span>
			</div>
			<i-form-item
				v-if="mode=='drawBack'"
				:label-width="0"
				prop="mark_customer"
				style="margin-bottom: 5px !important;"
			>
				<i-checkbox v-model="formData.mark_customer" @click.native="handleMarkChange" >
					标记资料
					<!-- <oa-explain
						class="g-m-l-5"
						placement="right"
						content="资料被标记后，将对你和你部门的同事不可见，请谨慎标记。"
					/> -->
				</i-checkbox>
			</i-form-item>
			<i-form-item v-if="mode=='sign' || formData.mark_customer" label="标记原因：" prop="mark_type" >
				<i-select
					v-model="formData.mark_type"
					placeholder="请选择标记原因"
					class="g-m-r-10"
					style="width: 220px"
					transfer
					clearable
				>
					<i-option v-for="(item,index) in otherConfig.sign || []" :key="index" :value="item.config_id">
						{{ item.reason }}
					</i-option>

				</i-select>
			</i-form-item>
			<i-form-item
				v-if="mode=='sign' || formData.mark_customer"
				label="备注："
				prop="remark"
			>
				<oa-limit-words
					v-model="formData.remark"
					placeholder="请输入备注"
					clearable
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item 
				v-if="mode=='sign' || formData.mark_customer"
				label="凭证：" 
				prop="image_url"
			>
				<oa-upload
					v-model="formData.image_url"
					:max="5"
					style="width: 255px"
					placeholder="请上传工商信息截图或已合作截图等凭证"
					@error="handleUploadError"
				/>
			</i-form-item>

			<div class="g-c-red-mid g-m-l-20">资料被标记后，将对你和你部门的同事不可领取，请谨慎标记。</div>

		</i-form>

	</i-modal>
</template>
<script >
import { Modal, Form, FormItem, Select, Option, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';
import Upload from "@components/_common/upload/upload";
import { services } from '@stores/services/sale';
import Explain from '../../../_common/explain/explain';
import { getAuth } from '../util';
import { Confirm } from '../../../_common/confirm/confirm.vue';


export default {
	name: "oa-sale-customer-draw-back",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-checkbox': Checkbox,
		'oa-explain': Explain,
		'oa-limit-words': LimitWords,
		'oa-upload': Upload


	},
	mixins: [orderModal, services.otherConfig(), services.coinConfig()],
	props: {
		customer_id: Number,
		own_id: Number,
		staff_id: Number,
		is_own: Boolean,
		property_id: Number,
		mode: {
			type: String,
			default: 'drawBack', // 归还 / 标记资料
			validator: (name) => {
				return ['drawBack', 'sign'].includes(name);
			}
		}


	},
	data() {
		return {
			visible: false,
			modeName: {
				drawBack: '归还',
				sign: '标记资料'

			},
			formData: {
				customer_id: this.customer_id,
				own_id: this.own_id,
				staff_id: this.staff_id,
				mark_customer: false,
				mark_type: '',
				remark: '',
				image_url: []
			},
			propertyName: {
				1: '一次性普通保护券',
				2: '一次性重要保护券',
			},

			rule: {
				mark_type: [{ required: true, type: 'number', message: "请选择标记原因", trigger: 'change' }],
				remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
				image_url: [{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }]
			}
		};
	},
	computed: {
		title() {
			return this.modeName[this.mode];

		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	created() {
	},
	mounted() {
		this.visible = true;


	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				try {
					if (valid) {
					
						let param;
						if (this.mode == 'sign') {
							param = {
								"customer_id": this.formData.customer_id, // 客户ID，必传
								"type": this.formData.mark_type, // 标记原因ID，必传
								"type_name": this.otherConfig.sign.find(it => it.config_id === this.formData.mark_type).reason, // 标记原因，必传
								"image_url": this.formData.image_url.map(i => i.url), // 凭证，必传
								"remark": this.formData.remark// 必传
							};
						} else if (this.mode == 'drawBack') {
							param = {
								"own_ids": [this.own_id]
							};
							if (this.formData.mark_customer) {
								param = {
									...param,
									mark: 1,
									"mark_type": this.formData.mark_type, // 标记类型  1已合作、2名字录错、3产品不匹配、4已注销、5 其它
									"mark_reason": this.otherConfig.sign.find(it => it.config_id === this.formData.mark_type).reason, // 标记文字
									"remark": this.formData.remark, // 备注
									"image_url": this.formData.image_url.map(i => i.url), // 凭证，必传
								};
							}
							// param = {
							// 	"own_ids": [this.own_id], // 记录主键ID
							// 	//  下面参数 own_ids只有一个值时必传,多个值时不传
							// 	"mark_type": this.formData.mark_type, // 标记类型  1已合作、2名字录错、3产品不匹配、4已注销、5 其它
							// 	"mark_reason": this.otherConfig.sign.find(it => it.config_id === this.formData.mark_type).reason, // 标记文字
							// 	"remark": this.formData.remark, // 备注
							// 	"image_url": this.formData.image_url.map(i => i.url), // 凭证，必传
							// };

						}
						this.$request({
							url: this.mode == 'drawBack' ? "_SALE_INTENTION_BACK_SEA_POST" : '_SALE_SEA_BLACK_MARK_POST',
							type: "POST",
							param,
							loading: false,
						}).then(res => {
							this.$Message.success(res.msg);
							this.handleOk();
						}).catch(res => {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(res.msg);
						});
					} else {
						this.$refs.modal.buttonLoading = false;
					}
				} catch (e) {
					console.error(e);
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleMarkChange(event) {
			event.preventDefault();
			event.stopPropagation();
			if (this.formData.mark_customer) {
				this.formData.mark_customer = false;
			} else {
				Confirm.popup({
					title: '温馨提示',
					renderContent: (h) => {
						return <div class="g-fs-14 g-c-black3">
							{this.coinConfig.tip_11_1}
							<br/><br/>
							<span class="g-fs-12 g-c-black4">
							此类型的标记必须提供凭证，例如已合作证明截图、工商信息截图等相关材料
							</span>
						</div>;
					},
					cancelText: '',
					okText: '确定'
				}).then(() => {
					this.formData.mark_customer = true;
				}).catch(e => e && console.error(e));
			}

		},
		handleUploadError(errors) {
			console.error(errors);

		}
	}
};
export const DrawBack = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-draw-back{
	.c-upload{
		.g-c-black4{
			margin-left: 0 !important;
		}
	}
}
</style>