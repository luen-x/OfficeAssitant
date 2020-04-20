<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			title="主持人补贴"
			class="v-collage-setting-subsidy-host-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item label="补贴设置:" prop="moneylabel" />
				<i-form-item
					v-for="(item, index) in formData.money"
					:key="item.id"
					:rules="formdataRule.money"
					:prop="'money.' + index"
					label=""
				>
					<div class="g-flex g-ai-c g-pd-10">
						<div style="background-color: #fafafa; padding: 10px 70px 10px 20px">
							<div style="margin-left: 64px;">
								<i-input-number
									v-model="item.price"
									:max="9999"
									:min="0"
									:precision="0"
									placeholder="请输入金额"
									style="width: 75px;"/>
								<span class="g-m-lr-5">元/</span>
								<i-input-number
									v-model="item.day"
									:max="9"
									:min="1"
									:precision="0"
									placeholder="请输入天数"
									style="width: 75px;"/>
								<span class="g-m-lr-5">天，</span>
								<i-input-number
									v-model="item.person_number"
									:max="9"
									:min="1"
									:precision="0"
									placeholder="请输入人数"
									style="width: 75px;"/>
								<span class="g-m-lr-5">人；</span>
							</div>
							<div class="g-m-t-10">
								<span>关联课程：</span>
								<i-select
									v-model="item.lecture_set_id"
									style="width: 220px"
									clearable
									multiple
									transfer
									placeholder="请选择关联课程"
									@on-change="handleCourseChange($event, index)"
								>
									<i-option
										v-for="(v, index) in courseList"
										:key="index"
										:value="v.lecture_set_id"
									>
										{{ v.name }}
									</i-option>
								</i-select>
							</div>
							<!-- <div>
								<span>关联唱单：</span>
								<i-radio-group v-model="item.is_relate_sing">
									<i-radio :label="1">是</i-radio>
									<i-radio :label="0">否</i-radio>
								</i-radio-group>
							</div> -->
						</div>
						<i
							v-if="!(index == 0 && formData.money.length == 1)"
							class="iconfont icon-remove-circle g-fs-20 g-c-red-mid g-m-lr-10"
							@click="handleListDelete(index)" />
						<i
							v-if="index === formData.money.length - 1 && index !== 9"
							:class="index === 0 ? 'g-m-l-10' : ''"
							class="iconfont icon-add1 g-fs-20 g-c-blue-mid"
							@click="handleListAdd(index)" />
					</div>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, Form, FormItem, Message, InputNumber, Select, Option, Radio, RadioGroup } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'v-collage-setting-course-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-radio': Radio,
		'i-radio-group': RadioGroup
	},
	props: {
		name: Number,
		datas: {
			type: Object,
			default: () => {}
		},
		edit: {
			type: Number,
			default: 0
		},
	},
	data() {
		return {
			visible: false,
			formData: {
				moneylabel: 1,
				money: [
					{
						id: Math.random(),
						price: null,
						day: null,
						person_number: null,
						lecture_set_id: [],
						// is_relate_sing: 0,
					}
				],
			},
			formdataRule: {
				money: {
					type: 'object',
					required: true,
					trigger: 'change',
					fields: {
						price: [{ required: true, type: 'number', message: "金额设置不能为空", pattern: /.+/, trigger: "change" }],
						day: [{ required: true, type: 'number', message: "天数设置不能为空", pattern: /.+/, trigger: "change" }],
						person_number: [{ required: true, type: 'number', message: "天数设置不能为空", pattern: /.+/, trigger: "change" }],
						lecture_set_id: [{ required: true, type: 'array', message: "关联课程不能为空", pattern: /.+/, trigger: "change" }],
					}
				},
				moneylabel: [{ required: true, type: 'number', }]
			},
			courseList: []
		};
	},
	mounted() {
		this.visible = true;
		this.initList();
	},
	methods: {

		async initList() {
			await this.datas.is_set ? this.loadInfo() : '';
			await this.loadCourseList();
		},

		// 课程限制 5 个
		handleCourseChange(e, index) {
			if (e.length > 5) {
				this.formData.money[index].lecture_set_id.pop();
				this.$Message.warning('最多选择5个课程');
			}
		},
		
		// 详情
		async loadInfo() {
			return this.$request({
				url: '_COLLAGE_SETTING_SUBSIDY_INFO_GET',
				type: "GET",
				param: {
					allowance_id: this.datas.allowance_id
				},
				loading: false
			}).then((res) => {
				this.formData.money = res.data.money;
				this.formData.money.map(v => {
					delete v.lecture_set_name_items;
					v.id = Math.random();
					return v;
				});
				this.formData.money.forEach(v => (v.lecture_set_id.length ? v.lecture_set_id = v.lecture_set_id.split(',').map(Number) : ''));
			}).catch((error) => {
			});
		},

		// 关联课程列表
		async loadCourseList() {
			return this.$request({
				url: '_COLLAGE_SETTING_SUBSIDY_COURSE_LIST_GET',
				type: "GET",
				param: {
					type: '2, 3'
				},
				loading: false
			}).then((res) => {
				this.courseList = res.data;
			}).catch((error) => {
			});
		},

		// 课时费添加
		handleListAdd: lodash.debounce(function (index) {
			this.formData.money.push({
				id: Math.random(),
				price: null,
				day: null,
				person_number: null,
				lecture_set_id: [],
				// is_relate_sing: 0
			});
			this.$forceUpdate();
		}, 300),
		handleListDelete(index) {
			this.formData.money.splice(index, 1);
			this.$forceUpdate();
		},

		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		isIntersection(arr1, arr2) {
			return arr1.some(v => arr2.includes(v));
		},
		handleSave() {
			let flag = true;
			let arr = JSON.parse(JSON.stringify(this.formData.money));
			for (let i = 0; i < arr.length; i++) {
				for (let j = 0; j < arr.length; j++) {
					if (
						arr[i].id !== arr[j].id 
						&& this.isIntersection(arr[i].lecture_set_id, arr[j].lecture_set_id)
					) {
						let tempArr = [arr[i], arr[j]];
						// 人数与天数校验;
						let dayAndNumber = tempArr.map(v => {
							return {
								day: v.day,
								person_number: v.person_number
							};
						});
						let nary = dayAndNumber.slice().sort();
						for (let e = 0; e < dayAndNumber.length - 1; e++) {
							if ((nary[e].day == nary[e + 1].day) && (nary[e].person_number == nary[e + 1].person_number)) {
								flag = false;
							}
						}
					}
				}
			}
			

			// // 课程校验
			// let courseData = [];
			// this.formData.money.forEach(v => {
			// 	v.lecture_set_id.forEach(e => {
			// 		courseData.push(e);
			// 	});
			// });
			// if ((new Set(courseData)).size != courseData.length) {
			// 	this.visible = true;
			// 	this.$refs.modal.buttonLoading = false;
			// 	this.$Message.warning('关联课程不能重复选择');
			// 	return;
			// }
			if (flag) {
				this.formData.money.forEach(v => v.lecture_set_id = v.lecture_set_id.join(','));
				let obj = {
					allowance_id: this.datas.allowance_id,
					type: 2,
					money: this.formData.money,
				};
				this.$request({
				url: API_ROOT['_COLLAGE_SETTING_SUBSIDY_EDIT_POST'], // eslint-disable-line
					type: "POST",
					param: obj
				}).then((res) => {
					Message.success('修改成功');
					this.visible = false;
					this.$emit('sure');
				}).catch((error) => {
					Message.error(error.msg);
					this.$refs.modal.buttonLoading = false;
				});
			} else {
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
				this.$Message.warning('规则设置重复，请重新输入');
			}
		},

		handleCancel() {
			this.$emit('close');
		}
	}
};
export const HostModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-setting-subsidy-host-modal {
	.ivu-modal-body {
		max-height: 400px;
		overflow-y: auto;
		.ivu-form-item-content {
			margin-left: 5px !important;
		}
	}
}
</style>


