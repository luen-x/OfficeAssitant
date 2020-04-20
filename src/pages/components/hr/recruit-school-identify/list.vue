<template>
	<div class="v-hr-recruit-school-identify g-pd-t-15">
		<div class="_mian g-flex-cc g-m-tb-20">
			<i-form
				ref="basicForm"
				:model="basicForm"
				:rules="basicRule"
				:label-width="120"
				class="_form g-flex g-fw-w g-jc-sb">
				<i-form-item label="招聘会学校：" prop="meeting_name">
					<i-select
						v-model="basicForm.meeting_name"
						:remote-method="loadMeeting"
						:loading="meetingLoading"
						style="width: 300px;"
						filterable
						remote
						clearable
						transfer
						placeholder="请输入招聘会学校"
						@on-change="getMeetingTime"
					>
						<i-option
							v-for="(item, index) in meetingData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="招聘会时间：" prop="meeting_id">
					<i-select
						v-model="basicForm.meeting_id"
						clearable
						transfer
						placeholder="请选择招聘会时间"
						style="width: 300px;">
						<i-option
							v-for="item in timeList"
							:key="item.meeting_id"
							:value="item.meeting_id">
							{{ item.meeting_time }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="招聘会年份：" prop="meeting_year">
					<i-select
						v-model="basicForm.meeting_year"
						clearable
						transfer
						placeholder="请选择招聘会年份"
						style="width: 300px;">
						<i-option
							v-for="item in meetingYear"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="招聘会季节：" prop="season_type">
					<i-select
						v-model="basicForm.season_type"
						clearable
						transfer
						placeholder="请选择招聘会季节"
						style="width: 300px;">
						<i-option
							v-for="item in seasonType"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="应聘职位：" prop="position_id">
					<i-cascader
						v-model="basicForm.position_id"
						:data="recruitDePosition"
						clearable
						transfer
						filterable
						trigger="hover"
						style="width: 300px;"
						placeholder="请选择应聘职位"
					/>
				</i-form-item>
				<i-form-item
					label="简历附件："
					style="width: 100%;"
					class="g-m-t-20">
					<div
						v-if="!canUpload"
						class="_display"
						style="cursor: not-allowed">
						<div class="g-flex g-jc-c g-ai-c g-fd-c">
							<i class="icon iconfont icon-shangchuan g-m-b-5" style="fontSize: 40px; color: #D5D5D5" />
							点击或拖拽上传多份简历
						</div>
					</div>
					<vc-upload
						v-else
						v-model="resumes"
						class="_upload"
						@complete="handleFileComplete">
						<div class="_display">
							<div class="g-flex g-jc-c g-ai-c g-fd-c">
								<i class="icon iconfont icon-shangchuan g-m-b-5" style="fontSize: 40px; color: #D5D5D5" />
								点击或拖拽上传多份简历
							</div>
						</div>
						
					</vc-upload>
					<div>
						<span class="g-operation" @click="handleLinkDetail">
							{{ recognition_remark }}查看详情
						</span>
					</div>
				</i-form-item>
			</i-form>
		</div>

		<!-- 列表 -->
		<i-form
			ref="form"
			:model="formData"
			:rules="rule"
			:show-message="false">
			<i-table
				:data="formData.list"
				:columns="columns"
				:loading="loading"
				:height="tableHeight"
				stripe
				class="_table"/>
		</i-form>
		<div class="_footer g-flex-ac g-jc-fe g-pd-r-20">
			<i-paging
				:page-size="pageSize"
				:total="total"
				:current="page"
				:page-size-opts="[10, 20, 30]"
				show-total
				show-elevator
				show-sizer
				@on-change="handlePageChange"
				@on-page-size-change="handlePageSizeChange">
				<div>共{{ total }}条</div>
			</i-paging>
		</div>
	</div>
</template>

<script>
import { Button, Cascader, Form, FormItem, DatePicker, Input, Select, Option, Table, Page } from 'iview';
import { cloneDeep } from 'lodash';
import { Upload } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { dataValidity, getParseUrl, getHashUrl, getItem, setItem } from '@utils/utils';
// import Upload from '@components/_common/upload/upload';
import { services, searchMeeting } from '@stores/services/hr';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-table': Table,
		'i-paging': Page,
		'i-button': Button,
		'i-cascader': Cascader,
		"i-date-picker": DatePicker,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"vc-upload": Upload
	},
	mixins: [
		services.recruitDePosition(),
		services.meetingYear(),
		services.seasonType(),
		services.education(),
		searchMeeting,
		tableHeight({}),
		item
	],
	data() {
		const { query } = this.$route;
		let { page, pageSize } = this.$route.query;
		if (!pageSize) {
			pageSize = getItem('wya-vc.paging.localPageSize') || 30;
		}

		return {
			loading: false,
			total: 0,
			recognition_remark: '',
			page: +page || 1,
			pageSize: +pageSize,
			timeList: [],
			resumes: [],
			canUpload: false,
			is_new: 1,
			basicForm: {
				position_id: [],
				meeting_name: '',
				meeting_id: '',
				meeting_year: '',
				season_type: ''
			},
			basicRule: {
				position_id: [{ required: true, message: "请选择应聘职位", type: 'array', trigger: "change" }],
				meeting_name: [{ required: true, message: "请选择招聘会学校", pattern: /.+/, trigger: "change" }],
				meeting_id: [{ required: true, message: "请选择招聘会时间", pattern: /.+/, trigger: "change" }],
				meeting_year: [{ required: true, message: "请选择招聘会年份", pattern: /.+/, trigger: "change" }],
				season_type: [{ required: true, message: "请选择招聘会季节", pattern: /.+/, trigger: "change" }],
			},
			formData: {
				list: [],
				formList: []
			},
			rule: {
				applicant_name: [
					{ required: true, message: "请输入姓名", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				sex: [{ required: true, message: "请选择性别", pattern: /.+/, trigger: "change" }],
				mobile: [
					{ required: true, message: "请输入手机号码", trigger: "blur" },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: "blur" }
				],
				// position_id: [{ required: true, message: "职位不能为空", type: 'array', trigger: "blur" }],
				college: [
					{ required: true, message: "请输入毕业学校", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				profession: [
					{ required: true, message: "请输入专业", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				education: [{ required: true, message: "请选择学历", pattern: /.+/, trigger: "change" }],
			}
		};
	},
	watch: {
		'basicForm': {
			handler(newV, oldV) {
				if (this.basicForm.meeting_id && this.basicForm.position_id && this.basicForm.position_id.length
					&& this.basicForm.meeting_name && this.basicForm.meeting_year && this.basicForm.season_type) {
					this.canUpload = true;
				} else {
					this.canUpload = false;
				}
			},
			deep: true
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		handleLinkDetail() {
			this.$router.push('/hr/recruit/school/identify-detail');
		},
		loadData() {
			const { page, pageSize } = this;
			let { query = {} } = getParseUrl();
			this.$router.replace({ path: '/hr/recruit/school/identify', query: { ...this.$route.query, page, pageSize } });
			this.loading = true;
			this.$request({
				url: 'HR_RECRUIT_SCHOOL_IDENTIFY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					add_type: 3,
					page,
					pageSize,
					is_new: this.is_new
				},
			}).then((res) => {
				this.loading = false;
				this.is_new = 0;
				this.total = res.data.totalCount;
				this.recognition_remark = res.data.recognition_remark;
				this.formData.list = [...res.data.list];
				// 初始化数据
				this.formData.list.forEach((it, index) => {
					it.applicant_name = it.applicant_name || '';
					it.position_id = [it.depart_id, it.position_id];
					it.isEditing = 0;
				});
				this.formData.formList = cloneDeep(this.formData.list);
			}).catch((error) => {
			});
		},
		loadStatus() {
			setTimeout(() => {
				this.$request({
					url: '_HR_RECRUIT_STATUS_CHANGE_GET',
					type: 'GET',
					param: {
					},
					loading: false
				}).then((res) => {
					if (res.data.is_complete) {
						this.uploadLoading = false;
						this.$Message.success(res.msg);
						this.loadData();
					} else {
						this.loadStatus();
					}
				}).catch((error) => {
					this.uploadLoading = false;
					this.$Message.error(error.msg);
				});
			}, 1000);
		},
		// 获取招聘会时间下拉框
		getMeetingTime(val) {
			if (val) {
				this.meetingData.forEach(it => {
					if (it.value === val) {
						it.children instanceof Array ? this.timeList = it.children
							: this.timeList[0] = { ...it.children };
					}
				});
			} else {
				this.basicForm.meeting_id = '';
			}
		},
		handleFileComplete(response) {
			if (response.success === response.imgs.length) {
				this.$request({
					url: '_HR_RECRUIT_IDENTIFY_RESUME_POST',
					type: 'POST',
					param: {
						add_type: 3,
						...this.basicForm,
						depart_id: this.basicForm.position_id[0],
						position_id: this.basicForm.position_id[1],
						resume_urls: response.imgs.map(it => it.data.url)
					},
				}).then((res) => {
					this.$Message.success('操作成功');
					this.loadStatus();
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			}
		},
		handlePageChange(page) {
			this.page = page;
			this.loadData();
		},
		handlePageSizeChange(size) {
			this.pageSize = size;
			setItem('wya-vc.paging.localPageSize', size);
			this.loadData();
		}
	}
};

</script>

<style lang="scss" scoped>
.v-hr-recruit-school-identify {
	._mian {
		width: 100%;
		padding-left: 150px;
		padding-right: 150px;
		._form {
			max-width: 1060px;
			._display {
				width: 100%;
				height: 200px;
				border-radius: 4px;
				border: 1px solid #D9DCE0;
				padding: 20px;
				display: flex;

				& > div {
					flex: 1;
					border: 1px dashed #D9DCE0;
				}
			}
		}
	}
	._table {
		margin-bottom: 60px;
	}
	._footer {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		z-index: 999;
		background-color: #fff;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);

	}
}
</style>

<style lang="scss">
.v-hr-recruit-school-identify {
	.ivu-table {
		.ivu-form-item {
			margin-bottom: 0 !important;
		}
		.ivu-form-item-error .ivu-input, .ivu-form-item-error .ivu-select-selection {
			border: 1px solid #ed4014;
		}
	}
}
</style>
