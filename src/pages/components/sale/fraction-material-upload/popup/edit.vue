<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true"
		:mask-closable="false" 
		width="680px" 
		class="v-sale-material-upload-edit"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>重新编辑</span>
		</div>

		<div style="margin-left: 50px;">
			<i-form 
				ref="form" 
				:model="formData" 
				:rules="rules" 
				:label-width="150"
				@submit.native.prevent
			>
				<div class="g-m-b-20" style="padding-left: 80px;">
					<span class="g-c-red-mid">注：文件上传需要经过三立学府审核通过</span>
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
					:tape-data="tape_data"
				/>
				<oa-fraction-material-upload-train 
					v-if="formData.material_use === 5"
					:form-data="formData"
					:tape-data="tape_data"
				/>
				<oa-fraction-material-upload-informate 
					v-if="formData.material_use === 6"
					:form-data="formData"
					:tape-data="tape_data"
				/>
				<oa-fraction-material-upload-market 
					v-if="formData.material_use === 7"
					:form-data="formData"
					:tape-data="tape_data"
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
	name: "oa-material-upload-edit",
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
			tape_data: {}, // 录音表单信息
			tape_id: '', // 录音id
			cur_material_use: '', // 当前素材用途
			material_uses: [], // 素材用途列表
			provider_list: [], // 素材提供人列表
			loadStaffList: Tools.loadStaffList,
			handleParams: Tools.handleParams
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
			this.loadMaterialUse();
			this.loadMaterialData();
			this.loadTapeData();
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
				this.cur_material_use = +res.data.material_use;
				this.formData.material_use = +res.data.material_use;
				this.formData.describe = res.data.describe;
				this.loadStaffList('', 'provider_list').then(() => {
					this.$nextTick(() => {
						this.formData.provider_ids = res.data.provider_ids;
					});
				}).catch(error => {});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 录音表单详情
		 */
		loadTapeData() {
			this.$request({
				url: '_SALE_LIBRARY_MATERIAL_TAPE_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					material_id: this.materialId
				},
				autoTip: false
			}).then(res => {
				this.tape_data = res.data;
				this.tape_id = res.data.tape_id;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
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
				if (valid) {
					let param = this.handleParams(this.materialId, this.tape_id, undefined);
					this.$request({
						url: '_SALE_LIBRARY_MATERIAL_REEDIT_POST',
						type: "POST",
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
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

export const FractionMaterialUploadEdit = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sale-material-upload-edit {
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

