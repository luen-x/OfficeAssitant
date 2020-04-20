<template>
	<div>
		<i-form
			ref="form"
			:model="formdata"
			:rules="validator"
			:label-width="type === 'small' ? 90 : 115"
			class="g-flex g-jc-sb g-fw-w g-m-t-15"
		>
			<i-row>
				<i-col span="12">
					<i-formitem
						label="简历码："
					>
						<div style="width: 300px">
							<span v-if="!edit">保存后系统生成</span>
							<span v-else class="g-operation">点击下载</span>
						</div>
					</i-formitem>
					<i-formitem
						label="校招职位："
						required
					>
						<div 
							v-for="(item, index) of formdata.school_positions"
							:key="item.uid"
							class="g-flex g-jc-sb g-ai-c g-m-b-15"
						>
							<i-formitem
								:prop="`school_positions.${index}.position_ids`"
								:rules="validator.position_ids"
								style="background: #f8f8f8"
								class="g-pd-10"
							>
								<div style="width: 280px;">
									<i-select
										v-model="item.position_ids"
										:remote-method="loadPosition"
										:loading="positionLoading"
										style="width: 220px"
										filterable
										remote
										clearable
										transfer
										multiple
										placeholder="请选择职位"
									>
										<i-option
											v-for="(info, index) in positionData"
											:key="index"
											:value="info.position_id"
											:disabled="item.position_id && item.position_id.length > 9"
										>{{ info.position_name }}</i-option>
									</i-select>
								</div>
								<div class="g-m-t-10">
									<i-select
										v-model="item.paper_id"
										:remote-method="(query) => loadPaper(query, item)"
										:loading="paperLoading"
										style="width: 220px"
										filterable
										remote
										clearable
										transfer
										placeholder="请选择笔试试题"
									>
										<i-option
											v-for="(info, index) in paperData"
											:key="index"
											:value="info.value"
										>{{ info.label }}</i-option>
									</i-select>
									<span 
										class="g-operation g-m-l-15" 
										@click="() => handllePreview(item.paper_id)">预览</span>
								</div>
							</i-formitem>
							<div class="g-m-l-10" style="z-index: 0;">
								<i
									v-if="formdata.school_positions.length > 1"
									class="g-pointer g-c-red-mid icon iconfont icon-remove-circle g-m-l-5"
									@click="() => handleSchoolDel(index)"
								/>
								<i
									class="g-pointer g-c-blue-mid icon iconfont icon-add1 g-m-l-5"
									@click="handleSchoolAdd"
								/>
							</div>
						</div>
					</i-formitem>
				</i-col>
				<i-col span="12">
					<div>
						<i-formitem
							v-for="(item, index) of formdata.interview_groups"
							:key="item.uid"
							:rules="validator.interviewer_ids"
							:prop="`interview_groups.${index}.interviewer_ids`"
							:label="`面试组${index + 1}：`"
							style="margin-left: 12px;"
						>
							<div class="g-relative">
								<i-select
									v-model="item.interviewer_ids"
									:remote-method="(query) => loadInterviewer(query, index)"
									:loading="interviewerLoading"
									style="width: 300px"
									filterable
									remote
									clearable
									transfer
									multiple
									placeholder="请选择面试官"
								>
									<i-option
										v-for="(info, i) in interviewerData"
										:key="i"
										:value="info.interviewer_id"
										:disabled="item.interviewer_id && item.interviewer_id.length > 4"
									>{{ info.interviewer_name }}</i-option>
								</i-select>
								<div :style="{position: 'absolute', right: formdata.interview_groups.length > 1 ? '-40px' : '-20px', top: '0px'}">
									<i
										v-if="formdata.interview_groups.length > 1"
										class="g-pointer g-c-red-mid icon iconfont icon-remove-circle"
										@click="() => handleDel(index)"
									/>
									<i
										class="g-pointer g-c-blue-mid icon iconfont icon-add1 g-m-l-5"
										@click="handleAdd"
									/>
								</div>
							</div>
						</i-formitem>
					</div>
				</i-col>
			</i-row>
		</i-form>
	</div>
</template>

<script>
import { Form, FormItem, Select, Option, Row, Col } from 'iview';
import { uid } from '@utils/utils'; 
import { PaperModal } from './paper-preview';

