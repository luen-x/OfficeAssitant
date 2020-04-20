<template>
	<div>
		<i-drawer
			ref="modal"
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-salary-team-modal"
			@on-close="$emit('close')"
		>

			<div v-if="spin" slot="header" class="_detail-header">
				{{ type === 'add' ? '新增提成制度' : '修改提成制度' }}
			</div>
			<div v-if="spin" style="padding: 0 28px 60px">

				<div class="_content">
					<i-form
						ref="form"
						:rules="rule"
						:model="formData"
						:label-width="140">

						<i-form-item prop="name" label="设置提成制度名称：">
							<i-input
								v-model="formData.name"
								:maxlength="10"
								clearable
								placeholder="请输入名称，10字以内"
								style="width: 300px" />
						</i-form-item>

						<i-form-item
							v-for="(item, index) in formData.pointList"
							:key="index"
							:rules="rule.rateObj"
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
									v-if="index === formData.pointList.length - 1"
									:class="index === 0 ? 'g-m-l-10' : ''"
									class="iconfont icon-add1 g-fs-20 g-c-blue-mid"
									@click="handleListAdd(index)" />
							</div>
						</i-form-item>

						<i-form-item prop="range_ids" label="关联级称补贴设置：">
							<i-select
								v-model="formData.range_ids"
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
								v-model="formData.remarks"
								width="300px"
								placeholder="请输入备注，选择该提成制度的员工均可看到，非必填"/>
						</i-form-item>
					</i-form>
				</div>

				<div
					v-if="type != 3 && type != 4 && type != 5"
					class="_detail-footer g-flex g-flex-ac"
					style="marginTop: 46px;">
					<i-button
						class="g-m-r-10"
						@click="handleCancel">
						取消
					</i-button>
					<i-button
						type="primary"
						@click="handleSave">
						保存
					</i-button>
				</div>
			</div>
			<oa-loading v-else />
		</i-drawer>
	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { objRegex } from '@utils/utils';
import orderModal from '@extends/mixins/orderModal';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import { Drawer, Select, Option, Button, Form, FormItem, Input, InputNumber, DatePicker, Rate } from 'iview';

