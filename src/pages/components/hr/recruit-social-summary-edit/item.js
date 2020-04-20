import { FormItem, Input, InputNumber, Select, Option, Cascader, DatePicker } from 'iview';
import OaSelect from '../recruit-school-summary-edit/common/oa-select.vue';

export default {
	data() {
		return {
			columns: this.getColumns(this.$route.query.type)
		};
	},
	methods: {
		handleInputBlur(e, index, key) {
			this.formData.formList[index][key] = e.target.value;
		},
		handleSelectChange(v, index, key) {
			this.formData.formList[index][key] = v;
		},
		getColumns(type) {
			let columns = [
				{
					title: '姓名',
					key: 'applicant_name',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								姓名
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.applicant_name`} rules={this.rule.applicant_name}>
								<Input
									value={this.formData.formList[params.index].applicant_name}
									maxlength={10}
									placeholder="请输入姓名"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'applicant_name')} />
							</FormItem>
						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								手机号码
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.mobile`} rules={this.rule.mobile}>
								<Input
									value={this.formData.formList[params.index].mobile}
									maxlength={11}
									placeholder="请输入手机号码"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'mobile')} />
							</FormItem>
						);
					}
				},
				{
					title: '应聘职位',
					key: 'position_id',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								应聘职位
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.position_id`} rules={this.rule.position_id}>
								<Cascader
									value={this.formData.formList[params.index].position_id}
									data={this.recruitDePosition}
									clearable
									transfer
									trigger="hover"
									style="width: 160px;"
									placeholder="请选择应聘职位"
									onOn-change={v => this.handleSelectChange(v, params.index, 'position_id')} />
							</FormItem>
						);
					}
				},
				{
					title: '年龄',
					key: 'age',
					minWidth: 196,
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.age`} rules={this.rule.age}>
								<Input
									value={this.formData.formList[params.index].age}
									maxlength={2}
									placeholder="请输入年龄"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'age')} />
							</FormItem>
						);
					}
				},
				{
					title: '期望薪资',
					key: 'salary',
					minWidth: 196,
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.salary`} rules={this.rule.salary}>
								<Input
									value={this.formData.formList[params.index].salary}
									maxlength={20}
									placeholder="请输入期望薪资"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'salary')} />
							</FormItem>
						);
					}
				},
				{
					title: '学历',
					key: 'education',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								学历
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.education`} rules={this.rule.education}>
								<OaSelect
									value={this.formData.formList[params.index].education}
									index={params.index}
									name="education"
									style="width: 160px;"
									change={this.handleSelectChange} />
							</FormItem>
						);
					}
				},
				{
					title: '工作年限',
					key: 'work_time',
					minWidth: 196,
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.work_time`} rules={this.rule.work_time}>
								<OaSelect
									value={this.formData.formList[params.index].work_time}
									index={params.index}
									name="work_time"
									style="width: 160px;"
									change={this.handleSelectChange} />
							</FormItem>
						);
					}
				},
				{
					title: '籍贯',
					key: 'region',
					minWidth: 196,
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.region`} rules={this.rule.region}>
								<Cascader
									value={this.formData.formList[params.index].region}
									data={this.region}
									clearable
									transfer
									change-on-select
									trigger="hover"
									style="width: 160px;"
									placeholder="请选择籍贯"
									onOn-change={v => this.handleSelectChange(v, params.index, 'region')} />
							</FormItem>
						);
					}
				},
				{
					title: '现居住地',
					key: 'now_address',
					minWidth: 196,
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.now_address`} rules={this.rule.now_address}>
								<Input
									value={this.formData.formList[params.index].now_address}
									maxlength={50}
									placeholder="请输入现居住地"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'now_address')} />
							</FormItem>
						);
					}
				},
				{
					title: '预计面试时间',
					key: 'predict_interview_time',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								预计面试时间
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.predict_interview_time`} rules={this.rule.predict_interview_time}>
								<DatePicker
									value={this.formData.formList[params.index].predict_interview_time}
									type="datetime"
									format="yyyy-MM-dd HH:mm"
									transfer={true}
									clearable={true}
									placeholder="请选择预计面试时间"
									style="width: 160px;"
									onOn-change={e => this.handleSelectChange(e, params.index, 'predict_interview_time')} />
							</FormItem>
						);
					}
				},
				{
					title: '实际面试时间',
					key: 'interview_time',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								实际面试时间
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.interview_time`} rules={this.rule.interview_time}>
								<DatePicker
									value={this.formData.formList[params.index].interview_time}
									type="datetime"
									format="yyyy-MM-dd HH:mm"
									transfer={true}
									clearable={true}
									placeholder="请选择实际面试时间"
									style="width: 160px;"
									onOn-change={e => this.handleSelectChange(e, params.index, 'interview_time')} />
							</FormItem>
						);
					}
				},
				{
					title: '试岗时间',
					key: 'try_start_time',
					minWidth: 236,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								试岗时间
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.try_start_time`} rules={this.rule.try_start_time}>
								<DatePicker
									value={this.formData.formList[params.index].try_start_time}
									type="daterange"
									transfer={true}
									clearable={true}
									split-panel={true}
									placeholder="请选择试岗时间"
									style="width: 200px;"
									onOn-change={e => this.handleSelectChange(e, params.index, 'try_start_time')} />
							</FormItem>
						);
					}
				},
				{
					title: '预计入职时间',
					key: 'predict_entry_time',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								预计入职时间
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.predict_entry_time`} rules={this.rule.predict_entry_time}>
								<DatePicker
									value={this.formData.formList[params.index].predict_entry_time}
									type="date"
									transfer={true}
									clearable={true}
									placeholder="请选择预计入职时间"
									style="width: 160px;"
									onOn-change={e => this.handleSelectChange(e, params.index, 'predict_entry_time')} />
							</FormItem>
						);
					}
				}
			];

			switch (type) {
				case '1':
					columns.splice(columns.length - 4, 4);
					return columns;
				case '8':
					columns.splice(columns.length - 3, 3);
					return columns;
				case '2':
				case '3':
					columns.splice(columns.length - 2, 2);
					return columns;
				case '4':
					columns.splice(columns.length - 1, 1);
					return columns;
				case '6':
					return columns;
				default:
					return columns;
			}
		}
	}
};
