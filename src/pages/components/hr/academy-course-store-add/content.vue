<template>
	<div class="v-hr-academy-course-store-add">
		<div class="g-flex g-flex-cc g-col g-pd-t-30">
			<i-form 
				ref="form"
				:model="formData"
				:rules="rules" 
				:label-width="110" 
				style="	max-width: 850px;min-width: 450px;" 
				inline
			>
				<i-form-item label="课程名称:" prop="course_name">
					<i-input 
						v-model="formData.course_name" 
						:maxlength="30" 
						placeholder="请输入课程名称" 
						style="width:300px"
						clearable
					/>
				</i-form-item>
				<i-form-item label="课程编码:" prop="course_code">
					<i-input 
						v-model="formData.course_code" 
						:maxlength="10" 
						style="width:300px"
						placeholder="请自定义课程编码" 
						clearable
					/>
				</i-form-item>
				<i-form-item label="授课讲师:" prop="lecture">
					<i-select 
						v-model="formData.lecture"
						:remote-method="handleSearchTeacher"
						:loading="teachersSearchLoading"
						placeholder="输入讲师名称搜索"
						style="width:300px"
						filterable
						remote
						multiple
						clearable
						label-in-value
						@on-change="handleLectureChange"
					>
						<i-option v-for="staff in teacherList" :key="staff.staff_id" :value="staff.staff_id">
							{{ staff.staff_name }}
						</i-option>
					</i-select>
					<br>
					<i-radio-group v-model="formData.lecture_type">
						<i-radio :label="1" style="width:90px;margin-right:0">被邀请</i-radio>
						<i-radio :label="2" style="width:90px;margin-right:0">主动申请</i-radio>
						<i-radio :label="3" style="width:90px;margin-right:0">其他</i-radio>
					</i-radio-group>
				</i-form-item>
				
				<i-form-item label="参与人员:" prop="participator">
					<div style="width:300px">
						<div>
							<oa-tree-select-check 
								ref="treeSelectCheck"
								v-model="formData.echelon" 
								:data="stageTree" 
								placeholder="选择人才梯队" 
								style="position:relative;left:-2px" 
							/>
						</div>
						<div class="g-flex g-m-l-5">
							<i-input 
								v-model="formData.participator_name" 
								:maxlength="20" 
								placeholder=" 人员分类，如：代经理、全体人员等"
								style="width:200px;position:relative;left:-7px"
							/>
							<span @click="handleAddMember">
								<span 
									v-if="formData.attend_members.length" 
									class="g-operation"
								>
									已添加{{ formData.attend_members.length }}人
								</span>
								<span v-else class="g-operation">点击添加</span>
							</span>
						</div>
					</div>
				</i-form-item>
				<i-form-item label="课程类型:" prop="course_type">
					<i-radio-group v-model="formData.course_type" style="width:300px">
						<i-radio :label="1" style="width:90px;margin-right:0">必修课</i-radio>
						<i-radio :label="2" style="width:90px;margin-right:0">选修课</i-radio>
						<i-radio :label="3" style="width:90px;margin-right:0">内训课</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="关联课题:" prop="subject">
					<span class="g-operation g-dp-ib" style="width:300px" @click="handleAddRelativeSubject">
						已选择{{ formData.subject.length }}个课题
					</span>
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
				<i-form-item label="课程时长:" prop="course_time">
					<i-input-number 
						v-model="formData.course_time" 
						:min="1"
						:max="99999"
						:precision="0"
						placeholder="请输入课程时长" 
						style="width:300px" 
					/>
					<span class="_number-append">分</span>
				</i-form-item>
				<i-form-item label="相关课件:" prop="attachment">
					<oa-content-upload 
						ref="upload" 
						v-model="formData.attachment"
						:size="200"
						:max="10000"
						style="margin:0;width:300px" 
						accept=".rar, .zip, .doc, .docx, .pdf, .jpg, .png, .ppt, .MP3, .MP4, .xlsx, .avi, .wmv, .flv, .vob, .dat, .mkv, .asf, .asx" 
						@error="handleFileError"
					>
						<div slot="trigger" class="g-flex">
							<i-button>本地上传</i-button>
							<div style="flex:1" @click.stop>
								<i-button class="g-m-l-10" @click.stop="handleChooseMaterial">素材库中选取</i-button>
							</div>
							
						</div>
						<div slot="top" class="g-c-black4 g-m-t-5" style="line-height: 16px">
							本地上传支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .ppt .MP3 .MP4 .avi .wmv .flv .xlsx等
						</div> 
						<span 
							v-for="(item,index) in formData.attachment" 
							:key="index" 
							:slot="'check'+index" 
							style="position:absolute;right:-90px"
						>
							<i-checkbox v-model="item.is_download">允许下载</i-checkbox>
						</span>
					</oa-content-upload>
				</i-form-item>
				<i-form-item label="授课方式:" prop="method" class="_method-error-tip">
					<i-radio-group v-model="formData.method" style="width:300px">
						<i-radio :label="1" style="width:90px;margin-right:0">线下面授</i-radio>
						<i-radio :label="2" style="width:90px;margin-right:0">岛屿PK</i-radio>
						<i-radio :label="3" style="width:90px;margin-right:0">座谈会</i-radio>
						<i-radio :label="4" style="width:90px;margin-right:0">茶话会</i-radio>
						<i-radio :label="5" style="width:90px;margin-right:0">线下视频</i-radio>
						<i-radio :label="6" style="width:90px;margin-right:0">线上视频</i-radio>
						<i-radio :label="7">
							其他
							<i-input 
								v-model="formData.method_name" 
								:maxlength="10"
								placeholder="请输入授课方式" 
								style="margin-left:10px"
								@change="handleMethodNameChange"
							/>
						</i-radio>
					</i-radio-group>
					<div v-if="formData.method==6" style="background:#F0F4FC" class="g-m-t-10 g-pd-l-10" >
						<span>视频授课方式：</span>
						<i-radio-group v-model="formData.video_method">
							<i-radio :label="1">不允许快进</i-radio>
							<i-radio :label="2">允许快进</i-radio>
						</i-radio-group>
					</div>
				</i-form-item>
				
				
				<i-form-item label="用途:" prop="use">
					<i-radio-group v-model="formData.use" style="width:300px">
						<i-radio :label="1" style="width:50px;margin-right:0">其他</i-radio>
						<i-radio :label="2" style="width:80px;margin-right:0">用于晋升</i-radio>
						<i-radio :label="3" style="width:80px;margin-right:0">用于晋级</i-radio>
						<i-radio :label="4" style="width:70px;margin-right:0">用于学分</i-radio>
					</i-radio-group>
				</i-form-item>
			</i-form>
		</div>
		<div class="_footer" >
			<i-button @click="handleCancel">取消</i-button>
			<i-button :loading="saveLoading" type="primary" @click="handleSave">保存</i-button>
		</div>
	</div>
	
