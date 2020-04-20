<template>
	<div class="v-academy-train-plan-manage">
		<div class="g-flex g-flex-cc">
			<i-form 
				ref="form"
				:model="formData"
				:rules="rules" 
				:label-width="110" 
				style="	max-width: 850px;min-width: 450px;" 
				inline
			>
				<i-form-item label="课程类型:" prop="train_course_type">
					<i-select
						v-model="formData.train_course_type"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择课程类型"
						@on-change="handleChangeCourse"
					>
						<i-option :value="1">谈判训练班</i-option>
						<i-option :value="2">疑难解惑班</i-option>
						<i-option :value="3">运营集训班</i-option>
						<i-option :value="4">管理集训班</i-option>
					</i-select>
				</i-form-item>
				<i-form-item ref="course_name" label="课程名称:" prop="course_name">
					<i-radio-group 
						v-model="formData.course_name_type" 
						style="width: 300px"
						@on-change="handleChangeRadio"
					>
						<i-input 
							v-model="formData.course_name" 
							:maxlength="30" 
							:disabled="formData.course_name_type == 1" 
							placeholder="请输入课程名称，限30个字"
							style="width:180px；margin-right:3px"
							clearable
						/>
						<i-radio :label="1" style="margin-right: 5px;">期数</i-radio>
						<i-radio :label="2" style="margin-right: 5px;">自定义</i-radio>
					</i-radio-group>
				</i-form-item>
				
				<i-form-item ref="echelon" label="参与人员:" prop="echelon">
					<div class="_echelon" style="width:300px">
						<div class="g-flex g-inline-block">
							<div>
								<i-input 
									v-model="formData.echelon.organize_name" 
									:maxlength="16"
									placeholder="输入参与人员分类名称，如：全体人员等"
									style="width: 200px; position: relative; left: -10px; margin-left: 10px;"
								/>
								<span @click="handleAddMember">
									<span 
										v-if="formData.echelon.organize_participator.length" 
										class="g-operation"
									>
										已添加{{ formData.echelon.organize_participator.length }}人
									</span>
									<span v-else class="g-operation">从组织架构选择</span>
								</span>
							</div>
							<div class="g-m-t-10">
								<i-input 
									v-model="formData.echelon.condition_name" 
									:maxlength="16"
									placeholder="输入参与人员分类名称，如：代经理"
									style="width: 200px; position: relative; left: -10px; margin-left: 10px;"
								/>
								<span @click="handleAddCondition">
									<span 
										v-if="formData.echelon.condition_participator.length" 
										class="g-operation"
									>
										已添加{{ formData.echelon.condition_participator.length }}人
									</span>
									<span v-else class="g-operation">设置条件选择</span>
								</span>
							</div>
						</div>
					</div>
				</i-form-item>

				<i-form-item :show-message="lectureVal" prop="lecture" label="授课讲师:">
					<i-select 
						ref="staff"
						v-model="formData.lecture"
						:remote-method="handleSearchTeacher"
						:loading="teachersSearchLoading"
						placeholder="输入讲师名称搜索"
						style="width:300px"
						filterable
						remote
						multiple
						clearable
						@on-change="handleStaffSearch"
					>
						<i-option v-for="staff in teacherList" :key="staff.staff_id" :value="staff.staff_id">
							{{ staff.staff_name }}
						</i-option>
					</i-select>
					<br>
				</i-form-item>
				<i-form-item label="授课时间:" prop="time">
					<i-date-picker
						v-model="formData.time"
						:editable="false"
						split-panels
						separator=" 至 "
						format="yyyy-MM-dd HH:mm"
						type="datetimerange"
						style="width: 300px"
						placeholder="请选择授课时间"
					/>
				</i-form-item>
				<i-form-item label="授课地点:" prop="address">
					<i-input 
						v-model="formData.address" 
						:maxlength="30" 
						placeholder="请输入课程的授课地点"
						style="width:300px"
						clearable
					/>
				</i-form-item>
				<i-form-item class="__schedule-radio" label="同步课程表:" prop="sync_type">
					<i-radio-group v-model="formData.sync_type" style="width: 700px">
						<i-radio :label="1">否</i-radio>
						<i-radio :label="2">同步公司</i-radio>
						<i-radio :label="3">同步事业部</i-radio>
						<i-select
							v-model="formData.course_depart_id"
							clearable
							transfer
							placeholder="请选择事业部"
							style="width: 106px;margin-left: 1px;"
						>
							<i-option
								v-for="(option, index) in departList"
								:value="option.depart_id"
								:key="index">{{ option.depart_name }}</i-option>
						</i-select>
					</i-radio-group>
				</i-form-item>

				<i-form-item label="参训人员说明:" prop="memo">
					<oa-limit-words
						v-model="formData.memo"
						:max="200"
						placeholder="请输入参训人员说明"
						style="width: 724px"
					/>
				</i-form-item>
				<i-form-item label="简介:" prop="brief">
					<oa-limit-words
						v-model="formData.brief"
						:max="200"
						placeholder="请输入简介"
						style="width: 724px"
					/>
				</i-form-item>
			</i-form>
			<!-- footer -->
			<div class="__footer g-flex-cc">
				<div
					class="g-gray-btn-small g-m-r-10"
					@click="handleCancel"
				>
					取消
				</div>
				<vc-debounce-click
					:class="$route.query.edit ? 'g-red-btn' : 'g-gray-btn-small'"
					class="g-m-r-10"
					@click="handleSave($event, 1)"
				>
					保存
				</vc-debounce-click>
				<vc-debounce-click
					v-if="!$route.query.edit"
					class="g-red-btn"
					@click="handleSave($event, 2)"
				>
					保存并继续
				</vc-debounce-click>
			</div>
		</div>
	</div>
	
