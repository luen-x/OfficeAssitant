import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Divider, FormItem, Input, Select, Option, Cascader, DatePicker } from 'iview';
import { cloneDeep } from 'lodash';
import { ImgsPreview } from 'wya-vc';
import { FilePreview } from '@components/_common/file-preview/file-preview';
import FileType from '@components/_common/upload/file-type';
import OaSelect from '../recruit-school-summary-edit/common/oa-select.vue';

export default {
	data() {
		return {
			fileType: FileType,
			columns: [
				{
					title: "识别状态",
					key: "status_name",
					minWidth: 150,
					render: (h, params) => {
						const { status, status_name } = params.row;
						return (
							<div>
								{ status_name }
								{ status === 1 && <span>
									（<span
										class="g-pointer g-c-blue-mid"
										onClick={(e) => this.handleWatchResume(e, params)}>
										查看简历
									</span>）
								</span>}
							</div>
						);
					}
				},
				{
					title: "简历名称",
					key: "resume_title",
					fixed: "left",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={this.formData.formList[params.index].resume_title}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "姓名",
					key: "applicant_name",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.applicant_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.applicant_name`}
										rules={this.rule.applicant_name}>
										<Input
											value={this.formData.formList[params.index].applicant_name}
											maxlength={10}
											placeholder="请输入姓名"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'applicant_name')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "应聘职位",
					key: "position_name",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.position_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.position_id`}
										rules={this.rule.position_id}>
										<Cascader
											value={this.formData.formList[params.index].position_id}
											data={this.recruitDePosition}
											clearable
											transfer
											trigger="hover"
											style="width: 160px;"
											placeholder="请选择应聘职位"
											onOn-change={v => this.handleSelectChange(v, params.index, 'position_id')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "性别",
					key: "sex_name",
					minWidth: 136,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.sex === 0 ? '男' : '女'}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.sex`}
										rules={this.rule.sex}>
										<OaSelect
											value={this.formData.formList[params.index].sex}
											index={params.index}
											name="sex"
											style="width: 100px;"
											change={this.handleSelectChange} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "手机号码",
					key: "mobile",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.mobile}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.mobile`}
										rules={this.rule.mobile}>
										<Input
											value={this.formData.formList[params.index].mobile}
											maxlength={11}
											placeholder="请输入手机号码"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'mobile')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "毕业学校",
					key: "college",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <AutoToolTip
										content={params.row.college}
										labelClass=""
										theme="dark"
									/> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.college`}
										rules={this.rule.college}>
										<Input
											value={this.formData.formList[params.index].college}
											maxlength={55}
											placeholder="请输入毕业学校"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'college')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "专业",
					key: "profession",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.profession}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.profession`}
										rules={this.rule.profession}>
										<Input
											value={this.formData.formList[params.index].profession}
											maxlength={20}
											placeholder="请输入专业"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'profession')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "学历",
					key: "education",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.education_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.education`}
										rules={this.rule.education}>
										<OaSelect
											value={this.formData.formList[params.index].education}
											index={params.index}
											name="education"
											style="width: 160px;"
											change={this.handleSelectChange} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "操作",
					key: 'action',
					minWidth: 120,
					align: 'center',
					fixed: "right",
					render: (h, params) => {
						let editing = this.formData.formList[params.index].isEditing;
						return (
							<div class="g-pointer g-c-blue-mid">
								{ editing != 1 && <span onClick={ () => this.handleEdit(params)}>编辑</span>}
								{ editing == 1 && <span>
									<span onClick={ () => this.handleSave(params)}>保存</span>
									<Divider type="vertical" />
									<span onClick={ () => { this.formData.formList[params.index].isEditing = 0; }}>取消</span>
								</span> }
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleInputBlur(e, index, key) {
			this.formData.formList[index][key] = e.target.value;
		},
		handleSelectChange(v, index, key) {
			this.formData.formList[index][key] = v;
		},
		handleEdit(params) {
			this.formData.formList.forEach((it, i) => {
				if (params.index === i) {
					it.isEditing = 1;
				} else {
					it.isEditing = 0;
				}
			});
		},
		handleSave(params) {
			let list = [];
			this.$refs.form.validate(valid => {
				if (valid) {
					list = cloneDeep(this.formData.formList);
					// 处理数据
					list.forEach((it, index) => {
						list[index].depart_id = it.position_id[0];
						list[index].position_id = it.position_id[1];
					});

					this.$request({
						url: '_HR_RECRUIT_IDENTIFY_RESUME_EDIT_POST',
						type: 'POST',
						param: {
							...list[params.index],
							...this.basicForm,
							depart_id: list[params.index].depart_id || this.basicForm.position_id[0],
							position_id: list[params.index].position_id || this.basicForm.position_id[1],
							meeting_id: list[params.index].meeting_id || this.basicForm.meeting_id,
							meeting_year: list[params.index].meeting_year || this.basicForm.meeting_year,
							season_type: list[params.index].season_type || this.basicForm.season_type,
							add_type: 3
						},
						loading: false
					}).then((res) => {
						this.$Message.success('操作成功');
						this.formData.formList[params.index].isEditing = 0;
						this.loadData();
					}).catch((error) => {
						this.$Message.error(error.msg);
					});
				} else {
					this.$Message.warning('数据格式不正确');
				}
			});
		},
		handleWatchResume(e, params) {
			let type = '';
			let index;
			if (params.row.resume_url) {
				index = params.row.resume_url.lastIndexOf('.');
				type = params.row.resume_url.slice(index);
				type = this.fileType[type.toLowerCase()].type;

				if (type === 'image') {
					this.$emit('preview-start');
					ImgsPreview.popup({
						visible: true,
						dataSource: [params.row.resume_url],
						opts: {
							index: 0,
							history: false,
							// getThumbBoundsFn: (i) => pos
						}
					}).then(() => {
					}).catch(() => {
					}).finally(() => {
						this.$emit('preview-end');
					});
				} else {
					this.$emit('preview-start');
					FilePreview.popup({
						data: {
							fileUrl: params.row.resume_url,
							x: e.clientX,
							y: e.clientY
						}
					}).then((res) => {
					}).catch((err) => {
					}).finally(() => {
						this.$emit('preview-end');
					});
				}
			}
			// 砍掉了
			// this.$router.push(getHashUrl(`/hr/recruit/school/resume/img`, {
			// 	url: params.row.resume_url,
			// 	recruitType: 'school'
			// }));
		}
	}
};

