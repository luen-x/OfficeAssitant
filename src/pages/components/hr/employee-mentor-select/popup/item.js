import {
	Input,
	Select,
	Option,
	Button,
	OptionGroup
} from 'iview';
import MySelect from './my-select.vue';

export default {
	
	data() {
		return {
			columns: [
				{
					title: '评选规则',
					minWidth: 700,
					render: (h, params) => {
						return h('div', {}, params.row.name);
					}
				},
				
				{
					title: '评选结果',
					width: 164,
					render: (h, params) => {
						return (
							<MySelect 
								handleSelect={this.handleSelect} 
								params={String(params.row.status)} 
								paramsIndex={params.index}
								type={this.type}
								operate={this.params.row.is_operate}
							/>
						);
					}
				}
			]
		};
	},
	methods: {
		handleSelect(params, index) {
			this.tableData[index].status = params;
		},
		handleResetFirst() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_RESET', {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};
