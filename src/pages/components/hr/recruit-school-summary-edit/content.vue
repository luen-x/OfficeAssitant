<template>
	<div class="g-m-t-10 v-hr-recruit-batch-edit">
		<div class="g-tr g-m-b-20">
			<div
				v-if="$auth[1265]"
				class="g-red-btn-line g-m-r-5"
				@click="handleCancel">
				暂不修改
			</div>
			<div
				v-if="$auth[1266]"
				class="g-red-btn-line"
				@click="handleClick">
				确认修改
			</div>
		</div>
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
				border
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
import { Form, Table, Page } from 'iview';
import { dataValidity, getItem, setItem } from '@utils/utils';
import { cloneDeep } from 'lodash';
import { tableHeight } from '@extends/mixins/tableHeight';
import { services, createSearch } from '@stores/services/hr';
import item from './item';

export default {
	name: 'oa-content',
	components: {
		'i-form': Form,
		'i-table': Table,
		'i-paging': Page
	},
	mixins: [
		services.recruitDePosition(),
		tableHeight({}),
		item
	],
	data() {
		let validateDate = (rule, value, callback) => {
			if (!value[0] || !value[1]) {
				callback(new Error("请选择试岗时间"));
			} else { callback(); }
		};
		let { page, pageSize } = this.$route.query;
		if (!pageSize) {
			pageSize = getItem('wya-vc.paging.localPageSize') || 30;
		}

		return {
			loading: false,
			total: 0,
			page: +page || 1,
			pageSize: +pageSize,
			formData: {
				list: [],
				formList: []
			},
			rule: {
				applicant_name: [
					{ required: true, message: "请输入姓名", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				mobile: [
					{ required: true, message: "请输入手机号码", trigger: "blur" },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: "blur" }
				],
				position_id: [{ required: true, message: "职位不能为空", type: 'array', trigger: "blur" }],
				college: [
					{ required: true, message: "请输入毕业学校", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				profession: [
					{ required: true, message: "请输入专业", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, trigger: "blur" }
				],
				education: [{ required: true, message: "请选择学历", pattern: /.+/, trigger: "change" }],
				email: [{ type: 'validEmail', validator: dataValidity, trigger: "blur" }],
				wechat: [{ validator: dataValidity, type: 'validWeChat', trigger: "blur" }],
				interview_result: [{ required: true, message: "请选择面试结果", pattern: /.+/, trigger: "change" }],
				reply_time: [{ required: true, message: "请选择回复报到时间", trigger: "change" }],
				register_time: [{ required: true, message: "请选择实际报到时间", trigger: "change" }],
				try_start_time: [
					{ required: true, message: "请选择试岗时间", type: 'array', trigger: "change" },
					{ validator: validateDate, trigger: 'change' }
				],
				predict_entry_time: [{ required: true, message: "请选择预计入职时间", trigger: "change" }],
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			const { page, pageSize } = this;
			this.$router.replace({ path: '/hr/recruit/school/summary/edit', query: { ...this.$route.query, page, pageSize } });
			this.loading = true;
			this.$request({
				url: 'HR_RECRUIT_SCHOOL_SUMMARY_LIST_GET',
				type: 'GET',
				param: {
					type: this.$route.query.type,
					page,
					pageSize
				},
				loading: false
			}).then((res) => {
				this.loading = false;
				this.total = res.data.totalCount;
				this.formData.list = [...res.data.list];
				// 初始化数据
				this.formData.list.forEach((it, index) => {
					it.position_id = [it.depart_id, it.position_id];
					it.alternative_position_id = [it.alternative_depart_id, it.alternative_position_id];
					it.try_start_time = [it.try_start_time, it.try_end_time];
				});
				this.formData.formList = cloneDeep(this.formData.list);
			}).catch((error) => {
			});
		},
		handleCancel() {
			this.$router.back();
		},
		handlePageChange(page) {
			this.page = page;
			this.loadData();
		},
		handlePageSizeChange(size) {
			this.pageSize = size;
			setItem('wya-vc.paging.localPageSize', size);
			this.loadData();
		},
		// 发送请求
		handleClick() {
			let list = [];
			this.$refs.form.validate(valid => {
				if (valid) {
					list = cloneDeep(this.formData.formList);
					// 处理数据
					list.forEach((it, index) => {
						list[index].depart_id = it.position_id[0];
						list[index].position_id = it.position_id[1];
						list[index].alternative_depart_id = it.alternative_position_id[0];
						list[index].alternative_position_id = it.alternative_position_id[1];
						let time = it.try_start_time;
						list[index].try_start_time = time[0];
						list[index].try_end_time = time[1];
					});
					this.$request({
						url: '_HR_RECRUIT_SCHOOL_BATCH_POST',
						type: 'POST',
						param: {
							multi_data: list
						},
						loading: false
					}).then((res) => {
						this.$Message.success('操作成功');
						this.$router.back();
					}).catch((error) => {
						this.$Message.error(error.msg);
					});
				} else {
					this.$Message.warning('数据格式不正确');
				}
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-hr-recruit-batch-edit {
	._footer {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		background-color: #fff;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);

	}
}
</style>
<style lang="scss">
.v-hr-recruit-batch-edit {
	.ivu-table {
		.ivu-form-item {
			margin-bottom: 0 !important;
		}
		.ivu-input, .ivu-select-selection {
			border: 1px solid transparent;
			background-color: transparent;
		}
		.ivu-form-item-error .ivu-input, .ivu-form-item-error .ivu-select-selection {
			border: 1px solid #ed4014;
		}
		// .ivu-input-wrapper:focus {
		// 	outline-color: transparent;
		// }
	}
}
</style>
