<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		:title="title"
		class="v-add-class"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<i-form ref="form" :model="formItem" :rules="ruleInline" :label-width="80">
				<i-form-item label="产品分类" prop="category_name">
					<i-input
						:disabled="data.type==1"
						:maxlength="15"
						v-model="formItem.category_name"
						placeholder="请输入产品类目的名称"
					/>
				</i-form-item>
				<!-- <i-form-item label="业绩比例" prop="depart_rate">
					<span class="_number-append">%</span>
					<i-input-number
						:min="0"
						:max="100"
						v-model="formItem.depart_rate"
						class="_input-num"
						placeholder="请输入该分类的业绩比例"
					/>
				</i-form-item> -->
				<!-- <i-form-item label="余额类型" >
					<i-select v-model="formItem.balance" clearable placeholder="请选择该分类关联的余额类型" >
						<i-option
							v-for="(item,index) in balanceList"
							:value="index+1"
							:key="index"
						>{{ item }}</i-option>
					</i-select>
				</i-form-item> -->
				<i-form-item label="分单部门" prop="depart_id">
					<i-cascader
						v-model="formItem.depart_id"
						:data="departAll"
						:change-on-select="true"
						class="_depart"
						trigger="click"
						clearable
						transfer
						placeholder="请选择分单部门"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber, Cascader, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from "@stores/apis/root";
import { services } from '@stores/services/sale';
import { rejects } from 'assert';

export default {
	name: "add-class",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-cascader": Cascader
	},
	mixins: [services.departAll()],
	props: {
		data: Object
	},
	data() {
		return {
			balanceList: ["线上余额", "线下余额"],
			depart_id: [],
			visible: false,
			formItem: {
				category_id: '',
				category_name: '',
				balance: '',
				depart_id: [],
			},
			ruleInline: {
				category_name: [
					{ required: true, message: '请输入产品类目的名称', }
				],
				depart_rate: [
					{ required: false, message: '请输入该分类的业绩比例', }
				],
				depart_id: [
					{ required: false, message: '请选择归属部门', }
				]
			}
		};
	},
	computed: {
		title() {
			return this.data.type == 1 ? '编辑分类' : '添加分类';
		}
	},
	watch: {

	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		if (this.data.type == 1) {
			this.formItem = this.data.list;
			this.category_id = this.data.category_id;
		}
	},
	methods: {
		Addclass() {
			this.$request({
				url: API._CONTENT_PRODUCT_EDIT_CATEGORY_POST,
				type: "post",
				param: {
					...this.formItem,
				}
			}).then(res => {
				this.list = res.data;
				this.$emit('sure', {});
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			this.$refs.form.validate().then((res) => {
				if (res) {
					this.Addclass();
				} else {
					this.$Message.error("内容请填写完整");
					this.$refs.modal.buttonLoading = false;
				}
			});
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;

		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},

	}
};
export const AddClass = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-add-class {
        ._number-append {
            display: inline-block;
            position: absolute;
            right: 7px;
            vertical-align: bottom;
            z-index: 1;
            color: gray;
        }
        .ivu-input-number {
            width: 100% !important;

            .ivu-input-number-handler-wrap {
                display: none !important;
            }
        }
        ._depart {
            width: 100%;
        }
    }
</style>
