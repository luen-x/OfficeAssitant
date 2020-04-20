import { calendarFormat } from "moment";

export default {
	data() {
		return {
			columnsOne: [{
				title: '排名',
				key: 'sort',
				minWidth: 60,
			},
			{
				title: '战区',
				key: 'depart_name',
				minWidth: 100,
			},
			{
				title: 'PK业绩（元）',
				key: 'pk_performance',
				minWidth: 140,
				render: (h, params) => {
					return h('div', {
						style: {
							marginRight: '5px',
							color: params.row.sort <= 3 ? 'red' : ''
						},
						
					}, params.row.pk_performance);
				}
			}
			],
			columnsTwo: [{
				title: '排名',
				key: 'sort',
				minWidth: 60,
			},
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 100,
			},
			{
				title: 'PK业绩（元）',
				key: '',
				minWidth: 140,
				render: (h, params) => {
					return h('div', {
						style: {
							marginRight: '5px',
							color: params.row.sort <= 3 ? 'red' : ''
						},
						
					}, params.row.pk_performance);
				}
			}
			],
			columnsThree: [{
				title: '排名',
				key: 'sort',
				minWidth: 60,
			},
			{
				title: '姓名',
				key: 'staff_name',
				minWidth: 100,
			},

			{
				title: 'PK业绩（元）',
				minWidth: 140,
				render: (h, params) => {
					return h('div', {
						style: {
							marginRight: '5px',
							color: params.row.sort <= 3 ? 'red' : ''
						},
						
					}, params.row.pk_performance);
				}
			}
			],
		};
	},
	methods: {

	}
};