export default {
	name: 'hr-salary-team',
	components: {
		'i-drawer': Drawer,
		'i-button': Button,
		'vc-imgs-preview': ImgsPreview,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber
	},
	mixins: [orderModal],
	props: {
		info: Object,
		type: String,
		depart_id: String
	},
	data() {
		let validateName = (rule, value, callback) => {
			if (!objRegex.validName10.regex.test(value)) {
				callback(new Error("请输入合适的名称"));
			} else if (this.type === 'add' || this.name !== this.formData.name) {
				// 判断名称是否重复
				this.$request({
					url: API_ROOT._HR_SALARY_CHECK_PER_NAME_GET,
					type: "GET",
					param: {
						name: this.formData.name,
						depart_id: this.depart_id,
						type: 2
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
			closable: false,
			spin: true,
			name: '',
			rankSysList: [],
			formData: {
				pointList: [
					{
						rate: null,
						separate: null
					}
				]
			},
			rule: {
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
	async mounted() {
		this.closable = true;

		// 获取体系列表
		await this.$request({
			url: API_ROOT.HR_SALARY_RANK_SYS_GET,
			type: "GET",
			param: {
				depart_id: this.depart_id
			},
			loading: false
		}).then(res => {
			this.rankSysList = res.data;
		}).catch(err => {
			this.$Message.error(err.msg);
		});

		// 修改时填入原来信息
		this.type === "modify" ? this.loadData() : '';

	},
	methods: {
		loadData() { // 请求提成制度详情信息
			this.spin = false;
			this.$request({
				url: API_ROOT._HR_SALARY_PER_DETAIL_GET,
				type: "GET",
				param: {
					rate_case_id: this.info.rate_case_id
				}
			})
				.then(res => {
					this.spin = true;
					this.formData = { ...res.data };
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
					this.formData.pointList = pointList;
					this.formData.range_ids = arr;
				})
				.catch(err => {
					this.spin = true;
					this.$Message.error(err.msg);
				});
		},
		handleListAdd: lodash.debounce(function (index) {
			if (index === 0) {
				if ((this.formData.pointList[0].rate > 0 || this.formData.pointList[0].rate === 0)
					&& (this.formData.pointList[0].separate > 0 || this.formData.pointList[0].separate === 0)) {

					this.formData.pointList.push({
						rate: null,
						separate: null
					});
				} else if (this.formData.pointList[0].rate === null || this.formData.pointList[0].separate === null) {
					this.$Message.warning('请输入提成点');
				} else {
					this.$Message.warning('请输入正确的提成点');
				}
			}

			if (index > 0) {	// 新增数据小于上一条数据时不可增加
				if (this.formData.pointList[index].rate > this.formData.pointList[index - 1].rate
					&& this.formData.pointList[index].separate > this.formData.pointList[index - 1].separate) {
					this.formData.pointList.push({
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
			this.formData.pointList.splice(index, 1);
			this.$forceUpdate();
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
		handleSave() {
			this.$refs["form"].validate(valid => {
				if (valid) {
					if (this.formData.pointList.length > 1 && !this.checkList(this.formData.pointList)) {
						this.$Message.error('新增提成点需大于上一条提成点！');
						this.$refs.modal.buttonLoading = false;
					}

					if (this.formData.pointList.length === 1 || this.checkList(this.formData.pointList)) {
						if (this.name && this.name === this.formData.name) {
							let rate = [];
							let separate = [];
							this.formData.pointList.forEach(item => {
								rate.push(item.rate);
								separate.push(item.separate);
							});

							// 名字唯一保存数据
							this.$request({
								url: '_HR_SALARY_ADD_PER_GET',
								type: "GET",
								param: {
									type: 2,
									...this.formData,
									rate,
									separate,
									depart_id: this.depart_id
								},
								loading: false
							}).then(response => {
								this.$Message.success('操作成功');
								this.$emit('close');
								this.$store.commit('COLLAGE_SETTING_TEAM_LIST_INIT', this.depart_id);
							}).catch(err => {
								this.$Message.error(err.msg);
							});
						} else {
							// 判断名称是否重复
							this.$request({
								url: API_ROOT._HR_SALARY_CHECK_PER_NAME_GET,
								type: "GET",
								param: {
									name: this.formData.name,
									depart_id: this.depart_id,
									type: 2
								},
								loading: false
							}).then(res => {

								if (res.data.is_have) {
									this.$Message.warning(
										"该名称已存在，请重新输入！"
									);
								} else {
									let rate = [];
									let separate = [];
									this.formData.pointList.forEach(item => {
										rate.push(item.rate);
										separate.push(item.separate);
									});

									// 名字唯一保存数据
									this.$request({
										url: '_HR_SALARY_ADD_PER_GET',
										type: "GET",
										param: {
											type: 2,
											...this.formData,
											rate,
											separate,
											depart_id: this.depart_id
										},
										loading: false
									}).then(response => {
										this.$Message.success('操作成功');
										this.$store.commit('COLLAGE_SETTING_TEAM_LIST_INIT', this.depart_id);
										this.$emit('sure');
									}).catch(err => {
										this.$Message.error(err.msg);
									});
								}
							}).catch(err => {
								this.$Message.error(err.msg);
							});
						}

					}

				} else {
					this.$Message.warning("请按照提示填入信息!");
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const modifyDrawer = CreatePortal({ store: app.$store, alive: true }, module.exports.default);
</script>


<style lang="scss" scoped>
.v-salary-team-modal {
	._detail-header {
		color: #000;
		font-size: 16px;
		height: 31px;
		line-height: 31px;
	}
	._detail-footer {
		width: 940px;
		height: 61px;
		position: fixed;
		bottom: 0;
		right: 0;
		border-top: 1px solid #e8e8e8;
		padding: 10px 16px;
		text-align: left;
		background: #fff;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
	}

}
</style>
