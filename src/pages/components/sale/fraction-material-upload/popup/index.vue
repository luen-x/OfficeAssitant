<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true"
		:mask-closable="false" 
		width="680px" 
		class="v-sale-material-upload"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ title }}</span>
		</div>
		<div style="margin-left: 50px;">
			<i-form 
				ref="form" 
				:model="formData" 
				:rules="rules" 
				:label-width="150"
				@submit.native.prevent
			>
				<div 
					v-if="!isRepeat" 
					class="g-m-b-20" 
					style="padding-left: 80px;"
				>
					<span class="g-c-red-mid">注：文件上传需要经过三立学府审核通过</span>
				</div>
				<div 
					v-else 
					class="g-m-b-20" 
					style="padding-left: 80px;width: 95%;word-break: break-all;"
				>
					<span class="g-c-red-mid">驳回理由：{{ auditRemark }}</span>
				</div>
				<i-form-item label="素材用途：" prop="material_use">
					<i-select 
						v-model="formData.material_use"
						placeholder="请选择素材用途"
						clearable
						transfer
						style="width: 300px"
					>
						<i-option 
							v-for="(item, index) in material_uses" 
							:key="index"
							:value="item.value"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="素材提供人：" prop="provider_ids">
					<i-select
						ref="provider"
						v-model="formData.provider_ids"
						:remote-method="(search)=>loadStaffList(search,'provider_list')"
						:loading="provider_list_loading"
						filterable
						multiple
						remote
						transfer
						placeholder="请输入关键字查询"
						@on-change="handleProviderChange"
					>
						<i-option
							v-for="(item,index) in provider_list"
							:key="index"
							:value="item.staff_id"
						>{{ item.staff_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="素材简介：" prop="describe">
					<oa-limit-words 
						v-model="formData.describe"
						:max="500"
						placeholder="请填写素材简介"
						clearable
						style="width: 300px;margin-bottom: 20px;"
					/>
				</i-form-item>
				<oa-fraction-material-upload-negotiator 
					v-if="formData.material_use === 4"
					:form-data="formData"
				/>
				<oa-fraction-material-upload-train 
					v-if="formData.material_use === 5"
					:form-data="formData"
				/>
				<oa-fraction-material-upload-informate 
					v-if="formData.material_use === 6"
					:form-data="formData"
				/>
				<oa-fraction-material-upload-market 
					v-if="formData.material_use === 7"
					:form-data="formData"
				/>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Select, Option } from "iview";
import { CreatePortal } from "wya-vc";
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';
import formDataOrRules from "../../_common/fraction/mixins/rules";
import { FractionMaterialUploadNegotiator } from './negotiator';
import { FractionMaterialUploadTrain } from './train';
import { FractionMaterialUploadInformate } from './informate';
import { FractionMaterialUploadMarket } from './market';
import * as Tools from "../tools";

export default {
	name: "oa-material-upload",
	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords,
		'oa-fraction-material-upload-negotiator': FractionMaterialUploadNegotiator,
		'oa-fraction-material-upload-train': FractionMaterialUploadTrain,
		'oa-fraction-material-upload-informate': FractionMaterialUploadInformate,
		'oa-fraction-material-upload-market': FractionMaterialUploadMarket
	},
	mixins: [orderModal, formDataOrRules],
	props: {
		title: String,
		isFolder: Boolean,
		isRepeat: Boolean,
		type: [String, Number],
		materialId: [String, Number],
		fileList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			visible: false,
			provider_list_loading: false,
			auditRemark: '', // 驳回理由
			material_uses: [], // 素材用途列表
			provider_list: [], // 素材提供人列表
			loadStaffList: Tools.loadStaffList,
			handleParams: Tools.handleParams
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
		this.loadInitProvider();
		if (this.materialId) {
			this.loadMaterialData();
		}
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loadMaterialUse();
		},
		/**
		 * 获取素材用途
		 */
		loadMaterialUse() {
			this.$request({
				url: '_SALE_LIBRARY_MATERIAL_USE_GET',
				type: 'GET',
				loading: false,
				param: {},
				autoTip: false
			}).then(res => {
				this.material_uses = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 素材详情
		 */
		loadMaterialData() {
			this.$request({
				url: '_SALE_LIBRARY_MATERIAL_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					material_id: this.materialId
				},
				autoTip: false
			}).then(res => {
				this.auditRemark = res.data.audit_remark;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 初始化加载素材提供人
		 */
		loadInitProvider() {
			const staff = this.$global.staff;
			if (staff.is_charge !== 1) {
				this.loadStaffList('', 'provider_list').then(() => {
					this.$nextTick(() => {
						this.formData.provider_ids = [+staff.staff_id];
					});
				}).catch(error => {});
			}
		},
		/**
		 * 监听素材提供人的change事件
		 */
		handleProviderChange(e) {
			this.$nextTick(() => {
				if (this.formData.provider_ids.length > 5) {
					const v = [...this.$refs.provider.values];
					this.$refs.provider.$children[0].removeTag(v[v.length - 1]);
				}
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				let param_url = '';
				if (this.isRepeat) {
					param_url = '_SALE_LIBRARY_MATERIAL_RSUBMIT_POST';
				} else if (this.isFolder) {
					param_url = '_SALE_LIBRARY_MATERIAL_FOLDER_SAVE_POST';
				} else {
					param_url = '_SALE_LIBRARY_MATERIAL_SAVE_POST';
				}
				
				if (valid) {
					let param = {};
					if (this.isRepeat) {
						param = this.handleParams(this.materialId, undefined, undefined);
					} else {
						param = this.handleParams(undefined, undefined, this.fileList);
					}
					this.$request({
						url: param_url,
						type: "POST",
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', {
							material_id: res.data.material_ids[0]
						});
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};

export const FractionMaterialUpload = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sale-material-upload {
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
	.ivu-select {
		width: 300px;
	}
}
</style>

