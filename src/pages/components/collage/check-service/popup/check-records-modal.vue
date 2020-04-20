<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			:title="title +'质检记录'"
			class="v-collage-check-service-check-records-modal"
			footer-hide
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="120" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10 g-tabs-card"
			>
				<i-form-item label="质检方式:" prop="quality_type">
					<i-select
						v-model="formData.quality_type"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择质检方式"
					>
						<i-option
							v-for="(v, index) in methodList"
							:key="index"
							:value="v.id"
						>
							{{ v.name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-if="formData.quality_type !== null && formData.quality_type !== 1" label="上传凭证：" prop="fileImage">
					<oa-upload
						v-model="formData.fileImage" 
						:max="3"
						:upload="{multiple: true, max: 3}"
						style="width: 300px"
					/>
				</i-form-item>
				<i-form-item v-if="formData.quality_type == 1" label="接通情况:" prop="call_status">
					<i-radio-group v-model="formData.call_status">
						<i-radio :label="1">正常接通</i-radio>
						<span>
							<i-radio :label="2">未接</i-radio>
						</span>
						<i-radio :label="3">无效</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-tabs 
					:value="type"
					:animated="false" 
					:class="{'_hidden': formData.quality_lesson.length <= 1}"
					type="card"
					class="g-m-t-20"
					@on-click="handleClickTabs"
				>
					<i-tab-pane 
						v-for="(e, index) in formData.quality_lesson"
						:key="index"
						:label="e.lecture_set_name"
						:name="e.type"
					>
						<i-form-item 
							:prop="'quality_lesson.' + index + '.whole_score'"
							:rules="formData.call_status == 2 
								|| formData.call_status == 3 
								? { type: 'number' } 
							: formdataRule.whole_score"
							label="总体评分："
						>
							<i-input-number
								v-model="formData.quality_lesson[index].whole_score"
								:max="10"
								:min="0"
								:precision="2"
								:active-change="false"
								:disabled="formData.call_status == 2 || formData.call_status == 3"
								placeholder="请输入"
								style="width: 220px;"/>
						</i-form-item>
						<div
							v-for="(e, index1) in formData.quality_lesson[index].lesson_score_items"
							:key="index1"
						>
							<i-form-item 
								:label="e.role_type_name + '：'"
							>
								<div 
									v-for="(k, index2) in e.staff_list"
									:key="index2"
									:style="index2 ? 'margin-top: 20px' : ''"
								>
									<span style="display: inline-block; width: 70px;">
										{{ k.staff_name }}
									</span>
									<i-input-number
										v-model="k.score"
										:max="10"
										:min="0"
										:precision="2"
										:active-change="false"
										:disabled="formData.call_status == 2 || formData.call_status == 3"
										placeholder="请输入评分"
										style="width: 220px;"/>
								</div>
							</i-form-item>
						</div>
						<i-form-item 
							v-if="formData.quality_lesson[index].lesson_type == 1"
							label="印象最好的老师："
						>
							<i-select
								v-model="formData.quality_lesson[index].good_staff_ids"
								:disabled="formData.call_status == 2 || formData.call_status == 3"
								style="width: 220px"
								clearable
								multiple
								transfer
								placeholder="请选择印象最好的老师"
							>
								<i-option
									v-for="(v, index) in formData.quality_lesson[index].lectureList"
									:key="index"
									:value="v.staff_id"
								>
									{{ v.staff_name }}
								</i-option>
							</i-select>
						</i-form-item>
						<i-form-item 
							label="好的反馈："
						>
							<oa-limit-words
								v-model="formData.quality_lesson[index].good_feedback" 
								:max="200" 
								:disabled="formData.call_status == 2 || formData.call_status == 3"
								width="220px"
								class="g-dp-ib"
								placeholder="请输入好的反馈"
							/>
						</i-form-item>
						<i-form-item 
							label="改善意见："
						>
							<oa-limit-words
								v-model="formData.quality_lesson[index].improve_advice" 
								:max="200" 
								:disabled="formData.call_status == 2 || formData.call_status == 3"
								width="220px"
								class="g-dp-ib"
								placeholder="请输入改善意见"
							/>
						</i-form-item>
						<i-form-item 
							label="备注："
						>
							<oa-limit-words
								v-model="formData.quality_lesson[index].remark" 
								:max="200" 
								width="220px"
								class="g-dp-ib"
								placeholder="请输入备注"
							/>
						</i-form-item>
					</i-tab-pane>
				</i-tabs>
			</i-form>
			<div name="footer" class="_footer">
				<i-button v-if="!index" size="large" type="text" @click="handleCancel">取消</i-button>
				<i-button v-if="index" size="large" type="text" @click="handlePre">上一个</i-button>
				<i-button v-if="index !== formData.quality_lesson.length - 1" size="large" type="primary" @click="handleNext">下一个</i-button>
				<i-button v-if="index == formData.quality_lesson.length - 1" type="primary" size="large" @click="handleOk">确定</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, Form, FormItem, Message, InputNumber, 
	Select, Option, Radio, RadioGroup, Tabs, TabPane, Button } from 'iview';
import API_ROOT from '@stores/apis/root';
import Upload from "@components/_common/upload/upload";
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
		'i-tab-pane': TabPane,
		"oa-upload": Upload,
		"i-button": Button
	},
	props: {
		name: Number,
		datas: Array,
		edit: {
			type: Number,
			default: 0
		},
		quality_id: Number,
		quality_record_id: Number,
	},
	data() {
		return {
			index: 0,
			title: this.edit ? '编辑' : '添加',
			type: '1',
			visible: false,
			formData: {
				quality_id: this.quality_id,
				quality_type: null,
				call_status: null,
				fileImage: [],
				quality_lesson: lodash.cloneDeep(this.datas).map(v => ({
					...v,
					whole_score: null
				}))
			},
			formdataRule: {
				call_status: [{ type: 'number', required: true, message: '请选择接通情况', trigger: 'change' }],
				quality_type: [{ type: 'number', required: true, message: '请选择质检方式', trigger: 'change' }],
				whole_score: [{ required: true, type: 'number', message: "总评分不能为空", pattern: /.+/, trigger: "change" }],
				fileImage: [{ required: true, type: "array", message: "请上传投诉凭证", trigger: "change" }]
			},
			methodList: [
				{
					id: 1,
					name: '电话质检'
				}, {
					id: 2,
					name: '微信质检'
				}, {
					id: 3,
					name: 'QQ质检'
				}, {
					id: 4,
					name: '短信质检'
				}, {
					id: 5,
					name: '其他'
				}
			],
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		async loadData() {
			await this.loadLabelInfo();
			this.edit ? await this.loadInfo() : await this.loadInfoData();
		},
		handlePre() {
			this.type = (this.index) + '';
			this.index = this.index - 1;
		},
		handleNext() {
			this.type = (this.index + 2) + '';
			this.index = this.index + 1;
		},
		handleClickTabs(e) {
			this.index = Number(e) - 1;
		},
		// 添加时获取详情
		async loadInfoData() {
			return this.$request({
				url: '_COLLAGE_CHECK_SERVICE_RECORDS_ADD_INFO_GET',
				type: "GET",
				param: {
					lesson_ids: this.formData.quality_lesson.map(v => v.lesson_id)
				},
				loading: false
			}).then((res) => {
				this.formData.quality_lesson.forEach(v => {
					res.data.forEach(e => {
						if (v.lesson_id == e.lesson_id) {
							v.good_feedback = e.good_feedback;
							v.improve_advice = e.improve_advice;
							v.remark = e.remark;
							v.whole_score = +e.whole_score;
							v.good_staff_ids = e.good_staff_ids.split(',').map(Number);
							e.qualityRecordLessonScore.forEach(m => {
								v.lesson_score_items.forEach(k => {
									k.staff_list.forEach(f => {
										if (f.staff_id == m.staff_id && f.role_type == m.role_type) {
											f.score = m.real_score == '-1.00' ? null : +m.real_score;
										}
									});
								});
							});
						}
					});
				});
			}).catch((error) => {
			});
		},
		// 编辑获取详情
		async loadInfo() {
			return this.$request({
				url: '_COLLAGE_CHECK_SERVICE_RECORDS_INFO_GET',
				type: "GET",
				param: {
					quality_record_id: this.quality_record_id
				},
				loading: false
			}).then((res) => {
				this.formData.quality_type = res.data.quality_type;
				this.formData.call_status = res.data.call_status;
				res.data.fileImage.length ? res.data.fileImage.forEach(item => {
					this.formData.fileImage.push({
						url: item.img_url,
						title: item.img_url.split("/")[6],
						type: "." + item.img_url.split("/")[6].split(".")[1],
						uid: item.img_url
					});
				}) : '';
				this.formData.quality_lesson.forEach(v => {
					res.data.qualityRecordLesson.forEach(e => {
						if (v.lesson_id == e.lesson_id) {
							v.whole_score = e.whole_score == '-1.00' ? null : +e.whole_score;
							v.remark = e.remark;
							v.good_feedback = e.good_feedback;
							v.improve_advice = e.improve_advice;
							v.good_staff_ids = e.good_staff_ids.split(',').map(Number);
						}
						e.qualityRecordLessonScore.forEach(m => {
							v.lesson_score_items.forEach(k => {
								k.staff_list.forEach(f => {
									if (f.staff_id == m.staff_id && f.role_type == m.role_type) {
										f.score = m.real_score == '-1.00' ? null : +m.real_score;
									}
								});
							});
						});
					});
				});
			}).catch((error) => {

			});
		},
		// 动态表单名
		async loadLabelInfo() {
			return this.$request({
				url: '_COLLAGE_CHECK_SERVICE_LESSON_RECORD_LIST_GET',
				type: "GET",
				param: {
					lesson_ids: this.formData.quality_lesson.map(v => v.lesson_id).join(',')
				},
				loading: false
			}).then((res) => {
				this.formData.quality_lesson.forEach((v, index) => {
					if (res.data[index].lesson_record_info.length) {
						v.lectureList = res.data[index].lesson_record_info.filter(k => k.role_type == 4).length
						 ? res.data[index].lesson_record_info.filter(k => k.role_type == 4)[0].staff_list : [];
					}
					res.data.forEach(e => {
						// v.lectureList = e.lesson_record_info.filter(k => k.role_type == 4)[0].staff_list;
						if (+e.lesson_id == v.lesson_id) {
							v.lesson_score_items = e.lesson_record_info;
						}
					});
				});
				this.formData.quality_lesson.forEach(v => {
					v.lesson_score_items.forEach(e => {
						e.staff_list.forEach(k => {
							k.score = null;
						});
					});
				});
			}).catch((error) => {
			});
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
			let obj = this.formData;
			if (this.edit) {
				obj.quality_record_id = this.quality_record_id;
			}
			if (this.formData.quality_type !== 1) {
				obj.call_status = 0;
			}
			if (this.formData.quality_type == 1) {
				obj.fileImage = [];
			}
			obj.quality_lesson.forEach(v => {
				let lessonArray = [];
				v.good_staff_ids = v.good_staff_ids.join(',');
				v.lesson_score_items.forEach(e => {
					e.staff_list.forEach(k => {
						if (k.score == null) {
							k.score = -1;
						}
						lessonArray.push(k);
					});
				});
				v.lesson_score_items = lessonArray;
			});
			let api = this.edit ? '_COLLAGE_CHECK_SERVICE_CHECK_RECORDS_EDIT_POST' : '_COLLAGE_CHECK_SERVICE_CHECK_RECORDS_POST';
			this.$request({
				url: API_ROOT[api], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				this.edit ? Message.success('修改成功') : Message.success('添加成功');
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
export const RecordsModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-check-service-check-records-modal {
	.ivu-modal-body {
		max-height: 650px;
		overflow: hidden;
	}
	.ivu-tabs-tabpane {
		max-height: 280px;
		overflow-y: auto;
	}
	._footer{
		height: 72px;
		line-height: 72px;
		text-align: right;
	}
	._hidden {
		.ivu-tabs-nav-scroll {
			display: none;
		}
		.ivu-tabs-bar {
			border-bottom: none;
		}
		.ivu-tabs-nav-container {
			display: none;
		}
	}
}
</style>


