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
			调整称号
		</div>
		<!-- <div v-if="data.action === 'select'" class="_select">
			<div v-for="(item, index) in list" :key="index" :class="item.isSelected ? 'actived' : ''" class="_title">
				<span @click="item.isSelected = !item.isSelected">{{ item.name }}</span>
			</div>
		</div> -->

		<div>
			<i-form
				ref="form"
				:model="form"
				:rules="rule">

				<i-form-item
					:label-width="110"
					label="称号调整："
					prop="rank_id">
					<i-select
						v-model="form.rank_id"
						placeholder="请选择级称"
						style="width: 220px;"
						clearable
						transfer>
						<i-option
							v-for="item in scaleTitleList"
							:key="item.rank_id"
							:value="item.rank_id">
							{{ item.rank_name }}
						</i-option>
					</i-select>
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
	name: "hr-employee-rank-title",
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
			scaleTitleList: [],
			form: {
				rank_id: ''
			},
			rule: {
				rank_id: [{ required: true, message: '级称不能为空', pattern: /.+/, trigger: 'blur' }]
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;

		// 获取级称下拉框
		this.$request({
			url: API_ROOT._HR_EMPLOYEE_RANK_PROMO_RANK_GET,
			type: "GET",
			param: {
				rank_system_id: this.data.info.rank_system_id,
				period_id: this.data.info.period_id
			},
			loading: false
		}).then(res => {
			this.scaleTitleList = res.data;
		}).catch(error => {
			this.$Message.error(error.msg);
		});
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
						url: API_ROOT['_HR_EMPLOYEE_RANK_TITLE_ADJUST_GET'],
						type: 'GET',
						param: {
							staff_rank_id: this.data.info.staff_rank_id,
							staff_id: this.data.info.staff_id,
							rank_id: this.form.rank_id
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
		color: #4b4f57;
		font-size: 14px;
	}
}
</style>
