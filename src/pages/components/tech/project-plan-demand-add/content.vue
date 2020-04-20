<template>
	<div class="v-tech-project-plan-demand-add g-m-t-20">
		<div class="g-flex g-jc-c">
			<i-form 
				ref="form" 
				:model="formValidate" 
				:rules="ruleValidate" 
				:label-width="120"
				style="min-width: 850px" 
				position="left"
				class="g-flex"
			>	
				<div>
					<i-form-item label="选择项目：" prop="project_id">
						<i-select 
							v-model="formValidate.project_id"
							clearable 
							transfer
							filterable
							placeholder="请选择项目"
							style="width: 300px;"
							@on-change="handleProjectChange"
						>
							<i-option 
								v-for="(item, index) in projectList" 
								:key="index"
								:value="item.project_id"
							>{{ item.project_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="所属板块：" prop="plate">
						<i-input 
							v-model="formValidate.plate" 
							:maxlength="10"
							placeholder="请输入所属板块" 
							style="width: 300px;"
						/>
					</i-form-item>
					<i-form-item label="所属经理：" prop="manager">
						<i-input 
							v-model="formValidate.manager" 
							:maxlength="10"
							placeholder="请输入所属经理" 
							style="width: 300px;"
						/>
					</i-form-item>
					<i-form-item label="负责产品：" prop="product">
						<i-input 
							v-model="formValidate.product" 
							:maxlength="10"
							placeholder="请输入负责产品" 
							style="width: 300px;"
						/>
					</i-form-item>
					<i-form-item label="功能描述：" prop="function_description">
						<oa-limit-words 
							v-model="formValidate.function_description"
							placeholder="请输入功能描述"
							clearable
							style="width: 300px;"
						/>
					</i-form-item>
				</div>
				<div>
					<i-form-item label="需求点：" prop="need_name">
						<i-input 
							v-model="formValidate.need_name" 
							:maxlength="15"
							placeholder="请输入需求点" 
							style="width: 300px;"
						/>
					</i-form-item>
					<i-form-item label="需求进度：" prop="rate_id">
						<i-select
							v-model="formValidate.rate_id"
							:placeholder="formValidate.project_id ? '请选择需求进度': '请先选择项目'"
							clearable
							transfer
							style="width: 300px;"
						>
							<i-option 
								v-for="(item, index) in rateList" 
								:key="index" 
								:value="item.rate_id"
							>{{ item.rate_name }}</i-option>
						</i-select>
						<span 
							v-if="formValidate.project_id" 
							class="_right" 
							@click="handleProgressEdit"
						>
							编辑
						</span>
					</i-form-item>
					<i-form-item label="提出公司：">
						<i-input 
							v-model="formValidate.company" 
							:maxlength="20"
							placeholder="请输入提出公司" 
							style="width: 300px;"
						/>
					</i-form-item>
					<i-form-item label="上线时间：">
						<i-date-picker 
							v-model="formValidate.online_time" 
							:options="{disabledDate: (time) => {return time.getTime() < Date.now() - 86400000;}}"
							format="yyyy-MM-dd"
							type="date"
							style="width: 300px"
							placeholder="请选择预计上线时间"
						/>
					</i-form-item>
				</div>
			</i-form>
		</div>
		<div class="_submit">
			<i-button 
				:loading="loading" 
				type="primary"
				@click="handlePublish"
			>
				发布
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, Form, FormItem, Select, Option, DatePicker } from 'iview';
import moment from 'moment';
import LimitWords from '@components/_common/limit-words/limit-words';
import { setTimeout } from 'timers';
import { ProjectPlanProgressEdit } from "../project-plan-demand/popup/progress-edit";

export default {
	name: 'oa-content',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'oa-limit-words': LimitWords
	},
	data() {
		const { query = {} } = this.$route;

		return {
			loading: false,
			projectList: [],
			rateList: [],
			formValidate: {
				need_id: query.need_id || '',
				project_id: +query.project_id || '',
				plate: query.plate || '',
				manager: query.manager || '',
				product: query.product || '',
				function_description: query.function_description || '',
				need_name: query.need_name || '',
				rate_id: +query.rate_id || '',
				company: query.company || '',
				online_time: query.online_time || ''
			},
			ruleValidate: {
				project_id: [{ required: true, type: 'number', message: '请选择项目', trigger: 'change' }],
				plate: [{ required: true, message: '请输入所属板块', trigger: 'blur' }],
				manager: [{ required: true, message: '请输入所属经理', trigger: 'blur' }],
				product: [{ required: true, message: '请输入负责产品', trigger: 'blur' }],
				function_description: [{ required: true, message: '请输入功能描述', trigger: 'blur' }],
				need_name: [{ required: true, message: '请输入需求点', trigger: 'blur' }],
				rate_id: [{ required: true, type: 'number', message: '请选择需求进度', trigger: 'change' }]
			}
		};
	},
	async mounted() {
		const { query = {} } = this.$route;
		await this.loadProjectList();
		if (query.project_id) {
			await this.loadRateList(+query.project_id);
		}
	},
	methods: {
		loadProjectList() {
			return this.$request({
				url: 'TECH_PROJECT_PLAN_OVERVIEW_LIST_GET',
				type: 'GET',
				loading: false,
				param: { 
					is_page: 0
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data.list) && res.data.list.length) {
					this.projectList = res.data.list;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadRateList(project_id) {
			this.rateList = [];
			return this.$request({
				url: '_TECH_PROJECT_NEED_RATE_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					type: 2,
					project_id
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data) && res.data.length) {
					this.rateList = res.data;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleProjectChange(project_id) {
			this.formValidate.rate_id = '';
			if (project_id) {
				this.loadRateList(project_id);
			}
		},
		handlePublish() {
			this.loading = true;
			this.$refs.form.validate((isValid) => {
				let online_time = '';
				if (!isValid) {
					this.loading = false;
					return;
				}
				if (!this.formValidate.online_time) {
					online_time = '';
				} else {
					online_time = moment(this.formValidate.online_time).format('YYYY-MM-DD');
				}
				this.$request({
					url: '_TECH_PROJECT_NEED_ADD_POST',
					type: 'POST',
					loading: false,
					param: { 
						...this.formValidate,
						online_time 
					},
					autoTip: true
				}).then(() => {
					this.$router.go(-1);
				}).catch(error => {}).finally(() => {
					this.loading = false;
				});
			});
		},
		handleProgressEdit() {
			const { query = {} } = this.$route;
			ProjectPlanProgressEdit.popup({
				rateId: this.formValidate.rate_id,
				projectId: this.formValidate.project_id,
				rateList: this.rateList
			}).then(async (rate_id) => {
				await this.loadRateList(this.formValidate.project_id);
				this.formValidate.rate_id = rate_id;
			}).catch(error => {
				error && console.error(error);
			});
		}
	},
};
</script>

<style lang="scss">
.v-tech-project-plan-demand-add {
	.btn {
		color: #0085ff;
		cursor: pointer;
	}
	._right {
		@extend .btn;
		position: absolute; 
		right: -30px; 
		top: 0;
	}
	._submit {
		position: fixed;
		width: calc(100% - 160px);
		height: 45px;
		line-height: 45px;
		text-align: center;
		bottom: 0;
		right: 0;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		background: #fff;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>
