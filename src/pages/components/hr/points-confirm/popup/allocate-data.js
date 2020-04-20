import { Radio } from 'iview';

export default {
	data() {
		return {
			currentId: '',
			currentName: '',
			memberListTitle: [
				{
					title: ' ',
					minWidth: 35,
					render: (h, params) => {
						let id = params.row.staff_id;
						let name = params.row.staff_name;
						let defaultS = false;
						if (this.currentId == id) {
							defaultS = true;
						} else {
							defaultS = false;
						}
						let self = this;
						return h(Radio, {
							style: {
								marginRight: '5px'
							},
							props: {
								value: defaultS
							},
							on: {
								input() {
									self.currentId = id;
									self.currentName = name;
								}
							}
						});
					}
				},
				{
					title: '员工姓名',
					key: 'staff_name',
					minWidth: 130,
				},
				{
					title: '员工电话',
					minWidth: 110,
					key: 'mobile',
				},
				{
					title: '职位',
					minWidth: 150,
					key: 'position_name',
				}
			],
			memberList: []
		};
	},
	methods: {
		
	}
};
