import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import moment from 'moment';

export default {
	data() {
		return {
			columns: {
				'recruit': this.getColumns('recruit'),
				'organization': this.getColumns('organization')
			},
		};
	},
	methods: {
		handleLinkTo() {
			this.$router.push('/');
		},
		// 查看
		handleClick(sed) {
			this.$router.push(
				{
					path: '/academy/transfer/statistics/teacher',
					query: {
						course_id: sed.course_id,
						participator: JSON.stringify(sed.participator)
					}
				}
			);
		},
		getColumns(type) {
			let tryColumns = [
				{
					title: "招聘来源",
					key: "talent_resource_name",
					minWidth: 200
				},
				{
					title: "试岗人数",
					key: "try_count",
					minWidth: 120
				},
				{
					title: "试岗流失人数",
					key: "try_pass_count",
					minWidth: 120
				},
				{
					title: "入职流失人数",
					key: "leave_count",
					minWidth: 120
				},
				{
					title: "入职人数",
					key: "entry_and_leave_count",
					minWidth: 120
				},
				{
					title: "入职在职人数",
					key: "entry_count",
					minWidth: 120
				}
			];

			let teacterColumns = [
				{
					title: "课程名称",
					key: "project_topic",
					minWidth: 170,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.project_topic}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "授课讲师",
					key: "lecture_name",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.lecture_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "授课时间",
					key: "project_time",
					minWidth: 250,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.project_time}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "培训人数",
					key: "train_count",
					minWidth: 90
				},
				{
					title: "试岗流失人数",
					key: "try_pass_count",
					minWidth: 110
				},
				{
					title: "试岗pass人数",
					key: "try_by_pass_count",
					minWidth: 110
				},
				{
					title: "入职人数",
					key: "entry_and_leave_count",
					minWidth: 90
				},
				{
					title: "入职15天流失人数",
					key: "leave_by_fifteen_day_count",
					minWidth: 140
				},
				{
					title: "试岗入职率",
					key: "try_entry_percent",
					minWidth: 100
				},
				{
					title: "试岗流失率",
					key: "try_lose_percent",
					minWidth: 100
				},
				{
					title: "试岗pass率",
					key: "try_pass_lose_percent",
					minWidth: 100
				},
				{
					title: "入职15天流失率",
					key: "entry_fifteen_day_lose_percent",
					minWidth: 130
				},
				{
					title: "操作",
					key: 'action',
					width: 100,
					fixed: 'right',
					align: 'center',
					render: (h, params) => {
						return (
							this.$auth[1582]
								? <span onClick={() => this.handleClick(params.row)} class="g-pointer g-c-blue-mid">查看</span>
								: null
						);
					}
				}
			];

			let demandColumns = [
				{
					title: '　　组织名称',
					key: 'depart_name',
					minWidth: 200,
					render: (h, params) => {
						const { row: { __level__, __expand__, depart_name, children }, index } = params;

						// 点击展开事件
						const handleClick = (e) => {
							this.$refs.table.expand({ index });
						};

						return h('div', {
							style: {
								marginLeft: `${(__level__ - 1) * 20}px`,
								boxSizing: 'content-box'
							},
							class: children && "g-pointer",
							on: {
								click: handleClick
							}
						}, [
							h('i', {
								class: `iconfont g-c-black2 g-fs-12 g-m-r-10 ${children ? !__expand__ ? 'icon-triangle-right' : 'icon-triangle-down' : ''}`,  // eslint-disable-line
							}),
							h('span', {}, depart_name)
						]);
					}
				},
				{
					title: '负责人',
					key: 'leader_name',
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.leader_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '在职人数',
					key: 'inservice_num',
					minWidth: 100
				},
				{
					title: '急需人数',
					key: 'need_number',
					minWidth: 100,
				},
				{
					title: '本月分配',
					key: 'assign_count',
					minWidth: 100,
				},
				{
					title: '试岗流失',
					key: 'try_pass_count',
					minWidth: 100,
				},
				{
					title: '入职流失',
					key: 'leave_count',
					minWidth: 100,
				},
				{
					title: '待分配数',
					key: 'await_count',
					minWidth: 100
				},
				{
					title: '人员标准',
					key: 'staff_standard',
					minWidth: 240,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.staff_standard}
								labelClass=""
								theme="dark"
							/>
						);
					}
				}
			];

			switch (type) {
				case 'recruit':
					return tryColumns;
				case 'organization':
					tryColumns.splice(0, 1, {
						title: "组织部门",
						key: "depart_name",
						minWidth: 200
					});
					return tryColumns;
				case 'teacher':
					return teacterColumns;
				case 'demand':
					return demandColumns;
				default:
					break;
			}
		}
	}
};