<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:width="data.action === 'delete' || data.action === 'delete-multi' ? '400px' : '680px'"
		class="g-flex v-hr-salary-per-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>

		<div
			v-if="data.action === 'add' || data.action === 'adjust'"
			:class="[data.action === 'add' ? 'g-m-t-20' : '']"
			:style="{maxHeight: data.action === 'add' ? '336px' : '356px'}"
			class="_content"
			style="paddingLeft: 50px;marginRight: 35px;">

			<p v-if="data.action === 'adjust'" class="g-m-b-20 g-c-red-light">{{ tip }}</p>

			<i-form
				ref="sysForm"
				:rules="sysRule"
				:model="sysForm"
				:label-width="130">

				<i-form-item prop="name" label="设置提成制度名称：">
					<i-input
						v-model="sysForm.name"
						:maxlength="10"
						clearable
						placeholder="请输入名称，10字以内"
						style="width: 300px" />
				</i-form-item>

				<i-form-item
					v-for="(item, index) in sysForm.pointList"
					:key="index"
					:rules="sysRule.rateObj"
					:prop="'pointList.' + index"
					:label="index === 0 ? '设置提成点：' : ''"
				>
					<div class="g-flex g-ai-c">
						<span class="g-m-r-5">业绩大于</span>
						<i-input-number
							v-model="item.separate"
							:max="10000000"
							:min="0"
							:precision="2"
							:active-change="false"
							placeholder="请输入金额"
							style="width: 120px;"/>
						<span class="g-absolute" style="left: 135px;top: 2px">元</span>
						<span class="g-m-r-5">；提成点</span>
						<i-input-number
							v-model="item.rate"
							:max="100"
							:min="0"
							:precision="2"
							:active-change="false"
							placeholder="请输入数字"
							style="width: 120px;"/>
						<span class="g-absolute" style="left: 310px;top: 2px">%</span>
						<i
							v-if="index !== 0"
							class="iconfont icon-remove-circle g-fs-20 g-c-red-mid g-m-lr-10"
							@click="handleListDelete(index)" />
						<i
							v-if="index === sysForm.pointList.length - 1"
							:class="index === 0 ? 'g-m-l-10' : ''"
							class="iconfont icon-add1 g-fs-20 g-c-blue-mid"
							@click="handleListAdd(index)" />
					</div>
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

				<i-form-item prop="remarks" label="备注说明：">
					<oa-limit-words
						v-model="sysForm.remarks"
						width="300px"
						placeholder="请输入备注，选择该提成制度的员工均可看到，非必填"/>
				</i-form-item>
			</i-form>
		</div>
		<div v-else-if="data.action === 'delete'" class="_only-text g-fs-14">
			{{ isZero ? '是否确认删除该提成制度' : '当前提成制度有人在使用，不可以直接删除' }}
		</div>
		<div v-else-if="data.action === 'delete-multi'" class="_only-text g-fs-14">
			{{ isZero ? '是否确认批量删除提成制度，删除后不可恢复' : '存在提成制度使用人数不为0，不可批量删除' }}
		</div>
	</i-modal>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { objRegex } from '@utils/utils';
import { CreatePortal, Copy } from "wya-vc";
import { Modal, Select, Option, Form, FormItem, Input, InputNumber } from "iview";

