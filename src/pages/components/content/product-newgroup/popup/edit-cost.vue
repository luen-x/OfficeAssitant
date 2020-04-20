<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		class="v-edit-cost"
		width="400"
		title="编辑成本"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="formValidate"
			:model="formDate"
			:rules="ruleValidate"
			:label-width="80">
			<i-form-item label="成本类型:" prop="cost_type">
				<i-radio-group v-model="formDate.cost_type" style="width: 200px" @on-change="handleCostType">
					<i-radio :label="1">标准价成本</i-radio>
					<!-- <i-radio :label="2">成交金额成本</i-radio> -->
					<i-radio :label="3">固定成本</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item style="width: 320px" prop="cost">
				<span class="_number-append">{{ formDate.cost_type == 3 ? '元' : '%' }}</span>
				<i-input-number
					v-model="formDate.cost"
					:min="0"
					:max="formDate.cost_type==3 ? 99999999 : 100"
					:precision="2"
					:active-change="false"
					placeholder="请输入成本"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber, RadioGroup, Radio } from 'iview';
import { CreatePortal } from 'wya-vc';
import { mapState } from 'vuex';

export default {
	name: "preview-form",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
	},
	props: {
		data: Object, // {product}
	},
	data() {
		return {
			visible: false,
			formDate: {
				cost: Number(this.data.product.cost),
				cost_type: this.data.product.cost_type
			},
			ruleValidate: {
				cost: [
					{ required: true, type: 'number', message: '请输入成本', trigger: 'change' }
				],
				cost_type: [
					{ required: true, type: 'number', message: '请选择成本类型', trigger: 'change' }
				],
			},
			num: 0,
		};
	},

	computed: {

	},
	beforeCreate() {
		this.Button = Button;
	},

	mounted() {
		this.visible = true;

	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		handleCostType(cost_type) {
			if (cost_type != 3) {
				this.formDate.cost = this.formDate.cost > 100 ? 100 : this.formDate.cost;
			}
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.$refs.modal.buttonLoading = false;
					// this.$store.commit('SET_GROUP_EDIT_COST', { num: this.data.num, Type: this.formDate.cost_type, cost: this.formDate.cost });
					const product = { ...this.data.product, ...this.formDate };
					this.visible = false;
					this.$emit('sure', product);
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const EditCostModal = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-edit-cost {
        ._number-append {
            display: inline-block;
            position: absolute;
            right: 7px;
            vertical-align: bottom;
            z-index: 1;
            color: gray;
        }
        /deep/ .ivu-input-number {
            width: 100% !important;
            .ivu-input-number-handler-wrap {
                display: none !important;
            }
        }
        ._process {
            height: 40px;
            line-height: 40px;
            width: 320px;
            border-bottom: 1px solid #d4d7db;
            cursor: pointer;
        }
        ._process:hover {
            background: #f0f4fc;
        }
    }
</style>
