
export default {
	methods: {
		getFormData() {
			const target = {
				...this.formData,
				subject_id: this.formData.subject_id[this.formData.subject_id.length - 1] || '',
				option: this.formData.options.map((op, index) => {					
					if (this.formData.type == 1 || this.formData.type == 3) {
						return { option_name: op.label, is_answer: (this.formData.value == op.value) ? 1 : 0, sort: index + 1 };
	
					} else if (this.formData.type == 2) {
						return { option_name: op.label, is_answer: this.formData.value.includes(op.value) ? 1 : 0, sort: index + 1 };

					} else if (this.formData.type == 4) {
						return { answer_content: op.label, sort: index + 1 };

					} else if (this.formData.type == 5) {
						return { answer_content: op.value }; 
					} else {
						return console.error('unkonw question type ' + this.formData.type);
					}
				})
			};
			if (this.formData.type == 5) {
				target.option = [{ answer_content: this.formData.value }];
			}
			if (this.formData.type == 4) {
				target.score = target.option.length * target.single_score;
			}
			delete target.options;
			delete target.value;
			delete target.single_score;
			delete target.subject_id_end;
			return target;

		},
		formatFormData() {
			if (this.data.action == 'add' && this.data.type) {
				const origin = {
					1: {
						option: [{ label: '', value: 0 }, { label: '', value: 1 }, { label: '', value: 2 }, { label: '', value: 3 }],
						value: -1
					},
					2: {
						option: [{ label: '', value: 0 }, { label: '', value: 1 }, { label: '', value: 2 }, { label: '', value: 3 }],
						value: []
					},
					3: {
						option: [{ label: '正确', value: 0 }, { label: '错误', value: 1 }],
						value: ''
					},
					4: {
						option: [],
						value: ''
					},
					5: {
						option: [],
						value: ''
					}
				};
				return {
					question_id: '',
					type: this.data.type, // 1 单选  2 多选  3 判断  4 填空  5 简答
					subject_id: [], // 关联课题
					title: '',
					score: null,
					single_score: null,
					options: origin[this.data.type].option,
					value: origin[this.data.type].value,
					success_tips: '',
					error_tips: '',
					explain: '',
					keyword: '',
					maker_staff_id: _global.staff.staff_id,
					maker_staff_name: _global.staff.staff_name,
				};
			} 
			const dataCopy = JSON.parse(JSON.stringify(this.data));
			dataCopy.subject_id_end = dataCopy.subject_id;
			dataCopy.subject_id = [];
			if (dataCopy.type != 5) dataCopy.option.sort((op1, op2) => op1.sort - op2.sort);
			if (dataCopy.type <= 3) {
				dataCopy.options = dataCopy.option.map((op, index) => ({ label: op.option_name, value: index, option_id: op.option_id }));
				if (dataCopy.type == 2) {
					dataCopy.value = dataCopy.option
						.map((op, index) => ({ value: index, is_answer: op.is_answer }))
						.filter(op => op.is_answer).map(op => op.value);
				} else {
					dataCopy.value = dataCopy.option.findIndex(op => op.is_answer);
				}
			} else {
				dataCopy.options = dataCopy.option.map((op, index) => ({ label: op.answer_content, value: index, option_id: op.option_id }));
				if (dataCopy.type == 5) {
					dataCopy.value = dataCopy.option[0] && dataCopy.option[0].answer_content;
				} else {
					dataCopy.single_score = dataCopy.score / dataCopy.options.length;
					dataCopy.value = dataCopy.option.map(it => it.answer_content);
				}
			}
			delete dataCopy.option;
			return dataCopy;
			
		},
	},
};