</template>
<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Select, Option, DatePicker, Cascader, Message,
	Radio, RadioGroup, Checkbox, CheckboxGroup, Button, Tree
} from 'iview';
import { debounce } from 'lodash';
import { dataValidity, oneLinePipe, objRegex } from '@utils/utils';
import { ImgsPicker } from 'wya-vc';
import TreeSelectCheck from '@components/_common/tree-select-check/tree-select-check';
import ContentUpload from '@components/content/_common/upload';
import { services } from '@stores/services/hr';
import { ChooseStaff } from '../_common/academy-course/drawers/choose-staff'; 
import { AddSubject } from '../_common/academy-course/modals/add-subject';
import { ChooseMaterial } from '../_common/academy-course/modals/choose-material';
import { setData, findTreePath } from '../_common/academy-course/util';
import clearService from '../academy-train-detail/_common/mixin/clear-service';

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
		'i-tree': Tree,
		'oa-tree-select-check': TreeSelectCheck,
		'oa-content-upload': ContentUpload

	},
	mixins: [
		services.stageTree(), 
		services.departAll(),
		services.subjectTree(),
		clearService([
			'subjectTree', 'stageTree', 'planTree', 'echelon',
			'planCaTree', 'planCaTreeAll', 'stageCaTreeAll', 'departAllTree'
		])
	],
	data() {
		return {
			formData: {
				course_id: this.$route.query.course_id || '',
				course_name: '',
				method: 1, // 授课方式
				method_name: '', // 自定义授课方式
				video_method: 1, // 是否可以快进
				lecture: [], // 讲师id
				lecture_type: 3, // 授课类型
				attend_members: [], // 额外参与人员 {stafff_id,staff_name}
				participator_name: '', // 额外参与人员名称
				subject: [], // 关联课题
				course_type: 1, // 课程类型
				organizer_depart_id: [], // 举办方部分id
				course_code: '', // 课程编码
				echelon: [],
				attachment: [
					 // 附件
					// {
					// 	current: 1,
					// 	original: "no-message-01.png",
					// 	percent: "100.00",
					// 	size: 7843,
					// 	state: "SUCCESS",
					// 	title: "nomessage01.png",
					// 	total: 1,
					// 	type: ".png",
					// 	uid: "vc-1556601710170-5",
					// 	url: "https://oss.ruishan666 "
					//  }
					 ],
				use: 1,
				course_time: null,
			},
			teacherList: [],
			teachersSearchLoading: false,
			saveLoading: false,
			selectedTeacher: [],
			rules: {
				course_name: [
					{ required: true, type: 'string', message: '请输入课程名称', trigger: 'change' },
					{ type: 'validEnChNum', validator: dataValidity, trigger: 'change' },
					{ validator: this.courseNameValidator, trigger: 'change' }

				],
				method: [
					{ required: true, type: 'number', message: '请选择授课方式', trigger: 'change' },
					{ validator: this.methodValidator, trigger: 'change' }
				],
				method_name: [
					{ required: false, type: 'string', message: '请填写授课方式', trigger: 'blur' }
				],
				video_method: 1, // 是否可以快进
				lecture: [{ required: false, type: 'array', message: '请输入讲师', trigger: 'change' }], // 讲师id
				lecture_type: [{ required: false, type: 'number', message: '请选择授课方式', trigger: 'change' }], // 授课类型
				attend_members: [], // 额外参与人员 {stafff_id,staff_name}
				participator_name: [{ required: false, type: 'string', message: '请输入参与人员名称', trigger: 'blur' }], // 额外参与人员名称
				subject: [{ required: false, type: 'array', message: '请选择关联课题', trigger: 'change' }], // 关联课题
				course_type: [{ required: true, type: 'number', message: '请选择课程类型', trigger: 'change' }], // 课程类型
				organizer_depart_id: [{ required: true, type: 'array', message: '请选择举办方', trigger: 'change' }], // 举办方部分id
				course_code: [
					{ required: false, type: 'string', message: '请输入课程编码', trigger: 'change' },
					{ type: 'validLetterAndNumber', message: '只能输入数字或字母', validator: dataValidity, trigger: 'change' },
					{ validator: this.courseCodeValidator, trigger: 'change' }

				], // 课程编码
				echelon: [{ required: false, type: 'array', message: '请选择人才梯队', trigger: 'change' }],
				attachment: [],
				use: [{ required: false, type: 'number', message: '请选择用途', trigger: 'change' }],
				course_time: [{ required: false, type: 'number', message: '请输入课程时长', trigger: 'blur' }],
			},
			originData: {
				course_name: '',
				course_code: ''
			}
		};
	},
	computed: {
		departAllTree() {
			return JSON.parse(JSON.stringify(this.departAll).replace(new RegExp('lable', 'g'), 'title'));
		}

	},
	created() {
		if (this.$route.query.action == 'update') {
			this.loadCourseInfo();
		}

	},
	mounted() {
		
	},
	methods: {
		loadCourseInfo() {
			this.$request({
				url: "_HR_ACADEMY_COURSE_STORE_INFO_GET",
				type: "GET",
				param: {
					course_id: this.formData.course_id
				},
				loading: false,
			}).then(res => {
				this.inData(res.data);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleAddRelativeSubject() {
			AddSubject.popup({ subjects: this.formData.subject }).then(res => {
				this.formData.subject = res;
			});
		},

		handleAddMember() {
			ChooseStaff.popup({ members: this.formData.attend_members }).then((res) => {
				this.formData.attend_members = res;
				if (res.length > 0) this.formData.member_check2 = true;
			}).catch(() => {
				
			});
		},
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
				this.$refs.upload.$refs.filesPicker.data = this.formData.attachment;
			}).catch(() => {});
			
		},
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
				this.selectedTeacher.forEach(i => {
					if (!res.data.find(it => it.staff_id == i.staff_id)) {
						res.data.push(i);
					}
				});
				this.teacherList = res.data;
			}).catch((error) => {
				this.teachersSearchLoading = false;
			});
		},
		handleSave: debounce(function () {
			if (this.formData.participator_name && !this.formData.attend_members.length) {
				this.$Message.error('请选择额外参与人员');
				return;
			}
			if (!this.formData.participator_name && this.formData.attend_members.length) {
				this.$Message.error('请输入参与人员分类名称');
				return;
			}

			this.$refs.form.validateAndScroll(valid => {
				if (!valid) return;
				const param = this.outData();
				this.saveLoading = true;
				this.$request({
					url: this.$route.query.action == 'add' ? "_HR_ACADEMY_COURSE_SAVE_POST" : "_HR_ACADEMY_COURSE_UPDATE_POST",
					type: "POST",
					param,
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.clearService();
					this.$router.go(-1);
				}).catch((res) => {
					this.$Message.error(res.msg);
				}).finally(() => {
					this.saveLoading = false;
				});
			});

		}, 200),
		// 处理后端数据成formData
		async inData(data) {
			await this.loadDepartAllPromise;
			await this.loadSubjectTreePromise;
			setData(this.formData, data);
			setData(this.originData, data);
			this.formData.course_time = (this.formData.course_time === '') ? null : this.formData.course_time;
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
			this.formData.attend_members = data.participator;
			this.formData.organizer_depart_id = findTreePath(data.organizer_depart_id, this.departAll);
			this.formData.subject = data.subject.map(it => findTreePath(it.subject_id, this.subjectTree)).filter(i => i);
			this.teacherList = this.formData.lecture;
			this.formData.lecture = this.formData.lecture.map(i => i.staff_id);
			let stageIds = [];
			data.echelon.forEach(ech => {
				stageIds = [...stageIds, ...ech.stage_id.map(i => 'stage-' + i)];
			});
			this.formData.echelon = stageIds;
			// if (this.formData.echelon.length > 0) {
			// 	setTimeout(() => {
			// 		this.$nextTick(() => {
			// 			this.$refs.treeSelectCheck.initValue();
			// 		});
			// 	}, 0);
			// }
			if (this.formData.method != 7) this.formData.method_name = '';
		},
		// 处理formData成后端要的数据
		outData() {
			const param = { ...this.formData };
			param.participant_type = [];
			if (this.formData.echelon.length) {
				param.participant_type.push(1);
			}
			if (this.formData.participator_name) {
				param.participant_type.push(2);
			}
			param.attachment = param.attachment.map(it => ({
				attachment_url: it.url,
				attachment_name: it.title,
				file_size: it.size,
				source: it.source || 1,
				is_download: it.is_download ? 1 : 0, 
				material_id: it.material_id

			}));
			param.organizer_depart_id = param.organizer_depart_id[param.organizer_depart_id.length - 1];
			param.participator_id = this.formData.attend_members.map(it => it.staff_id);
			param.subject = param.subject.map(it => it[it.length - 1]);
			param.echelon = this.getEchelon();
			delete param.attend_members;
			return param;
		},
		handleCancel() {
			this.$router.go(-1);
		},
		methodValidator(rule, value, callback) {
			if (value !== 7) return callback();
			if (!this.formData.method_name) return callback('请输入授课方式');
			if (!objRegex.validCh.regex.test(this.formData.method_name)) return callback('只能输入中文');
			callback();
		},
		handleMethodNameChange(val) {
			this.$refs.form.validateField('method');
		},
		getFileNameFromUrl(url = '') {
			return oneLinePipe(url.substring(url.lastIndexOf('/') + 1), 20);
		},
		courseCodeValidator: debounce(function (rule, value, cb) {
			if (value === '') return cb();
			if (value === this.originData.course_code) return cb();
			this.$request({
				url: "_HR_ACADEMY_COURSE_CODE_EXIST",
				type: "GET",
				param: {
					course_code: value,
					course_id: this.$route.query.course_id || ''
				},
				loading: false,
			}).then(res => {
				cb();
			}).catch((res) => {
				cb('课程编码已存在，请重新输入');
			});
		}, 100),
		courseNameValidator: debounce(function (rule, value, callback) {
			if (value === '') return callback();
			if (value === this.originData.course_name) return callback();
			this.$request({
				url: "_HR_ACADEMY_COURSE_NAME_EXIST",
				type: "GET",
				param: {
					course_name: value,
					course_id: this.$route.query.course_id || ''
				},
				loading: false,
			}).then(res => {
				callback();
			}).catch((res) => {
				callback('课程名称已存在，请重新输入');
			});

		}, 100),
		handleLectureChange(arr) {
			if (arr.length == this.selectedTeacher.length) return;
			this.selectedTeacher = arr.map(i => ({ staff_id: i.value, staff_name: i.label }));
			if (arr && arr.length > 4) {
				this.$Message.warning('讲师数量不能超过4个');
				this.formData.lecture.pop();
			}
		},
		handleFileError(res) {
			if (res.msg && res.msg.includes('大小限制')) {
				this.$Message.error('文件过大(限制为200M)，可请先上传至素材库再添加');
			} else {
				this.$Message.error(res.msg);
			}
		},
		getEchelon() {
			const result = [];
			const tags = this.$refs.treeSelectCheck.checkedTags.filter(i => i.parent_id);
			tags.forEach(tag => {
				const exist = result.find(it => it.echelon_id == tag.parent_id);
				if (exist) {
					exist.stage_id.push(+tag.value.split('-')[1]);
				} else {
					result.push({ echelon_id: tag.parent_id, stage_id: [+tag.value.split('-')[1]] });
				}
			});
			return result;
		}
	},
};
</script>

<style lang="scss" >
.v-hr-academy-course-store-add{
	height: calc(100% - 35px);
    overflow-y: auto;
    margin-top: -6px;
	._container{
		display: flex;
		justify-content: center;
		max-width: 850px;
		min-width: 450px;
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
	._method-error-tip {
		.ivu-form-item-error-tip {
			padding-left: 58px;
		}
	}
	._footer {
		width: calc(100% - 160px);
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 160px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		padding: 10px 16px;
		background: #fff;
		.ivu-btn {
			margin-left: 5px;
			margin-right: 5px;
		}
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._number-append {
		display: inline-block;
		position: absolute;
		right: 10px;
		top: 1px;
		vertical-align: bottom;
		color: #4b4f57;
	}
	.ivu-input-number {
		.ivu-input-number-handler-wrap {
	        display: none !important;
	    }
	}
}
</style>
