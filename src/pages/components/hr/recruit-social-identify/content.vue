<template>
	<div>
		<div v-if="!uploadLoading" class="v-hr-recruit-social-identify g-pd-t-15">
			<div class="_mian g-flex-cc g-m-tb-20">
				<i-form
					ref="basicForm"
					:model="basicForm"
					:rules="basicRule"
					:label-width="120"
					class="_form g-flex g-fw-w g-jc-sb">

					<i-form-item label="应聘职位：" prop="position_id">
						<i-cascader
							v-model="basicForm.position_id"
							:data="recruitDePosition"
							clearable
							filterable
							transfer
							trigger="hover"
							style="width: 300px;"
							placeholder="请选择应聘职位"
						/>
					</i-form-item>

					<i-form-item label="招聘渠道:" prop="ditch">
						<i-select
							v-model="basicForm.ditch"
							style="width: 300px"
							clearable
							transfer
							placeholder="请选择招聘渠道"
						>
							<i-option
								v-for="(item, index) in ditches"
								:key="index"
								:value="item.value"
							>
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>
					<div v-if="basicForm.ditch == 22">
						<i-form-item label="转介绍人:" prop="introducer_id">
							<i-select
								ref="introducer"
								:value="basicForm.introducer_id"
								:remote-method="loadIntroducer"
								:loading="introducerLoading"
								style="width: 300px;"
								filterable
								remote
								clearable
								transfer
								label-in-value
								placeholder="请选择转介绍人"
								@on-change="handleChange"
								@on-query-change="handleQueryChange"
							>
								<i-option
									v-for="(item, index) in introducerData"
									:key="index"
									:value="item.value"
								>{{ item.label }}</i-option>
							</i-select>
						</i-form-item>
					</div>

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
							<span />
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
		<oa-loading v-else />
	</div>
</template>

<script>
import { Button, Cascader, Form, FormItem, DatePicker, Input, Select, Option, Table, Page } from 'iview';
import { cloneDeep } from 'lodash';
import { Upload } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { dataValidity, getParseUrl, getHashUrl, getItem, setItem } from '@utils/utils';
// import Upload from '@components/_common/upload/upload';
import { services, createSearch } from '@stores/services/hr';
import { services as commonServices } from '@stores/services/common';
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
		services.ditches(),
		commonServices.region(),
		createSearch({ key: 'introducer' }),
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
			page: +page || 1,
			pageSize: +pageSize,
			recognition_remark: '',
			timeList: [],
			resumes: [],
			is_new: 1,
			canUpload: false,
			uploadLoading: false,
			introducer: '',
			basicForm: {
				position_id: [],
				ditch: '',
				introducer_id: ''
			},
			basicRule: {
				position_id: [{ required: true, message: "请选择应聘职位", type: 'array', trigger: "change" }],
				ditch: [{ required: true, message: "请选择招聘渠道", pattern: /.+/, trigger: "change" }],
				introducer_id: [
					{ 
						required: true, 
						message: "转介绍人不能为空", 
						pattern: /.+/, 
						trigger: "change",
						validator: (rule, value, cb) => {
							if (value || value === 0) { 
								cb();
							} else {
								cb('转介绍人不能为空');
							}
						}
					}
				],
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
				// college: [
				// 	{ required: true, message: "请输入毕业学校", trigger: "blur" },
				// 	{ type: 'validName', validator: dataValidity, trigger: "blur" }
				// ],
				// profession: [
				// 	{ required: true, message: "请输入专业", trigger: "blur" },
				// 	{ type: 'validName', validator: dataValidity, trigger: "blur" }
				// ],
				education: [{ required: true, message: "请选择学历", pattern: /.+/, trigger: "change" }],
			}
		};
	},
	watch: {
		'basicForm': {
			handler(newV, oldV) {
				if ((this.basicForm.ditch || this.basicForm.ditch === 0)
					&& this.basicForm.position_id && this.basicForm.position_id.length) {
					this.canUpload = true;
					if (this.basicForm.ditch == 22 && !this.basicForm.introducer_id) {
						this.canUpload = false;
					}
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
		handleChange(value) {
			this.basicForm.introducer_name = value && value.label;
			this.basicForm.introducer_id = value && value.value;
		},
		handleQueryChange(query = '') {
			let targetQuery = this.introducer_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.introducer.clearSingleSelect();
			}
		},
		handleLinkDetail() {
			this.$router.push('/hr/recruit/social/identify-detail');
		},
		loadData() {
			const { page, pageSize } = this;
			let { query = {} } = getParseUrl();
			this.$router.replace({ path: '/hr/recruit/social/identify', query: { ...this.$route.query, page, pageSize } });
			this.loading = true;
			this.$request({
				url: 'HR_RECRUIT_SCHOOL_IDENTIFY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					add_type: 2,
					page,
					pageSize,
					is_new: this.is_new
				},
			}).then((res) => {
				this.loading = false;
				this.is_new = 0;
				this.recognition_remark = res.data.recognition_remark;
				this.total = res.data.totalCount;
				this.formData.list = [...res.data.list];
				// 初始化数据
				this.formData.list.forEach((it, index) => {
					it.applicant_name = it.applicant_name || '';
					it.position_id = [it.depart_id, it.position_id];
					it.region = [it.province, it.city];
					it.isEditing = 0;
				});
				this.formData.formList = cloneDeep(this.formData.list);
			}).catch((error) => {
			});
		},
		handleFileComplete(response) {
			this.uploadLoading = true;
			if (response.error === 1) {
				this.uploadLoading = false;
			} else if (response.success === response.imgs.length) {
				this.$request({
					url: '_HR_RECRUIT_IDENTIFY_RESUME_POST',
					type: 'POST',
					param: {
						add_type: 2,
						...this.basicForm,
						depart_id: this.basicForm.position_id[0],
						position_id: this.basicForm.position_id[1],
						resume_urls: response.imgs.map(it => it.data.url)
					},
					loading: false
				}).then((res) => {
					this.uploadLoading = false;
					this.$Message.success(res.msg);
					this.loadStatus();
				}).catch((error) => {
					this.uploadLoading = false;
					this.$Message.error(error.msg);
				});
			}
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
.v-hr-recruit-social-identify {
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
.v-hr-recruit-social-identify {
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
