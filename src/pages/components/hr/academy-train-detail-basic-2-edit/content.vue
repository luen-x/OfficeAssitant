<template>
	<div class="v-hr-academy-train-arrangement-add">
		<div class="g-flex g-flex-cc">
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
						placeholder="请输入课程名称，限30个字" 
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
						@on-blur="handleBlurCode"
					/>
				</i-form-item>
				<i-form-item prop="lecture" label="授课讲师:">
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
					<i-radio-group v-model="formData.lecture_type">
						<i-radio :label="1" style="width:90px;margin-right:0">被邀请</i-radio>
						<i-radio :label="2" style="width:90px;margin-right:0">主动申请</i-radio>
						<i-radio :label="3" style="width:90px;margin-right:0">其他</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item label="课程类型:" prop="course_type">
					<i-radio-group v-model="formData.course_type" style="width:290px">
						<i-radio :label="1" style="width:90px;margin-right:0">必修课</i-radio>
						<i-radio :label="2" style="width:90px;margin-right:0">选修课</i-radio>
						<i-radio :label="3" style="width:90px;margin-right:0">内训课</i-radio>
					</i-radio-group>
				</i-form-item>
				
				<i-form-item ref="echelon" label="参与人员:" prop="echelon">
					<div class="_echelon" style="width:300px">
						<div class="g-flex g-inline-block">
							<div>
								<oa-tree-select-check 
									ref="treeSelectCheck"
									v-model="formData.echelon.attend_members1" 
									:data="stageTree" 
									:disabled="is_expired"
									placeholder="请选择人才梯队"
									style="position:relative;left:-7px" 
								/>
							</div>
							<div>
								<i-input 
									v-model="formData.echelon.attend_members2" 
									:maxlength="20"
									:disabled="is_expired"
									placeholder="输入参与人员分类名称，如：代经理"
									style="width: 200px; position: relative; left: -10px; margin-left: 3px;"
								/>
								<span @click="handleAddMember">
									<span 
										v-if="formData.echelon.attend_members2_data.length" 
										class="g-operation"
									>
										已添加{{ formData.echelon.attend_members2_data.length }}人
									</span>
									<span v-else class="g-operation">点击添加</span>
								</span>
							</div>
						</div>
					</div>
				</i-form-item>
				<i-form-item label="授课方式:" prop="teach_method">
					<i-radio-group v-model="formData.teach_method.method" style="width:300px">
						<i-radio :label="1" style="width:90px;margin-right:0">线下面授</i-radio>
						<i-radio :label="2" style="width:90px;margin-right:0">岛屿PK</i-radio>
						<i-radio :label="3" style="width:90px;margin-right:0">座谈会</i-radio>
						<i-radio :label="4" style="width:90px;margin-right:0">茶话会</i-radio>
						<i-radio :label="5" style="width:90px;margin-right:0">线下视频</i-radio>
						<i-radio :label="6" style="width:90px;margin-right:0">线上视频</i-radio>
						<i-radio :label="7">
							其他
							<i-input 
								v-model="formData.teach_method.method_name" 
								:maxlength="10"  
								placeholder="请输入授课方式"
								style="margin-left: 10px; width: 240px;"
							/>
						</i-radio>
					</i-radio-group>
					<div v-if="formData.teach_method.method == 6" style="background:#F0F4FC" class="g-m-t-10 g-pd-l-10" >
						<span>视频授课方式：</span>
						<i-radio-group v-model="formData.teach_method.video_method">
							<i-radio :label="1">不允许快进</i-radio>
							<i-radio :label="2">允许快进</i-radio>
						</i-radio-group>
					</div>
				</i-form-item>
				<i-form-item ref="subject" label="关联课题:" prop="subject">
					<div style="width:300px" >
						<span class="g-operation g-dp-ib" @click="handleAddRelativeSubject">
							已选择{{ formData.subject.length }}个课题
						</span>
					</div>
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
					<i-input 
						v-model="formData.course_time" 
						:maxlength="5" 
						placeholder="请输入课程时长" 
						style="width:300px"
					>
						<span slot="suffix" style="line-height: 32px;">分钟</span>
					</i-input>
				</i-form-item>
			
				<i-form-item label="用途:">
					<i-radio-group v-model="formData.use" style="width:300px">
						<i-radio :label="1" style="width:50px;margin-right:0">其他</i-radio>
						<i-radio :label="2" style="width:80px;margin-right:0">用于晋升</i-radio>
						<i-radio :label="3" style="width:80px;margin-right:0">用于晋级</i-radio>
						<i-radio :label="4" style="width:70px;margin-right:0">用于学分</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="授课时间:" prop="time">
					<i-date-picker
						v-model="formData.time"
						:editable="false"
						:disabled="is_expired"
						split-panels
						separator=" 至 "
						format="yyyy-MM-dd HH:mm"
						type="datetimerange"
						style="width: 300px"
						placeholder="请选择授课时间"
					/>
				</i-form-item>
				<i-form-item label="授课地点:" prop="position">
					<i-input 
						v-model="formData.position" 
						:maxlength="20" 
						placeholder="请输入课程的授课地点"
						style="width:300px"
						clearable
					/>
				</i-form-item>
				<i-form-item label="是否同步课程表:" prop="schedule">
					<i-radio-group v-model="formData.schedule.schedule_type" style="width: 300px">
						<i-radio :label="0" style="margin-right: 5px;">否</i-radio>
						<i-radio :label="1">同步公司</i-radio>
						<i-radio :label="2">同步战区</i-radio>
						<i-cascader
							:data="departAllOfZone"
							v-model="formData.schedule.schedule_depart_id"
							:change-on-select="true"
							:clearable="false"
							placeholder="请选择战区"
							trigger="click"
							transfer
							style="width: 105px"
						/>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="授课部门:" prop="teach_depart_id">
					<i-cascader
						:data="departAll"
						v-model="formData.teach_depart_id"
						:change-on-select="true"
						:clearable="false"
						placeholder="请选择部门"
						trigger="click"
						transfer
						style="width: 300px"
						class="g-m-r-5"
					/>
				</i-form-item>
				<i-form-item label="保存到课程库:">
					<i-radio-group v-model="formData.is_save_course" style="width: 300px">
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="相关课件:" prop="attachment">
					<oa-content-upload 
						ref="upload" 
						v-model="formData.attachment" 
						:size="200"
						:max="1000"
						style="margin:0;width:300px"
						accept=".rar, .zip, .doc, .docx, .pdf, .jpg, .png, .ppt, .MP3, .MP4, .xlsx, .avi, .wmv, .flv, .vob, .dat, .mkv, .asf, .asx" 
						@error="handleFileError"
					>
						<div slot="trigger" class="g-flex">
							<i-button>本地上传</i-button>
							<div class="g-col" @click.stop="()=>{}">
								<i-button class="g-m-l-10" @click.stop="handleChooseMaterial">素材库中选取</i-button>
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
							<i-checkbox v-model="item.is_download">允许下载</i-checkbox>
						</span>
					</oa-content-upload>
				</i-form-item>
			</i-form>
			<!-- footer -->
			<div class="__detail-footer g-flex-cc">
				<i-button @click="handleCancel">取消</i-button>
				<i-button 
					type="primary"
					style="margin: 0 0 0 10px" 
					@click="handleSave">
					保存
				</i-button>
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
import { dataValidity, getParseUrl, oneLinePipe, getHashUrl, formatDate, getItem, initTreeData } from '@utils/utils';
import { services, staffByMutiTerm } from "@stores/services/hr";
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { ImgsPicker } from 'wya-vc';
import TreeSelectCheck from '@components/_common/tree-select-check/tree-select-check';
import ContentUpload from '@components/content/_common/upload';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { ChooseStaff } from '../_common/academy-course/drawers/choose-staff'; 
import { AddSubject } from '../_common/academy-course/modals/add-subject';
import { ChooseMaterial } from '../_common/academy-course/modals/choose-material';
import item from './item';
import { setData, findTreePath } from '../_common/academy-course/util';

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
		item, 
		services.departAll(), 
		staffByMutiTerm,
		services.stageTree(), 
		services.subjectTree()
	],
	props: {
		datas: Object
	},
	data() {
		return {
			obj: {}, // 转存
			project_id: this.$route.query.project_id || '',
			number: this.$route.query.number || ''
		};
	},
	computed: {
		
		departAllOfSale() {
			if (this.departAll == undefined || !this.departAll.length || !this.departAll[0].label) return [];
			const departTree = this.departAll.filter(v => v.label.includes('营销'))[0].children;
			departTree.forEach(v => {
				if (!v.children) {
					v.disabled = true;
				}
			});
			return departTree;
		},
		departAllOfZone() {
			if (this.departAll == undefined || !this.departAll.length || !this.departAll[0].label) return [];
			const departTree = this.departAll.filter(v => v.label.includes('营销'))[0].children;
			const departA = departTree.map(e => ({
				...e,
				children: ''
			}));
			return departA;
		},
		departAllTree() {
			return JSON.parse(JSON.stringify(this.departAll).replace(new RegExp('lable', 'g'), 'title'));
		}
	},
	created() {
		this.initData(this.$route.query.course_id);
	},
	methods: {
		handleBlurCode() {
			if (this.formData.course_code.trim()) {
				this.$request({
					url: "_HR_ACADEMY_TRAIN_PROJECT_COURSE_ID_GET",
					type: 'GET',
					param: {
						course_code: this.formData.course_code.trim(),
						course_id: this.$route.query.course_id
					},
					loading: false
				}).then((res) => {
				}).catch((error) => {
					this.$Message.warning(error.msg);
				});
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
		},
		// 选择课程后 initData
		initData(course_id) {
			this.$request({
				url: "_HR_TRAIN_PROJECT_DETAIL_GET",
				type: "GET",
				param: {
					course_id
				},
				loading: false,
			}).then(res => {
				this.inData(res.data);
				this.is_expired = res.data.is_expired;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		// 处理后端数据成formData
		async inData(data) {
			await this.loadDepartAllPromise;
			await this.loadSubjectTreePromise;
			setData(this.formData, data);
			this.formData.echelon = {
				participant_type: [],
				attend_members1: [],
				attend_members2: '',
				attend_members2_data: []
			};
			this.formData.use = data.use;
			this.formData.teach_method.method = data.method;
			data.method == 7 ? this.formData.teach_method.method_name = data.method_name : '';
			this.formData.teach_method.video_method = data.video_method;
			this.formData.time = [data.start_time, data.end_time];
			// this.formData.lecture_type = data.lecture_type;
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
			this.formData.echelon.attend_members2_data = data.participator;
			this.formData.echelon.attend_members2 = data.participator_name;
			this.formData.schedule.schedule_type = data.schedule_type;
			this.formData.schedule.schedule_depart_id = findTreePath(data.schedule_depart_id, this.departAll);
			this.teacherList = this.formData.lecture;
			this.formData.lecture = this.formData.lecture.map(i => i.staff_id);
			this.formData.teach_depart_id = findTreePath(data.teach_depart_id, this.departAll);
			this.formData.organizer_depart_id = findTreePath(data.organizer_depart_id, this.departAll);
			this.formData.subject = data.subject.map(it => findTreePath(it.subject_id, this.subjectTree)).filter(i => i);
			let stageIds = [];
			data.echelon.forEach(ech => {
				stageIds = [...stageIds, ...ech.stage_id.map(i => 'stage-' + i)];
			});
			this.formData.echelon.attend_members1 = stageIds;
			if (this.formData.echelon.attend_members1.length > 0) {
				setTimeout(() => {
					this.$nextTick(() => {
						this.$refs.treeSelectCheck.initValue();
					});
				}, 0);
			}
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
		// 选择关联课程
		handleAddRelativeSubject() {
			AddSubject.popup({ subjects: this.formData.subject }).then(res => {
				this.formData.subject = res;
				if (this.$refs.subject) {
					this.$refs.form.validateField("subject");
				}
			});
		},
		// 添加参与人员
		handleAddMember() {
			this.is_expired ? this.$Message.warning('已过授课时间无法选择')
				: ChooseStaff.popup({ members: this.formData.echelon.attend_members2_data }).then((res) => {
					this.formData.echelon.attend_members2_data = res;
					if (this.$refs.echelon) {
						this.$refs.form.validateField("echelon");
					}
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
		handleFileError(res) {
			if (res.msg && res.msg.includes('大小限制')) {
				this.$Message.error('文件过大(限制为200M)，可请先上传至素材库再添加');
			} else {
				this.$Message.error(res.msg);
			}
		},
		handleCancel() {
			ModalTip.popup({
				title: '提示',
				content: '取消后内容将无法回复，确认取消吗？'
			}).then(res => {
				this.$router.go(-1);
			});
		},
		handleSave() {
			if (this.formData.echelon.attend_members2 && !this.formData.echelon.attend_members2_data.length) {
				this.$Message.warning('请添加参与人员');
				return;
			}
			if (!this.formData.echelon.attend_members2 && this.formData.echelon.attend_members2_data.length) {
				this.$Message.warning('请输入参与人员分类名称');
				return;
			}
			if (!this.formData.echelon.attend_members1.length && !this.formData.echelon.attend_members2_data.length) {
				this.$Message.warning('至少添加一种参与人员');
				return;
			}
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					try {
						// 第二步数据
						this.formData.echelon.attend_members1.length ? this.formData.echelon.participant_type.push(1) : '';
						this.formData.echelon.attend_members2_data.length ? this.formData.echelon.participant_type.push(2) : '';
						this.obj = {
							project_id: this.$route.query.project_id,
							course_id: this.$route.query.course_id,
							course_name: this.formData.course_name, // 课程名称
							course_code: this.formData.course_code, // 课程编码
							method: this.formData.teach_method.method, // 授课方式
							method_name: this.formData.teach_method.method == '7' 
								? this.formData.teach_method.method_name : '', // 授课方式7填写
							video_method: this.formData.teach_method.method == '6' 
								? this.formData.teach_method.video_method : '', // 授课方式6视频快进
							echelon: this.getEchelon(), // 人才梯队
							lecture: this.formData.lecture, // 授课讲师
							lecture_type: this.formData.lecture_type, // 讲师类型
							course_type: this.formData.course_type, // 课程类型
							participant_type: this.formData.echelon.participant_type, // 人才梯队类型
							participator_name: this.formData.echelon.attend_members2, // 参与人员自定义名称
							participator_id: this.formData.echelon.attend_members2_data.length
								? this.formData.echelon.attend_members2_data.map(e => e.staff_id) : [], // 参与人员自定义列表
							subject: this.formData.subject.map(e => e[e.length - 1]), // 参与课题
							organizer_depart_id: this.formData.organizer_depart_id[this.formData.organizer_depart_id.length - 1], // 举办方
							course_time: this.formData.course_time, // 课程时长
							use: this.formData.use, // 用途
							start_time: moment(this.formData.time[0]).format('YYYY-MM-DD HH:mm'),
							end_time: moment(this.formData.time[1]).format('YYYY-MM-DD HH:mm'),
							position: this.formData.position,
							schedule_type: this.formData.schedule.schedule_type, // 同步到课程表
							schedule_depart_id: this.formData.schedule.schedule_type == 2
								? this.formData.schedule.schedule_depart_id[this.formData.schedule.schedule_depart_id.length - 1] : '', // 选择同步后，战区 id
							teach_depart_id: this.formData.teach_depart_id[this.formData.teach_depart_id.length - 1], // 授课部门
							// async_schedule: this.formData.async_schedule
							attachment: this.formData.attachment.map(it => ({
								attachment_url: it.url,
								attachment_name: it.title,
								file_size: it.size,
								source: it.source,
								is_download: it.is_download,
								material_id: it.material_id
							})),
							is_save_course: this.formData.is_save_course
						};
						this.$request({
							url: API_ROOT['_HR_TRAIN_PROJECT_COURSE_EDIT_SAVE_POST'], // eslint-disable-line
							type: "POST",
							param: this.obj
						}).then((res) => {
							this.$Message.success('编辑成功');
							this.$router.push(`/hr/academy/train/detail/basic/0/info?
							project_id=${this.$route.query.project_id}`);
						}).catch((error) => {
							this.$Message.error(error.msg);
						});
					} catch (error) {
						console.error(error);
					}
				}
			});
		},
		
	},
};
</script>

<style lang="scss" >
.v-hr-academy-train-arrangement-add {
	margin-bottom: 100px;
	._container{
		display: flex;
		justify-content: center;
		max-width: 850px;
		min-width: 450px;
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
	.__detail-footer {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		height: 45px;
		line-height: 45px;
		text-align: center;
		width: calc(100% - 340px) !important;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
		.__content {
			box-sizing: border-box;
		}
	}
}
</style>