export default {
	name: "hr-salary-per",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input-number": InputNumber,
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
					url: API_ROOT._HR_SALARY_CHECK_PER_NAME_GET,
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
			title: '',
			name: '',
			isZero: 1,
			rankSysList: [],
			tip: '',
			sysForm: {
				pointList: [
					{
						rate: null,
						separate: null
					}
				]
			},
			sysRule: {
				name: [
					{ required: true, message: "提成制度名称不能为空", trigger: "blur" },
					{ validator: validateName, trigger: "blur" }
				],
				rateObj: {
					type: 'object',
					required: true,
					trigger: 'change',
					fields: {
						separate: [{ required: true, message: "业绩不能为空", pattern: /.+/, trigger: "change" }],
						rate: [{ required: true, message: "提成点不能为空", pattern: /.+/, trigger: "change" }],
					}
				}
			}
		};
	},
	created() {
		this.visible = true;
		switch (this.data.action) {
			case 'add':
				this.title = '新增提成制度';
				break;
			case 'adjust':
				this.title = '修改提成制度';
				break;
			case 'delete':
				this.title = '删除提成制度';
				break;
			case 'delete-multi':
				this.title = '批量删除提成制度';
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

			// 请求提成制度详情信息
			this.$request({
				url: API_ROOT._HR_SALARY_PER_DETAIL_GET,
				type: "GET",
				param: {
					rate_case_id: this.data.info.rate_case_id
				},
				loading: false
			})
				.then(res => {
					this.sysForm = { ...res.data };
					this.name = res.data.name;
					// 提成设置
					let pointList = [];
					res.data.rate.forEach((item, index) => {
						pointList.push({
							rate: +item,
							separate: +res.data.separate[index]
						});
					});
					// 被选体系
					let arr = [];
					res.data.range_ids.forEach(item => {
						arr.push(+item);
					});
					this.sysForm.pointList = pointList;
					this.sysForm.range_ids = arr;
				})
				.catch(err => {
					this.$Message.error(err.msg);
				});
		}
	},
	methods: {
		handleListAdd: lodash.debounce(function (index) {
			if (index === 0) {
				if ((this.sysForm.pointList[0].rate > 0 || this.sysForm.pointList[0].rate === 0)
					&& (this.sysForm.pointList[0].separate > 0 || this.sysForm.pointList[0].separate === 0)) {

					this.sysForm.pointList.push({
						rate: null,
						separate: null
					});
				} else if (this.sysForm.pointList[0].rate === null || this.sysForm.pointList[0].separate === null) {
					this.$Message.warning('请输入提成点');
				} else {
					this.$Message.warning('请输入正确的提成点');
				}
			}

			if (index > 0) {	// 新增数据小于上一条数据时不可增加
				if (this.sysForm.pointList[index].rate > this.sysForm.pointList[index - 1].rate
					&& this.sysForm.pointList[index].separate > this.sysForm.pointList[index - 1].separate) {
					this.sysForm.pointList.push({
						rate: null,
						separate: null
					});
				} else {
					this.$Message.warning('新增提成点需大于上一条提成点！');
				}
			}
			this.$forceUpdate();
		}, 300),
		handleListDelete(index) {
			this.sysForm.pointList.splice(index, 1);
			this.$forceUpdate();
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			if (this.data.action === "add" || this.data.action === "adjust") {

				this.$refs["sysForm"].validateAndScroll(valid => {
					if (valid) {
						if (this.sysForm.pointList.length > 1 && !this.checkList(this.sysForm.pointList)) {
							this.$Message.error('新增提成点需大于上一条提成点！');
							this.$refs.modal.buttonLoading = false;
						}

						if (this.sysForm.pointList.length === 1 || this.checkList(this.sysForm.pointList)) {
							if (this.name && this.name === this.sysForm.name) {
								this.visible = false;
								this.$emit('sure', this.sysForm);
							} else {
								// 判断名称是否重复
								this.$request({
									url: API_ROOT._HR_SALARY_CHECK_PER_NAME_GET,
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

						}

					} else {
						this.$Message.warning("请按照提示填入信息!");
						this.$refs.modal.buttonLoading = false;
					}
				});
			} else if (this.isZero === 1) {
				// 删除提成制度
				this.$request({
					url: API_ROOT._HR_SALARY_DELETE_PER_GET,
					type: "GET",
					param: {
						rate_case_id: this.data.action === 'delete-multi' ? this.data.selected : this.data.info.rate_case_id
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
				this.$emit('sure', 0);
			}
		},
		// 判断数组中上一条数据是否小于下一条数据
		checkList(arr) {
			let result = [];
			arr.forEach((item, index) => {
				if (index < arr.length - 1) {
					(item.rate > arr[index + 1].rate || item.separate > arr[index + 1].separate) ? result.push(0) : result.push(1);
				}
			});
			return result.indexOf(0) === -1;
		},
		handleCancel() {
			this.$emit("close");
		},
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-salary-per-modal {
	.ivu-form .ivu-form-item-label {
		color: #4b4f57;
	}
	._content {
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
