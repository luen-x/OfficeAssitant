<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:loading="true" 
		:mask-closable="false" 
		width="400"
		class="v-hr-entry-depart-modal" 
		@on-ok="handleOk" 
		@on-cancel="handleCancel">
		<div slot="header" class="g-tc">兼部门</div>
		<i-form 
			ref="formValidate" 
			:model="formValidate" 
			:rules="ruleValidate" 
			:label-width="70" 
			class="_form">
			<div v-for="(item, index) in formValidate.departData" :key="index" class="g-flex g-flex-cc g-flex-ac _item">
				<div>
					<i-form-item label="兼部门:">
						<i-cascader 
							v-model="item.depart_id" 
							:data="departAll" 
							:change-on-select="true" 
							:disabled="show" 
							style="width: 220px; display: inline-block" 
							class="g-fl" 
							clearable
							transfer 
							trigger="click" 

							placeholder="请选择兼部门" />
						<span v-if="!show" class="g-fl" style="marginLeft:10px;width:40px">
							<i
								v-if="formValidate.departData.length != 1"
								class="iconfont icon-remove-circle g-fs-16 g-c-pink-mid" 
								@click="handleDel(index)"
							/>
							<i 
								v-if="formValidate.departData.length == index+1 && formValidate.departData.length < 5" 
								class="iconfont icon-add1 g-fs-16 g-c-blue-mid" 
								@click="handleAdd"
							/>
						</span>
					</i-form-item>
					<i-form-item label="是否管理:" style="marginTop:-10px">
						<i-radio-group v-model="item.is_charge">
							<i-radio :disabled="show" label="1" >是</i-radio>
							<i-radio :disabled="show" label="0" >否</i-radio>
						</i-radio-group>
					</i-form-item>
				</div>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import {
	Modal,
	Form,
	FormItem,
	RadioGroup,
	Radio,
	Cascader,
	Select,
	Option
} from "iview";
import { CreatePortal } from "wya-vc";
import { services } from "@stores/services/hr";

export default {
	name: "hr-summary-entry-depart-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-cascader": Cascader
	},
	mixins: [services.departAll()],
	props: {
		extra_depart: {
			type: Array,
			default() {
				return [];
			}
		},
		show: {
			type: Boolean,
		}
	},
	data() {
		return {
			visible: false,
			formValidate: {
				departData: []
			},
			ruleValidate: {
				depart_id: [{
					required: false,
					type: 'array',
					message: '请选择部门',
					pattern: /.+/,
					trigger: 'blur'
				}],
			}
		};
	},
	mounted() {
		this.visible = true;
		this.formValidate.departData = this.extra_depart.length == 0
			? [{ depart_id: [], is_charge: "0" }]
			: JSON.parse(JSON.stringify(this.extra_depart)); 
	},
	methods: {
		handleAdd() {
			this.formValidate.departData.push({
				depart_id: [], // 部门id
				is_charge: "0" // 是否为管理 0:不是管理，1：是管理
			});
			this.$nextTick(() => {
				let divDom = document.querySelector(".ivu-modal-body");
				divDom.scrollTop = divDom.scrollHeight;
			});
		},
		handleDel(index) {
			if (this.formValidate.departData.length == 1) {
				return this.formValidate.departData.splice(0, 1, {
					depart_id: [], // 部门id
					is_charge: "0"
				});
			}
			this.formValidate.departData.splice(index, 1);
		},
		handleOk() {
			this.formValidate.departData = this.formValidate.departData.filter((item, index) => {
				if (item.depart_id.length == 0) {
					return;
				}
				return item;
			});
			let departDataLength = this.formValidate.departData.length;
			let newArr = [];
			for (let i = 0; i < departDataLength; i++) {
				let departId = this.formValidate.departData[i].depart_id;
				newArr.push(departId[departId.length - 1]);
			}
			let uniqueNewArr = Array.from(new Set([...newArr]));
			if (uniqueNewArr.length != newArr.length) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('兼部门不能有重复');
			} else {
				this.$emit("sure", this.formValidate.departData);
			}
		},
		handleCancel() {
			this.$emit("close", false);
		}
	}
};
export const DepartModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
.v-hr-entry-depart-modal {
	._form {
		margin: 2px 0px -46px 0px;
		max-height: 380px;
		overflow-y: auto;
		margin-bottom: 4px;
		.ivu-modal-body {
			padding: 0px !important;
			max-height: 576px;
			overflow: auto;
		}
		.ivu-radio-wrapper:first-child {
			margin-right: 40px;
		}
		._icon {
			margin-top: -70px;
			margin-left: -30px;
		}
		._item {
			padding-top: 20px;
		}
	}
}
</style>


