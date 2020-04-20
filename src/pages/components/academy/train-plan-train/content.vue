<template>
	<div class="v-academy-support-course-add">
		<div class="g-flex g-flex-cc">
			<i-form 
				ref="form"
				:model="formData"
				:rules="rules" 
				:label-width="110" 
				style="	max-width: 850px;min-width: 450px;" 
				inline
			>
				<i-form-item ref="course_name" label="课程名称:" prop="course_name">
					<i-input 
						v-model="formData.course_name" 
						:maxlength="30" 
						placeholder="请输入课程名称，限30个字" 
						style="width:211px"
						clearable
					/>
					<i-button 
						type="primary"
						style="width: 80px;"
						class="g-m-l-5"
						@click="handleSelectCourse"
					>
						选择课程
					</i-button>
				</i-form-item>
				<i-form-item label="课程时长:" prop="course_time">
					<i-input 
						v-model="formData.course_time" 
						:maxlength="3" 
						placeholder="请输入课程时长" 
						style="width:300px"
					>
						<span slot="suffix" style="line-height: 32px;">分钟</span>
					</i-input>
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
				<i-form-item label="授课地点:" prop="address">
					<i-input 
						v-model="formData.address" 
						:maxlength="30" 
						placeholder="请输入课程的授课地点"
						style="width:300px"
						clearable
					/>
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
				<i-form-item label="授课部门:" prop="depart_id">
					<i-cascader
						:data="departAll"
						v-model="formData.depart_id"
						:change-on-select="true"
						:clearable="false"
						placeholder="请选择部门"
						trigger="click"
						transfer
						style="width: 300px"
					/>
				</i-form-item>
				<i-form-item label="举办方:" prop="organizer_depart_id">
					<i-cascader
						:data="departAll"
						v-model="formData.organizer_depart_id"
						:change-on-select="true"
						:clearable="false"
						placeholder="请选择部门"
						trigger="click"
						transfer
						style="width: 300px"
					/>
				</i-form-item>
				<i-form-item class="__schedule-radio" label="同步课程表:" prop="sync_type">
					<i-radio-group v-model="formData.sync_type" style="width: 300px">
						<i-radio :label="1" style="margin-right: 5px;">否</i-radio>
						<i-radio :label="2">同步公司</i-radio>
						<i-radio :label="3">同步事业部</i-radio>
						<i-select
							v-model="formData.course_depart_id"
							clearable
							transfer
							placeholder="请选择事业部"
							style="width: 106px;"
						>
							<i-option
								v-for="(option, index) in departList"
								:value="option.depart_id"
								:key="index">{{ option.depart_name }}</i-option>
						</i-select>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="同步课程支持:" prop="is_sync">
					<i-radio-group v-model="formData.is_sync" style="width: 300px">
						<i-radio :label="0">否</i-radio>
						<i-radio :label="1">是</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="用途:">
					<i-radio-group v-model="formData.use" style="width:300px">
						<i-radio :label="1" style="width:50px;margin-right:0">其他</i-radio>
						<i-radio :label="2" style="width:80px;margin-right:0">用于晋升</i-radio>
						<i-radio :label="3" style="width:80px;margin-right:0">用于晋级</i-radio>
						<i-radio :label="4" style="width:70px;margin-right:0">用于学分</i-radio>
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
									style="width: 300px; position: relative; left: -10px; margin-left: 10px;"
								/>
								<span @click="handleAddMember">
									<span 
										class="g-operation"
									>
										从组织架构选择，已选择{{ formData.echelon.organize_participator.length }}人
									</span>
								</span>
							</div>
							<div class="g-m-t-10">
								<i-input 
									v-model="formData.echelon.condition_name" 
									:maxlength="16"
									placeholder="输入参与人员分类名称，如：代经理"
									style="width: 300px; position: relative; left: -10px; margin-left: 10px;"
								/>
								<span @click="handleAddCondition">
									<span
										class="g-operation"
									>
										设置条件选择，已选择{{ formData.echelon.condition_participator.length }}人
									</span>
								</span>
							</div>
						</div>
					</div>
				</i-form-item>
				<i-form-item label="相关课件:" prop="attachment">
					<oa-content-upload
						v-if="showUpload"
						ref="upload" 
						v-model="formData.attachment" 
						:size="200"
						:max="10"
						:color="'#e74854'"
						style="margin:0;width:300px"
						accept=".rar, .zip, .doc, .docx, .pdf, .jpg, .png, .ppt, .MP3, .MP4, .xlsx, .avi, .wmv, .flv, .vob, .dat, .mkv, .asf, .asx" 
						@error="handleFileError"
					>
						<div slot="trigger" class="g-flex">
							<i-button>本地上传</i-button>
							<div class="g-col" @click.stop="()=>{}">
								<i-button class="g-m-l-10" @click.stop="handleChooseMaterial">自习室中选取</i-button>
							</div>
						</div>
						<div slot="top" class="g-c-black4 g-m-t-5" style="line-height: 16px">
							本地上传支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .ppt .MP3 .xlsx .mp4 .avi .wmv .flv
						</div>
						<span 
							v-for="(item,index) in formData.attachment" 
							:key="index" 
							:slot="'check'+index" 
							style="position:absolute;right:-90px"
						>
							<i-checkbox v-model="item.is_download" :key="item.url">允许下载</i-checkbox>
						</span>
					</oa-content-upload>
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
import { ChooseMaterial } from '@components/hr/_common/academy-course/modals/choose-material';
import { setData, findTreePath } from '@components/hr/_common/academy-course/util';
import { ModalCourse } from './popup/course-modal';
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
			departList: [],
			showUpload: true
		};
	},
	created() {
		this.loadDepartData();
		let depart = getItem("firstDepartId_" + _global.version, 'localStorage');
		this.formData.depart_id = [depart.res.data.sale];
		this.formData.organizer_depart_id = [depart.res.data.x];
		this.$route.query.edit ? this.loadData(this.$route.query.course_id) : '';
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
		handleSelectCourse() {
			ModalCourse.popup().then(res => {
				this.loadData(res, 'select');
			});
		},
		// 处理后端数据成formData
		async initData(data) {
			if (Object.keys(data).length) {
				setData(this.formData, data);
				this.formData.course_name = data.course_name;
				this.formData.echelon = {
					condition_name: '',
					condition_participator: [],
					organize_name: '',
					organize_participator: []
				};
				this.formData.use = data.use;
				this.formData.time = [data.start_time, data.end_time];
				this.formData.attachment = data.attachment.map(it => ({
					url: it.attachment_url,
					size: it.file_size,
					source: it.source,
					is_download: !!it.is_download,
					uid: it.attachment_url,
					percent: "100.00",
					material_id: it.material_id,
					title: it.attachment_name || this.getFileNameFromUrl(it.attachment_url),		 
				}));
				this.$refs.upload.$refs.filesPicker.data = this.formData.attachment;
				this.formData.echelon.organize_participator = data.organize_participator;
				this.formData.echelon.organize_name = data.organize_name;
				this.formData.echelon.condition_participator = data.condition_participator;
				this.formData.echelon.condition_name = data.condition_name;
				this.formData.course_time = this.formData.course_time ? this.formData.course_time : '';
				this.teacherList = this.formData.lecture;
				this.formData.lecture = this.formData.lecture.map(i => i.staff_id);
				this.formData.depart_id = findTreePath(data.depart_id, this.departAll);
				this.formData.organizer_depart_id = findTreePath(data.organizer_depart_id, this.departAll);
				this.formData.course_depart_id = data.course_depart_id;
				this.formData.sync_type = data.sync_type ? Number(data.sync_type) : 2;
			}
		},
		loadData(course, select) {
			let api = select ? '_ACADEMY_SUPPORT_COURSE_DETAIL_GET' : '_ACADEMY_SUPPORT_TRAIN_COURSE_DETAIL_GET';
			this.$request({
				url: api,
				type: 'GET',
				param: {
					course_id: course
				},
				loading: false
			}).then((res) => {
				this.initData(res.data);
			}).catch((error) => {
			});
		},
		// 处理后端返回文件名
		getFileNameFromUrl(url = '') {
			return oneLinePipe(url.substring(url.lastIndexOf('/') + 1), 20);
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
		// 按条件筛选人员
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
		// 素材库选择素材
		handleChooseMaterial() {
			const materials = this.formData.attachment
				.filter(att => att.source == 2)
				.map(att => ({
					material_id: att.material_id, 
					material_name: att.title, 
					file_url: att.url, 
					is_download: att.is_download
				}));
			ChooseMaterial.popup({ materials }).then((res) => {
				const mat1 = this.formData.attachment.filter(att => att.source != 2); // 本地上传的文件source为空
				this.formData.attachment = [...mat1, ...res.map(mat => ({
					material_id: mat.material_id,
					original: mat.material_name,
					url: mat.file_url, 
					percent: '100.00', 
					title: mat.material_name,
					source: 2,
					is_download: !!mat.is_download
				}))];
				this.formData.attachment.length > 10 ? this.$Message.warning('最多上传10个素材，超过将会保留最先选择的10个') : '';
				this.$refs.upload.$refs.filesPicker.data = this.formData.attachment.slice(0, 10);
				this.$refs.upload.filesList = this.formData.attachment.slice(0, 10);
			}).catch(() => {
				console.error('error');
			});
			
		},
		// 上传限制
		handleFileError(res) {
			if (res.msg && res.msg.includes('大小限制')) {
				this.$Message.error('文件过大(限制为200M)，可请先上传至素材库再添加');
			} else {
				this.$Message.error(res.msg);
			}
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
					} else if (this.formData.course_time === '0') {
						this.$Message.warning('课程时长不能为0');
					} else {
						this.handleSub(num);
					}
				}
			});
		},
		handleSub(num) {
			let obj = {
				type: 2,
				course_name: this.formData.course_name,
				organize_name: this.formData.echelon.organize_name,
				condition_name: this.formData.echelon.condition_name,
				organizer_depart_id: this.formData.organizer_depart_id[this.formData.organizer_depart_id.length - 1],
				use: this.formData.use,
				depart_id: this.formData.depart_id[this.formData.depart_id.length - 1],
				address: this.formData.address,
				course_time: this.formData.course_time,
				start_time: this.formData.time[0] ? moment(this.formData.time[0]).format('YYYY-MM-DD HH:mm') : '',
				end_time: this.formData.time[0] ? moment(this.formData.time[1]).format('YYYY-MM-DD HH:mm') : '',
				lecture: this.formData.lecture,
				organize_participator: this.formData.echelon.organize_participator.map(v => v.staff_id),
				condition_participator: this.formData.echelon.condition_participator.map(v => v.staff_id),
				condition: this.formData.condition,
				attachment: this.formData.attachment.map(it => ({
					attachment_url: it.url,
					attachment_name: it.title,
					file_size: it.size,
					source: it.source,
					is_download: it.is_download,
					material_id: it.material_id
				})),
				sync_type: this.formData.sync_type,
				is_sync: this.formData.is_sync,
				course_depart_id: this.formData.course_depart_id,
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
							type: 2
						}
					});
				} else {
					this.formData.lecture = [];
					this.formData.attachment = [];
					this.$refs.upload.$refs.filesPicker.data = [];
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
						this.formData.use = 4;
						this.$nextTick(() => {
							this.lectureVal = true;
						});

						// 解决 content-upload 不响应数据变化的问题
						this.showUpload = false;
						this.$nextTick(() => this.showUpload = true);
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
.v-academy-support-course-add {
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
