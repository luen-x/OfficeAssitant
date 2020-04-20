<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-rank-promo-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>
		<!-- <div v-if="data.action === 'select'" class="_select">
			<div v-for="(item, index) in list" :key="index" :class="item.isSelected ? 'actived' : ''" class="_title">
				<span @click="item.isSelected = !item.isSelected">{{ item.name }}</span>
			</div>
		</div> -->

		<div style="color: #333;" class="g-m-lr-30 g-m-t-20 g-fs-14">
			<span v-if="data.action === 'promo'">
				将“{{ data.info.staff_name }}”从{{ data.info.rank_name }}晋级成{{ data.name }}。
			</span>
			<span v-if="data.action === 'degrade'">
				将“{{ data.info.staff_name }}”从{{ data.info.rank_name }}降级成{{ data.name }}。
			</span>
			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				class="g-m-t-20">
				<i-form-item
					:label-width="65"
					label="备注："
					prop="remarks">
					<oa-limit-words
						v-model="form.remarks"
						:max="100"
						style="width: 220px"/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { Modal, Select, Option, Form, FormItem } from "iview";

export default {
	name: "hr-employee-rank-promo",
	components: {
		"i-modal": Modal,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"vc-copy": Copy
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			title: '',
			form: {
				remarks: ''
			},
			rule: {
				remarks: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.data.action === 'promo' ? this.title = '晋级确认' : this.title = '降级确认';
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT['_HR_EMPLOYEE_RANK_PROMO_CHANGE_RANK_GET'],
						type: 'GET',
						param: {
							staff_rank_id: this.data.info.staff_rank_id,
							staff_id: this.data.info.staff_id,
							type: this.data.action === 'promo' ? 1 : 2,
							remarks: this.form.remarks
						},
						loading: false
					}).then(res => {
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('请按照提示信息完善表单');
				}
			});

		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-rank-promo-modal {
	// ._select {
	// 	._title {
	// 		display: inline-block;
	// 		padding-left: 15px;
	// 		padding-right: 15px;
	// 		width: 100px;
	// 		height: 32px;
	// 		line-height: 32px;
	// 		margin-right: 15px;
	// 		cursor: pointer;
	// 		white-space: nowrap;
	// 		overflow: hidden;
	// 		text-overflow: ellipsis;
	// 		border-radius: 4px;
	// 		background-color: #f0f4fc;
	// 	}
	// 	.actived {
	// 		color: #fff;
	// 		background-color: #e74854;
	// 	}
	// }
	.ivu-form .ivu-form-item-label {
		color: #333;
		font-size: 14px;
		padding-right: 10px;
	}
}
</style>
