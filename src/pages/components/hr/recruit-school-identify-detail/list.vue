<template>
	<div>
		<div v-if="!uploadLoading" class="v-hr-recruit-social-identify g-pd-t-15">
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
import { tableHeight } from '@extends/mixins/tableHeight';
import { dataValidity, getParseUrl, getHashUrl, getItem, setItem } from '@utils/utils';
import Upload from '@components/_common/upload/upload';
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
		"oa-upload": Upload
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
			timeList: [],
			resumes: [],
			canUpload: false,
			uploadLoading: false,
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
				introducer_id: [{ required: true, message: "转介绍人不能为空", pattern: /.+/, trigger: "blur" }],
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
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			const { page, pageSize } = this;
			let { query = {} } = getParseUrl();
			this.$router.replace({ path: '/hr/recruit/school/identify-detail', query: { ...this.$route.query, page, pageSize } });
			this.loading = true;
			this.$request({
				url: 'HR_RECRUIT_SCHOOL_IDENTIFY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					add_type: 3,
					page,
					pageSize,
				},
			}).then((res) => {
				this.loading = false;
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
