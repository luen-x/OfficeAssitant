import {
	Input,
	InputNumber,
	Select,
	Option 
} from 'iview';
import MySelect from './my-select.vue';

export default {
	data() {
		return {
			columns: this.getColums(1)
		};
	},
	watch: {
		status() {
			this.getColums(this.status);
		}
	},
	methods: {
		getColums(type) {
			let columns = [
				{
					title: '晋升条件',
					minWidth: 150,
					render: (h, params) => {
						return h('div', {}, params.row.condition);
					}
				},
				{
					title: '我的数据',
					minWidth: 150,
					render: (h, params) => {
						return h('div', {}, params.row.my_condition);
					}
				}	
			];
			switch (type) {
				case 1: 
					columns.push(
						{
							title: '晋升分数',
							width: 150,
							render: (h, params) => {
								return h('div', {}, params.row.pro_score);
							}
						},
						{
							title: '评定结果',
							width: 150,
							render: (h, params) => {
								return h('div', {}, params.row.status_name);
							}
						}
					);
					break;
				case 2: 
					columns.push(
						{
							title: '晋升分数',
							width: 150,
							render: (h, { row, index }) => {
								if (row.is_rigid == 0) {
									return (<InputNumber 
										value={this.regularRule[index].pro_score} 
										max={999} 
										min={0}
										precision={0}
										style={{ width: '100px' }}
										onOn-change={(e) => this.handleChange(e, index, row, "pro_score")}
									/>);
								} else {
									return h('div', {}, row.pro_score);
								}
								
							}
						},
						{
							title: '评选结果',
							width: 150,
							render: (h, { row, index }) => {
								if (row.is_rigid == 1) {
									return (
										<MySelect 
											rowData={this.regularRule}
											index={index}
											paramsIndex={String(row.status)}
										/>
									);
								} else {
									return h('div', {}, row.status_name);
								}
							}
						}
					);
					break;
				default:
					columns;
					break;
			}
			this.columns = columns;
			return columns;
			
		},
		
		handleChange(e, index, row, val) {
			row[val] = e || 0;
			this.regularRule[index] = row;
		},
	}
};
