import {
	Input,
	Select,
	Option 
} from 'iview';

export default {
	data() {
		let self = this;
		return {
			columns: [
				{
					title: '公司名称',
					width: 320,
					fixed: 'left',
					render: (h, params) => {
						return h('div', {}, params.row.company_name);
					}
				},
				{
					title: '公司地址',
					minWidth: 80,
					render: (h, { row, index }) => {
						return (<Input 
							value={this.formDate.conf_arr[index].company_address} 
							maxlength={50}
							style="width: 300px;marginLeft: 30px"
							placeholder="请输入公司地址"
							onOn-change={(e) => this.handleChange(e, index, row, "company_address")}
						/>);
					}
				},
				{
					title: '公司邮编',
					minWidth: 150,
					render: (h, { row, index }) => {
						return (<Input 
							value={this.formDate.conf_arr[index].postcode} 
							maxlength={6}
							placeholder="请输入公司邮编"
							style="width: 300px;marginLeft: 30px"
							onOn-change={(e) => this.handleChange(e, index, row, "postcode")}
						/>);
					}
				}	
			]
		};
	},
	methods: {
		handleChange(e, index, row, val) {
			row[val] = e.target.value;
			this.formDate.conf_arr[index] = row;
		}
	}
};
