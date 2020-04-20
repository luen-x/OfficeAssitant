import { Tooltip } from 'iview';
import { getParseUrl, getHashUrl, setItem, getItem } from '@utils/utils';

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					fixed: 'left',
					minWidth: 50,
					align: 'center'
				},
				{
					title: '课程名称',
					key: 'course_name',
					fixed: 'left',
					minWidth: 200,
					render: (h, params) => {
						let course_name = params.row.course_name;
						return h('span', {
							on: {
								click: () => {
									this.$router.push(getHashUrl(
										'/hr/academy/train/detail/basic/1/detail', 
										{ 
											...this.$route.query,
											course_id: params.row.course_id,
											number: this.tableList.length
										}
									));
								}
							}
						}, [
							course_name.length < 10 ? h('span', {
								class: "g-operation g-oneline g-col",
								style: {
									marginRight: '5px',
									color: '#2e9dfa',
									cursor: 'pointer'
								},
							}, course_name) : h(Tooltip, {
								props: {
									content: course_name,
									transfer: true,
									maxWidth: 250
								},
								style: {
									marginRight: '5px',
									color: '#2e9dfa',
									cursor: 'pointer'
								},
							}, course_name.slice(0, 10) + '...')
						]);
					}
				},
				{
					title: '授课讲师',
					key: 'start_time',
					minWidth: 150,
					render: (h, params) => {
						let lecture = params.row.lecture.map(v => v.staff_name).join(',');
						return lecture.length < 12 
							? h('span', {
							}, lecture)
							: h(Tooltip, {
								props: {
									content: lecture,
									transfer: true,
									maxWidth: 250
								}
							}, lecture.slice(0, 12) + '...');
					}
				},
				{
					title: '授课时间',
					key: 'start_time',
					minWidth: 150,
					render: (h, params) => {
						let time = params.row.start_time + '至' + params.row.end_time;
						return time.length < 16 
							? h('span', {
							}, time)
							: h(Tooltip, {
								props: {
									content: time,
									transfer: true,
									maxWidth: 250
								}
							}, time.slice(0, 16) + '...');
					}
				},
				{
					title: '授课地点',
					key: 'position',
					minWidth: 100
				},
				{
					title: '授课部门',
					key: 'teach_depart_name',
					minWidth: 150
				},
				{
					title: '参与人员',
					key: 'participator_count',
					minWidth: 100
				},
				{
					title: '授课方式',
					key: 'method_name',
					minWidth: 100
				},
				{
					title: '课程类型',
					key: 'course_type_name',
					minWidth: 100
				},
				{
					title: '操作',
					key: 'title',
					fixed: 'right',
					minWidth: 70,
					render: (h, params) => {
						return h('span', {
							style: {
								marginRight: '5px',
								color: '#2e9dfa',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									this.$router.push(getHashUrl(
										'/hr/academy/train/detail/basic/2/edit', 
										{ 
											...this.$route.query,
											course_id: params.row.course_id,
											number: this.tableList.length
										}
									));
								}
							}
						}, '编辑');
					}
				}
			],
			tableList: [],
			methodList: [
				{
					id: 1,
					label: '线下面授'
				}, {
					id: 2,
					label: '岛屿PK'
				}, {
					id: 3,
					label: '座谈会'
				}, {
					id: 4,
					label: '茶话会'
				}, {
					id: 5,
					label: '线下视频'
				}, {
					id: 6,
					label: '线上视频'
				}, {
					id: 7,
					label: '其他'
				}
			]
		};
	},
	methods: {

	}
};

