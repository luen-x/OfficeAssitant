<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:width="data.action === 'delete' || data.action === 'delete-multi' ? '400px' : '680px'"
		class="g-flex v-hr-salary-base"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>

		<div
			v-if="data.action === 'add' || data.action === 'adjust'"
			:class="[data.action === 'add' ? 'g-m-t-20' : '']"
			class="_content"
			style="paddingLeft: 60px;marginRight: 45px;">

			<p v-if="data.action === 'adjust'" class="g-m-b-20 g-c-red-light">{{ tip }}</p>

			<i-form
				ref="sysForm"
				:rules="sysRule"
				:model="sysForm"
				:label-width="130">

				<i-form-item prop="name" label="设置底薪制度名称：">
					<i-input
						v-model="sysForm.name"
						:maxlength="10"
						placeholder="请输入名称，10字以内"
						clearable
						style="width: 300px" />
				</i-form-item>

				<i-form-item prop="amount" label="设置默认底薪额度：">
					<i-input-number
						v-model="sysForm.amount"
						:max="100000"
						:min="0"
						:precision="2"
						:active-change="false"
						placeholder="请输入金额"
						style="width: 300px;"/>
					<span class="g-absolute" style="left: 258px;top: 2px">元</span>
				</i-form-item>

				<i-form-item prop="range_ids" label="关联级称补贴设置：">
					<i-select
						v-model="sysForm.range_ids"
						multiple
						transfer
						placeholder="设置关联级称"
						style="width: 300px">
						<i-option
							v-for="item in rankSysList"
							:key="item.rank_system_id"
							:value="item.rank_system_id">
							{{ item.system_name }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item prop="has_work_age" label="工龄工资：">
					<i-radio-group v-model="sysForm.has_work_age">
						<i-radio :label="1">有工龄工资</i-radio>
						<i-radio :label="0">无工龄工资</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item prop="remarks" label="备注说明：">
					<oa-limit-words
						v-model="sysForm.remarks"
						placeholder="请输入备注，选择该底薪制度的员工均可看到，非必填"
						style="width: 300px"/>
				</i-form-item>

			</i-form>
		</div>
		<div v-else-if="data.action === 'delete'" class="_only-text g-fs-14">
			{{ isZero ? '是否确认删除该底薪制度' : '当前底薪制度有人在使用，不可以直接删除' }}
		</div>
		<div v-else-if="data.action === 'delete-multi'" class="_only-text g-fs-14">
			{{ isZero ? '是否确认批量删除底薪制度，删除后不可恢复' : '存在底薪制度使用人数不为0, 不可批量删除' }}
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { objRegex } from '@utils/utils';
import { Modal, Select, Option, Form, FormItem, Input,
	InputNumber, Radio, RadioGroup } from "iview";
import { CreatePortal, Copy } from "wya-vc";

export default {
	name: "hr-salary-base",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input-number": InputNumber,
		"i-radio": Radio,
		"i-radio-group": RadioGroup,
		"vc-copy": Copy
	},
	props: {
		data: Object
	},
	data() {
		let validateName = (rule, value, callback) => {
			if (!objRegex.validName10.regex.test(value)) {
				callback(new Error("请输入合适的名称"));
			} else if (this.data.action === 'add' || this.name !== this.sysForm.name) {
				// 判断名称是否重复
				this.$request({
					url: API_ROOT._HR_SALARY_CHECK_BASE_NAME_GET,
					type: "GET",
					param: {
						name: this.sysForm.name,
						depart_id: this.data.depart_id
					},
					loading: false
				}).then(res => {
					if (res.data.is_have) {
						callback(new Error("该名称已存在，请重新输入！"));
					} else {
						callback();
					}
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			} else {
				callback();
			}
		};
		return {
			visible: false,
			title: "",
			name: '',
			isZero: 1,
			rankSysList: [],
			tip: '',
			sysForm: {
				amount: null,
				has_work_age: null
			},
			sysRule: {
				name: [
					{ required: true, message: "底薪制度名称不能为空", trigger: "blur" },
					{ validator: validateName, trigger: "blur" }
				],
				amount: [{ required: true, message: "底薪额度不能为空", pattern: /.+/, trigger: "change" }],
				has_work_age: [{ required: true, message: "请选择是否有工龄工资", pattern: /.+/, trigger: "change" }]
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		switch (this.data.action) {
			case 'add':
				this.title = '新增底薪制度';
				break;
			case 'adjust':
				this.title = '修改底薪制度';
				break;
			case 'delete':
				this.title = '删除提示';
				break;
			case 'delete-multi':
				this.title = '批量删除';
				break;
			default:
				break;
		}

		// 获取体系列表
		this.$request({
			url: API_ROOT.HR_SALARY_RANK_SYS_GET,
			type: "GET",
			param: {
				depart_id: this.data.depart_id
			},
			loading: false
		}).then(res => {
			this.rankSysList = res.data;
		}).catch(err => {
			this.$Message.error(err.msg);
		});

		// 修改时填入原来信息
		if (this.data.action === "adjust") {
			// 提示语
			this.$request({
				url: '_HR_SALARY_ACTION_TIP_GET',
				type: 'GET',
				loading: false
			}).then(res => {
				this.tip = res.data.msg;
			}).catch(err => {});

			// 请求底薪制度详情信息
			this.$request({
				url: API_ROOT._HR_SALARY_BASE_DEATIL_GET,
				type: "GET",
				param: {
					basic_salary_id: this.data.info.basic_salary_id
				},
				loading: false
			})
				.then(res => {
					this.name = res.data.name;
					this.sysForm = { ...res.data };
					this.sysForm.amount = +res.data.amount;

					// 被选体系
					let arr = [];
					res.data.range_ids.forEach(item => {
						arr.push(+item);
					});
					this.sysForm.range_ids = arr;
				})
				.catch(err => {
					this.$Message.error(err.msg);
				});
		}
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			if (this.data.action === "add" || this.data.action === "adjust") {

				this.$refs["sysForm"].validateAndScroll(valid => {
					if (valid) {
						if (this.name && this.name === this.sysForm.name) {
							this.visible = false;
							this.$emit('sure', this.sysForm);
						} else {
							// 判断名称是否重复
							this.$request({
								url: API_ROOT._HR_SALARY_CHECK_BASE_NAME_GET,
								type: "GET",
								param: {
									name: this.sysForm.name,
									depart_id: this.data.depart_id
								},
								loading: false
							}).then(res => {
								if (res.data.is_have) {
									this.$Message.warning(
										"该名称已存在，请重新输入！"
									);
									this.$refs.modal.buttonLoading = false;
								} else {
									this.visible = false;
									this.$emit('sure', this.sysForm);
								}
							}).catch(err => {
								this.$Message.error(err.msg);
								this.$refs.modal.buttonLoading = false;
							});
						}
					} else {
						this.$Message.warning("请按照提示填入信息!");
						this.$refs.modal.buttonLoading = false;
					}
				});
			} else if (this.isZero === 1) {
				// 删除底薪制度
				this.$request({
					url: API_ROOT._HR_SALARY_DELETE_BASE_GET,
					type: "GET",
					param: {
						basic_salary_id: this.data.action === 'delete-multi' ? this.data.selected : this.data.info.basic_salary_id
					},
					loading: false
				}).then(res => {
					this.$emit('sure', 1);
					this.$Message.success('操作成功');
				}).catch(err => {
					this.isZero = 0;
					this.$refs.modal.buttonLoading = false;
				});
			} else if (this.isZero === 0) {
				this.$emit('sure');
			}
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-salary-base {
	.ivu-form .ivu-form-item-label {
		color: #4b4f57;
	}
	._content {
		max-height: 356px;
		overflow-y: auto;
	}
	._only-text {
		padding: 34px;
		padding-top: 44px;
		padding-bottom: 24px;
		color: #333;
	}
}
</style>
