<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		width="400"
		class="g-flex"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>

		<!-- :style="{marginLeft: data.action === 'adjust' ? '34px' : ''}" -->
		<div class="g-flex g-fd-c g-ai-c">
			<p class="g-m-b-20 g-c-red-light">{{ tip }}</p>

			<div
				v-if="data.action === 'adjust-all'"
				class="g-m-b-20">
				<span class="g-c-black-mid g-fs-16 g-m-r-10">已选择{{ data.selected.length }}人</span>
				<i-poptip
					:content="staff"
					trigger="hover"
					transfer
					word-wrap
					width="350"
					placement="bottom-start">
					查看人员
				</i-poptip>
			</div>

			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="85"
			>

				<i-form-item
					label="底薪设置："
					prop="basic_salary_id">
					<i-select
						v-model="form.basic_salary_id"
						placeholder="新薪资浮动名称"
						style="width: 220px;"
						clearable
						transfer>
						<i-option
							v-for="(item, index) in baseSalaryList"
							:key="index"
							:value="item.basic_salary_id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item
					label="提成设置："
					prop="rate_case_id">
					<i-select
						v-model="form.rate_case_id"
						placeholder="新薪资浮动名称"
						style="width: 220px;"
						clearable
						transfer>
						<i-option
							v-for="(item, index) in rateCaseList"
							:key="index"
							:value="item.rate_case_id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>

			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Select, Option, Poptip, Form, FormItem } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import moment from 'moment';

export default {
	name: "hr-salary-wage-monthly",
	components: {
		"i-modal": Modal,
		"i-select": Select,
		"i-option": Option,
		"i-poptip": Poptip,
		"i-form": Form,
		"i-form-item": FormItem,
		"vc-copy": Copy
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			title: '',
			form: {},
			rule: {
				basic_salary_id: [{ required: true, message: '底薪不能为空', pattern: /.+/, trigger: 'change' }],
				rate_case_id: [{ required: true, message: '提成不能为空', pattern: /.+/, trigger: 'change' }]
			},
			showStaff: false,
			staff: '',
			tip: '',
			baseSalaryList: [],
			rateCaseList: []
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.title = this.data.action === 'adjust' ? '调整薪资名称' : '调整薪资调整';

		this.loadBasicSalaryList();
		this.loadRateCaseList();

		if (this.data.action === 'adjust') {
			// 提示语
			this.$request({
				url: '_HR_SALARY_ACTION_TIP_GET',
				type: 'GET',
				loading: false
			}).then(res => {
				this.tip = res.data.msg;
			}).catch(err => {});

			// 初始化底薪、提成值
			this.form.basic_salary_id = this.data.selected.basic_salary_id;
			this.form.rate_case_id = this.data.selected.rate_case_id;
		}

		// 员工名单
		if (this.data.action === 'adjust-all') {
			this.data.selected.forEach((item, index) => {
				index !== this.data.selected.length - 1 ? this.staff += item.staff_name + '、' : this.staff += item.staff_name;
			});
		}

	},
	methods: {
		// 加载底薪下拉列表
		loadBasicSalaryList() {
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_DETAILS_BASIC_SALARY_GET',
				type: 'GET',
				param: {
					depart_id: this.data.action === 'adjust' ? this.data.selected.depart_id : this.data.selected[0].depart_id
				},
				loading: false
			}).then((res) => {
				this.baseSalaryList = res.data;
			}).catch((error) => {});
		},
		// 加载提成下拉列表
		loadRateCaseList() {
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET',
				type: 'GET',
				param: {
					depart_id: this.data.action === 'adjust' ? this.data.selected.depart_id : this.data.selected[0].depart_id
				},
				loading: false
			}).then((res) => {
				this.rateCaseList = res.data;
			}).catch((error) => {});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			let staff_id = this.data.action === 'adjust' ? this.data.selected.staff_id : this.data.selected.map(sed => sed.staff_id).join(','); // eslint-disable-line
			this.$refs['form'].validate(valid => {
				if (valid) {

					this.$request({
						url: '_HR_SALARY_WAGE_MONTHLY_ADJUST_POST',
						type: 'POST',
						param: {
							...this.form,
							staff_id,
							month: moment(this.data.month).format('YYYY-MM')
						},
						loading: false
					}).then((res) => {
						this.$emit('sure');
						this.$Message.success('操作成功');
						this.$store.commit('HR_SALARY_WAGE_MONTHLY_LIST_INIT');
					}).catch((error) => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(error.msg);
					});

				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('请按照提示信息完善表单');
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>