</template>
<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Select, Option, DatePicker, Cascader, Message,
	Radio, RadioGroup, Checkbox, CheckboxGroup, Button, Tree
} from 'iview';
// utils
import { dataValidity, oneLinePipe, getParseUrl, getHashUrl, formatDate, getItem, initTreeData } from '@utils/utils';
import { services, staffByMutiTerm } from "@stores/services/hr";
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { ImgsPicker } from 'wya-vc';
import ContentUpload from '@components/content/_common/upload';
import { ConditionModal } from '@components/academy/_common/course-add/condition-modal';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { ChooseStaff } from '@components/hr/_common/academy-course/drawers/choose-staff'; 
import { setData, findTreePath } from '@components/hr/_common/academy-course/util';
import item from './item';

export default {
	name: 'oa-content',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'vc-imgs-picker': ImgsPicker,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-button': Button,
		'oa-content-upload': ContentUpload
	},
	mixins: [
		item, 
		staffByMutiTerm,
		services.departAll() 
	],
	props: {
		datas: Object
	},
	data() {
		return {
			obj: {}, // 转存
			number: this.$route.query.number || '',
			departList: []
		};
	},
	created() {
		this.loadDepartData();
		this.$route.query.edit ? this.loadData() : '';
	},
	methods: {
		loadDepartData() {
			this.$request({
				url: "_HR_DEPART_ALL_GET",
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.departList = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleChangeRadio(e) {
			if (e == 1 && this.formData.course_name_type) {
				this.loadCourseName();
			}
		},
		handleChangeCourse(e) {
			if (this.formData.course_name_type == 1) {
				this.loadCourseName();
			}
		},
		loadCourseName() {
			this.$request({
				url: "_ACADEMY_SUPPORT_COURSE_NAME_BY_TRAIN_GET",
				type: 'GET',
				param: {
					course_id: this.$route.query.course_id,
					train_course_type: this.formData.train_course_type
				},
				loading: false
			}).then((res) => {
				this.formData.course_name = res.data.course_name;
				this.formData.period = res.data.period;
			}).catch((error) => {
			});
		},
		// 处理后端数据成formData
		async initData(data) {
			setData(this.formData, data);
			this.formData.echelon = {
				condition_name: '',
				condition_participator: [],
				organize_name: '',
				organize_participator: []
			};
			this.formData.time = [data.start_time, data.end_time];
			this.formData.echelon.organize_participator = data.organize_participator;
			this.formData.echelon.organize_name = data.organize_name;
			this.formData.echelon.condition_participator = data.condition_participator;
			this.formData.echelon.condition_name = data.condition_name;
			this.teacherList = this.formData.lecture;
			this.formData.lecture = this.formData.lecture.map(i => i.staff_id);
			this.formData.course_depart_id = data.course_depart_id;
			this.formData.sync_type = Number(data.sync_type);
		},
		loadData() {
			this.$request({
				url: "_ACADEMY_SUPPORT_TRAIN_COURSE_DETAIL_GET",
				type: 'GET',
				param: {
					course_id: this.$route.query.course_id
				},
				loading: false
			}).then((res) => {
				this.initData(res.data);
			}).catch((error) => {
			});
		},
		// 远程搜索教师列表
		handleSearchTeacher(query) {
			this.teachersSearchLoading = true;
			this.$request({
				url: "_HR_NAME_OR_PHONE_STAFF_GET",
				type: 'GET',
				param: {
					search: query.trim()
				},
				loading: false
			}).then((res) => {
				this.teachersSearchLoading = false;
				this.teacherList = res.data;
			}).catch((error) => {
				this.teachersSearchLoading = false;
			});
		},
		// 限制教师最多4人
		handleStaffSearch(staffs) {
			if (staffs.length > 4) {
				this.formData.lecture.pop();
				this.$Message.warning('已选择4人，无法再选择');
			}
		},
		// 添加参与人员
		handleAddMember() {
			ChooseStaff.popup({ members: this.formData.echelon.organize_participator }).then((res) => {
				this.formData.echelon.organize_participator = res;
				if (this.$refs.echelon) {
					this.$refs.form.validateField("echelon");
				}
			}).catch(() => {
				console.error('error');
			});
		},
		handleAddCondition() {
			ConditionModal.popup({ 
				condition: this.formData.condition
			}).then((res) => {
				this.formData.echelon.condition_participator = res.staff;
				this.formData.condition = res.condition;
				this.formData.echelon.condition_participator.length
					? '' : this.$Message.warning('暂无符合条件的人员');
			}).catch(() => {
				console.error('error');
			});
		},
		// 取消
		handleCancel() {
			ModalTip.popup({
				title: '提示',
				content: '取消后内容将无法回复，确认取消吗？'
			}).then(res => {
				this.$router.go(-1);
			});
		},
		// 保存 && 保存并继续
		handleSave(event, num) {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					if (this.formData.sync_type == 3 && !this.formData.course_depart_id) {
						this.$Message.warning('请选择事业部');
					} else if (this.formData.time[0] 
						&& (moment(this.formData.time[0]).format('YYYY-MM-DD HH:mm') == moment(this.formData.time[1]).format('YYYY-MM-DD HH:mm'))) {
						this.$Message.warning('授课开始时间不能等于结束时间');
					} else {
						this.handleSub(num);
					}
				}
			});
		},
		handleSub(num) {
			let obj = {
				type: 3,
				train_course_type: this.formData.train_course_type,
				course_name: this.formData.course_name,
				course_name_type: this.formData.course_name_type,
				organize_name: this.formData.echelon.organize_name,
				condition_name: this.formData.echelon.condition_name,
				address: this.formData.address,
				start_time: moment(this.formData.time[0]).format('YYYY-MM-DD HH:mm'),
				end_time: moment(this.formData.time[1]).format('YYYY-MM-DD HH:mm'),
				lecture: this.formData.lecture,
				organize_participator: this.formData.echelon.organize_participator.map(v => v.staff_id),
				condition_participator: this.formData.echelon.condition_participator.map(v => v.staff_id),
				condition: this.formData.condition,
				sync_type: this.formData.sync_type,
				course_depart_id: this.formData.course_depart_id,
				brief: this.formData.brief,
				memo: this.formData.memo,
				period: this.formData.period
			};
			this.$route.query.edit ? obj.course_id = this.$route.query.course_id : '';
			let api = this.$route.query.edit ? '_ACADEMY_SUPPORT_TRAIN_COURSE_EDIT_POST' : '_ACADEMY_SUPPORT_TRAIN_COURSE_SAVE_POST';
			this.$request({
				url: api,
				type: "POST",
				param: obj,
				loading: false
			}).then(res => {
				this.$Message.success(this.$route.query.edit ? '编辑成功' : '新建成功');
				if (num == 1) {
					this.$route.query.date_time ? this.$router.push({
						path: `/academy/main`,
						query: {
							date: this.$route.query.date_time,
							type: this.$route.query.type,
							depart_id: this.$route.query.depart_id
						}
					}) : this.$router.push({
						path: `/academy/train/plan`,
						query: {
							type: 3
						}
					});
				} else {
					this.formData.lecture = [];
					this.formData.attachment = [];
					this.lectureVal = false;
					this.formData.condition = {};
					
					this.$refs.form.resetFields();
					setTimeout(() => {
						this.$refs.form.resetFields(); 
						this.formData.echelon = {
							condition_name: '',
							condition_participator: [],
							organize_name: '',
							organize_participator: []
						};
						this.$nextTick(() => {
							this.lectureVal = true;
						});
					}, 0);
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss" >
.v-academy-train-plan-manage {
	margin-top: 30px;
	margin-bottom: 100px;
	._container{
		display: flex;
		justify-content: center;
		max-width: 850px;
		min-width: 450px;
	}
	.__schedule-radio {
		.ivu-radio-wrapper {
			margin-right: 3px !important;
		}
	}
	.ivu-select-multiple .ivu-select-selection {
		max-height: 100px;
		overflow-y: auto;
	}
	._members {
		min-height: 32px;
		width:200px;
		overflow-y: auto;
		display: block;
		box-sizing: border-box;
		outline: 0;
		user-select: none;
		cursor: pointer;
		position: relative;
		background-color: #fff;
		border-radius: 4px;
		border: 1px solid #dddee1;
		transition: all .2s ease-in-out;
		padding: 2px 24px 2px 4px;
	}
	.__footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>
