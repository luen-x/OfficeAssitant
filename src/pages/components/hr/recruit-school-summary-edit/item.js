import { FormItem, Input, Select, Option, Cascader, DatePicker } from 'iview';
import OaSelect from './common/oa-select.vue';

export default {
	data() {
		return {
			columns: this.getColumns(this.$route.query.type),
		};
	},
	methods: {
		// handleInputChange(e, index, row, key) {
		// 	row[key] = e.target.value;
		// 	this.formData.list[index] = row;
		// 	if(!e.target.value)this.formData.list[index][key] = e.target.value;
		// },
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
					// align: 'center',
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
					title: '性别',
					key: 'sex',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								性别
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.sex`} rules={this.rule.sex}>
								<OaSelect
									value={this.formData.formList[params.index].sex}
									index={params.index}
									name="sex"
									style="width: 160px;"
									change={this.handleSelectChange} />
							</FormItem>
						);
					}
				},
				{
					title: '备选职位',
					key: 'alternative_position_id',
					minWidth: 196,
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.alternative_position_id`} rules={this.rule.alternative_position_id}>
								<Cascader
									value={this.formData.formList[params.index].alternative_position_id}
									data={this.recruitDePosition}
									clearable
									transfer
									trigger="hover"
									style="width: 160px;"
									placeholder="请选择备选职位"
									onOn-change={v => this.handleSelectChange(v, params.index, 'alternative_position_id')} />
							</FormItem>
						);
					}
				},
				{
					title: '毕业学校',
					key: 'college',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								毕业学校
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.college`} rules={this.rule.college}>
								<Input
									value={this.formData.formList[params.index].college}
									maxlength={55}
									placeholder="请输入毕业学校"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'college')} />
							</FormItem>
						);
					}
				},
				{
					title: '专业',
					key: 'profession',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								专业
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.profession`} rules={this.rule.profession}>
								<Input
									value={this.formData.formList[params.index].profession}
									maxlength={20}
									placeholder="请输入专业"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'profession')} />
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
					title: '邮箱',
					key: 'email',
					minWidth: 196,
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.email`} rules={this.rule.email}>
								<Input
									value={this.formData.formList[params.index].email}
									maxlength={50}
									placeholder="请输入邮箱"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'email')} />
							</FormItem>
						);
					}
				},
				{
					title: '微信号',
					key: 'wechat',
					minWidth: 196,
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.wechat`} rules={this.rule.wechat}>
								<Input
									value={this.formData.formList[params.index].wechat}
									maxlength={20}
									placeholder="请输入微信号"
									style="width: 160px;"
									onOn-blur={e => this.handleInputBlur(e, params.index, 'wechat')} />
							</FormItem>
						);
					}
				},
				{
					title: '面试结果',
					key: 'interview_result',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								面试结果
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.interview_result`} rules={this.rule.interview_result}>
								<OaSelect
									value={this.formData.formList[params.index].interview_result}
									index={params.index}
									name="interview_result"
									style="width: 160px;"
									change={this.handleSelectChange} />
							</FormItem>
						);
					}
				},
				{
					title: '回复报到时间',
					key: 'reply_time',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								回复报到时间
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.reply_time`} rules={this.rule.reply_time}>
								<DatePicker
									value={this.formData.formList[params.index].reply_time}
									type="date"
									transfer={true}
									clearable={true}
									placeholder="请选择回复报到时间"
									style="width: 160px;"
									onOn-change={e => this.handleSelectChange(e, params.index, 'reply_time')} />
							</FormItem>
						);
					}
				},
				{
					title: '实际报到时间',
					key: 'register_time',
					minWidth: 196,
					renderHeader: (h, params) => {
						return (
							<span>
								<span class="g-c-red-mid g-fs-14" style={{ marginRight: '2px' }}>*</span>
								实际报到时间
							</span>
						);
					},
					render: (h, params) => {
						return (
							<FormItem prop={`formList.${params.index}.register_time`} rules={this.rule.register_time}>
								<DatePicker
									value={this.formData.formList[params.index].register_time}
									type="date"
									transfer={true}
									clearable={true}
									placeholder="请选择实际报到时间"
									style="width: 160px;"
									onOn-change={e => this.handleSelectChange(e, params.index, 'register_time')} />
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
					columns.splice(columns.length - 5, 5);
					return columns;
				case '2':
				case '3':
				case '4':
					columns.splice(columns.length - 4, 4);
					return columns;
				case '5':
					columns.splice(columns.length - 3, 3);
					return columns;
				case '6':
					columns.splice(columns.length - 2, 2);
					return columns;
				case '7':
					columns.splice(columns.length - 1, 1);
					return columns;
				case '8':
					return columns;
				default:
					return columns;
			}
		}
	}
};
