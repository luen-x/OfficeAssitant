<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			title="流程对接补贴"
			class="v-collage-setting-subsidy-join-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="110" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10 g-tabs-card"
			>
				<i-tabs 
					:value="type" 
					:animated="false"
					type="card" 
					class="g-m-t-20"
				>
					<i-tab-pane 
						v-for="(e, index) in formData.allowance_data"
						:key="e.type"
						:label="e.label"
						:name="e.type"
					>
						<i-form-item label="流程费比例:" prop="moneylabel" />
						<div>
							<i-form-item
								v-for="(item, index1) in formData.allowance_data[index].process_fee_ratio"
								:key="index1"
								:rules="formdataRule.process_fee_ratio"
								:prop="'allowance_data.' + index + '.process_fee_ratio.' + index1"
								label=""
							>
								<div class="g-flex g-ai-c g-pd-10" style="background-color: #fafafa">
									<div>
										<span>学习次数</span>
										<i-input-number
											v-model="item.study_num_begin"
											:disabled="!!index1"
											:max="100"
											:min="0"
											:precision="0"
											placeholder="请输入"
											style="width: 75px;"/>
										-
										<i-input-number
											v-model="item.study_end_num"
											:max="100"
											:min="0"
											:precision="0"
											placeholder="请输入"
											style="width: 75px;"/>
										<span class="g-m-lr-5">次；</span>
										<span class="g-m-l-10">比例</span>
										<i-input-number
											v-model="item.ratio"
											:max="100"
											:min="0"
											:precision="0"
											placeholder="请输入"
											style="width: 75px;"/>
										<span>%</span>

									</div>
									<i
										v-if="index1 !== 0"
										class="iconfont icon-remove-circle g-fs-20 g-c-red-mid g-m-lr-10"
										@click="handleProcessDelete(index, index1)" />
									<i
										v-if="index1 === formData.allowance_data[index].process_fee_ratio.length - 1 && index1 !== 9"
										:class="index1 === 0 ? 'g-m-l-10' : ''"
										class="iconfont icon-add1 g-fs-20 g-c-blue-mid"
										@click="handleProcessAdd(index, index1)" />
								</div>
							</i-form-item>
						</div>

						<i-form-item label="流程费设置:" prop="moneylabel" />
						<i-form-item
							v-for="(item, index1) in formData.allowance_data[index].process_fee"
							:key="item.id"
							:rules="formdataRule.process_fee"
							:prop="'allowance_data.'+index+'.process_fee.' + index1"
							label=""
						>
							<div class="g-flex g-ai-c g-pd-10" style="background-color: #fafafa">
								<div>
									<i-input-number
										v-model="item.price"
										:max="9999"
										:min="0"
										:precision="0"
										placeholder="请输入金额"
										style="width: 75px;"/>
									<span class="g-m-lr-5">元/<span>{{ e.type == '1' ? '套' : '客户' }}</span>；</span>
									<span class="g-m-l-10">关联课程：</span>
									<i-select
										v-model="item.lecture_set_id"
										style="width: 220px"
										clearable
										multiple
										transfer
										placeholder="请选择关联课程"
										@on-change="handleCourseChange($event, index, index1)"
									>
										<i-option
											v-for="(item1, v) in courseList[index]"
											:key="v"
											:value="item1.lecture_set_id"
										>
											{{ item1.name }}
										</i-option>
									</i-select>
								</div>
								<i
									v-if="!(index == 0 && formData.allowance_data[index].process_fee.length == 1)"
									class="iconfont icon-remove-circle g-fs-20 g-c-red-mid g-m-l-10"
									@click="handleListDelete(index, index1)" />
								<i
									v-if="index1 === formData.allowance_data[index].process_fee.length - 1 && index1 !== 9"
									:class="index1 === 0 ? 'g-m-l-10' : ''"
									class="iconfont icon-add1 g-fs-20 g-c-blue-mid"
									@click="handleListAdd(index, index1)" />
							</div>
						</i-form-item>
					</i-tab-pane>
				</i-tabs>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, Form, FormItem, Message, InputNumber, 
	Select, Option, Radio, RadioGroup, Tabs, TabPane } from 'iview';
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
		'i-radio-group': RadioGroup,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane
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
			type: '1',
			visible: false,
			formData: {
				allowance_data: [
					{
						type: '1',
						label: '线上课程',
						process_fee_ratio: [
							{
								study_num_begin: null,
								study_end_num: null,
								ratio: null,
							}
						],
						process_fee: [
							{
								id: Math.random(),
								price: null,
								lecture_set_id: []
							}
						]
					},
					{
						type: '2',
						label: '线下课程',
						process_fee_ratio: [
							{
								study_num_begin: null,
								study_end_num: null,
								ratio: null,
							}
						],
						process_fee: [
							{
								id: Math.random(),
								price: null,
								lecture_set_id: []
							}
						]
					}
				],
				moneylabel: 1,
				money: [
					{
						id: Math.random(),
						price: null,
						lecture_set_id: [],
					}
				],
			},
			formdataRule: {
				process_fee: {
					type: 'object',
					required: true,
					trigger: 'change',
					fields: {
						price: [{ required: true, type: 'number', message: "金额设置不能为空", pattern: /.+/, trigger: "change" }],
						lecture_set_id: [{ required: true, type: 'array', message: "关联课程不能为空", pattern: /.+/, trigger: "change" }],
					}
				},
				process_fee_ratio: {
					type: 'object',
					required: true,
					trigger: 'change',
					fields: {
						study_num_begin: [{ required: true, type: 'number', message: "学习开始次数不能为空", pattern: /.+/, trigger: "change" }],
						study_end_num: [{ required: true, type: 'number', message: "学习结束次数不能为空", pattern: /.+/, trigger: "change" }],
						ratio: [{ required: true, type: 'number', message: "比例设置不能为空", pattern: /.+/, trigger: "change" }],
					}
				},
				moneylabel: [{ required: true, type: 'number', }]
			},
			courseList: [[], []]
		};
	},
	mounted() {
		this.visible = true;
		this.initList();
	},
	methods: {

		async initList() {
			await this.datas.is_set ? this.loadInfo() : '';
			await this.loadCourseOnlineList();
			await this.loadCourseOffonlineList();
		},

		// 课程限制 5 个
		handleCourseChange(e, index, index1) {
			if (e.length > 5) {
				this.formData.allowance_data[index].process_fee[index1].lecture_set_id.pop();
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
				this.formData.allowance_data = res.data;
				this.formData.allowance_data.forEach(v => {
					v.type += '';
					v.label = v.type == '1' ? '线上课程' : '线下课程';
					v.process_fee.forEach(e => e.lecture_set_id = e.lecture_set_id.split(',').map(Number));
					v.process_fee.map(e => {
						e.id = Math.random();
						delete e.lecture_set_name_items;
						return e;
					});
				});
			}).catch((error) => {
			});
		},

		// 关联课程列表
		async loadCourseOnlineList() {
			return this.$request({
				url: '_COLLAGE_SETTING_SUBSIDY_COURSE_LIST_GET',
				type: "GET",
				param: {
					type: '1'
				},
				loading: false
			}).then((res) => {
				this.courseList.splice(0, 1, res.data);
			}).catch((error) => {
			});
		},
		// 关联课程列表
		async loadCourseOffonlineList() {
			return this.$request({
				url: '_COLLAGE_SETTING_SUBSIDY_COURSE_LIST_GET',
				type: "GET",
				param: {
					type: '2'
				},
				loading: false
			}).then((res) => {
				this.courseList.splice(1, 1, res.data);
			}).catch((error) => {
			});
		},

		// 流程费设置
		handleListAdd: lodash.debounce(function (index, index1) {
			this.formData.allowance_data[index].process_fee.push({
				id: Math.random(),
				price: null,
				lecture_set_id: [],
			});
			this.$forceUpdate();
		}, 300),
		handleListDelete(index, index1) {
			this.formData.allowance_data[index].process_fee.splice(index1, 1);
			this.$forceUpdate();
		},
        
		// 设置流程比例
		handleProcessAdd: lodash.debounce(function (index, index1) {
			if (this.formData.allowance_data[index].process_fee_ratio[index1].study_end_num === null 
			|| this.formData.allowance_data[index].process_fee_ratio[index1].study_num_begin === null
			|| this.formData.allowance_data[index].process_fee_ratio[index1].ratio === null) {
				this.$Message.warning('请填写完整信息');
			} else {
				if (this.formData.allowance_data[index].process_fee_ratio[index1].study_end_num
				< this.formData.allowance_data[index].process_fee_ratio[index1].study_num_begin) {
					this.$Message.warning('结束次数需大于开始次数');
					return;
				}
				this.formData.allowance_data[index].process_fee_ratio.push({
					study_num_begin: this.formData.allowance_data[index].process_fee_ratio[index1].study_end_num + 1,
					study_end_num: null,
					ratio: null,
				});
			}
			this.$forceUpdate();
		}, 300),
		handleProcessDelete(index, index1) {
			this.formData.allowance_data[index].process_fee_ratio.splice(index1, 1);
			this.$forceUpdate();
		},

		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$Message.warning('还有必填项未设置');
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			// 课程校验
			let courseData = [];
			this.formData.allowance_data.forEach(v => {
				v.process_fee.forEach(k => {
					k.lecture_set_id.forEach(e => {
						courseData.push(e);
					});
				});
			});
			if ((new Set(courseData)).size != courseData.length) {
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
				this.$Message.warning('关联课程不能重复选择');
				return;
			}

			this.formData.allowance_data.forEach(e => {
				e.process_fee.forEach(v => v.lecture_set_id = v.lecture_set_id.join(','));
			});
			let obj = {
				allowance_id: this.datas.allowance_id,
				allowance_data: this.formData.allowance_data,
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
		},

		handleCancel() {
			this.$emit('close');
		}
	}
};
export const JoinModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-setting-subsidy-join-modal {
	.ivu-tabs-tabpane {
		height: 300px;
		overflow-y: auto;
	}
}
</style>