export default {
	name: 'hr-join-info',
	components: {
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-row': Row,
		'i-col': Col
	},
	props: {
		info: {
			type: Object,
			default: () => ({
				interview_groups: [],
				school_positions: []
			})
		},
		type: String,
		edit: {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		let formdata = JSON.parse(JSON.stringify(this.info));
		let interviewerData = [];
		let paperData = [];
		let positionData = [];
		formdata.interview_groups.forEach(item => {
			item.uid = uid();
			item.interviewer_ids = item.interviewers.map(info => info.interviewer_id);
			interviewerData.push(...item.interviewers);

		});
		formdata.school_positions.forEach(item => {
			item.uid = uid();
			item.position_ids = item.positions.map(info => info.position_id);
			positionData.push(...item.positions);
			paperData.push({ value: item.paper_id, label: item.paper_theme });
		});
		if (!formdata.interview_groups.length) {
			formdata.interview_groups.push({ uid: uid() });
		}
		if (!formdata.school_positions.length) {
			formdata.school_positions.push({ uid: uid() });
		}



		
		return {
			formdata,
			positionLoading: false,
			paperLoading: false,
			interviewerData,
			interviewerLoading: false,
			paperData,
			positionData,
			validator: {
				interviewer_ids: [
					{ required: false, type: 'array', message: '请选择面试官' }
				],
				position_ids: [
					{ required: true, type: 'array', message: "请选择职位", pattern: /.+/, trigger: "change" }
				],

			}
		};
	},
	mounted() {
		// let interview = [];
		// let position = [];
		// let paper = [];
		// this.formdata.interview_groups.forEach(item => {
		// 	item.interviewer_ids = item.interviewers.map(info => info.interviewer_id);
		// 	interview = [...interview, ...item.interviewers];
		// });
		// this.formdata.school_positions.forEach(item => {
		// 	item.position_ids = item.positions.map(info => info.position_id);
		// 	position = [...position, ...item.positions];
		// 	paper = [...paper, { value: item.paper_id, label: item.paper_theme }];
		// });
		// this.interviewerData = interview;
		// this.positionData = position;
		// this.paperData = paper;
		// this.formdata = {
		// 	interview_groups: this.info.interview_groups.length ? this.info.interview_groups : [{ uid: uid() }],
		// 	school_positions: this.info.school_positions.length ? this.info.school_positions : [{ uid: uid() }],
		// };
	},
	methods: {
		loadInterviewer(query, index) {
			if (query !== '') {
				this.interviewerLoading = true;
				this.$request({
					url: '_HR_STAFF_GET',
					type: 'GET',
					param: {
						name: query
					},
					loading: false
				}).then((res) => {
					this.interviewerLoading = false;
					this.interviewerData = res.data;
				}).catch((error) => {
					this.interviewerLoading = false;
				});
			} else {
				this.interviewerData = [];
			}
		},
		loadPosition(query) {
			if (query !== '') {
				this.positionLoading = true;
				this.$request({
					url: '_HR_EMPLOYEE_SUMMARY_RESUME_POSITION_GET',
					type: 'GET',
					param: {
						search: query,
						is_applicant_use: 1
					},
					loading: false
				}).then((res) => {
					this.positionLoading = false;
					this.positionData = res.data;
				}).catch((error) => {
					this.positionLoading = false;
				});
			} else {
				this.positionData = [];
			}
		},
		loadPaper(query, item) {
			query = item.first ? query : item.paper_theme;
			if (query !== '') {
				this.paperLoading = true;
				this.$request({
					url: '_HR_RECRUIT_SCHOOL_JOBFAIR_PAPER_GET',
					type: 'GET',
					param: {
						search: query,
					},
					loading: false
				}).then((res) => {
					this.paperLoading = false;
					item.first = true;
					this.paperData = res.data;
				}).catch((error) => {
					this.paperLoading = false;
				});
			} else {
				this.paperData = [];
			}
		},
		handllePreview(paper_id) {
			paper_id && PaperModal.popup({
				paper_id
			}).then(res => {

			});
		},
		handleAdd() {
			this.formdata.interview_groups.push({ uid: uid() });
			this.interviewerData = [];
		},
		handleSchoolAdd() {
			this.formdata.school_positions.push({ uid: uid() });
			this.positionData = [];			
		},
		handleDel(index) {
			this.formdata.interview_groups.splice(index, 1);
		},
		handleSchoolDel(index) {
			this.formdata.school_positions.splice(index, 1);			
		}
	}
};
</script>

<style lang="scss">

</style>


