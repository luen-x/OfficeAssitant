import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Tooltip
} from 'iview';
import {
	Copy
} from "wya-vc";
import {
	getHashUrl
} from '@utils/utils';
import { M_HR_URL } from '@constants/constants';


export default {
	data() {
		const {
			query = {}
		} = this.$route;
		return {
			columns: {
				'3': [],
				'1': [],
				'2': [],
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-archives-person-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-archives-person-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},

		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [{
				title: '姓名',
				key: 'staff_name',
				minWidth: 160,
				fixed: 'left',
			},
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 220,
				fixed: 'left'

			},


			{
				title: '姓名',
				key: 'applicant_name',
				minWidth: 120,
				fixed: 'left',
			},
			{
				title: '手机号码',
				key: 'mobile',
				minWidth: 160,
				fixed: 'left',
			},
			{
				title: '邀约人',
				key: 'invite_staff_name',
				minWidth: 120,
				tooltip: true

			},
			{
				title: '应聘职位',
				key: 'try_position_name',
				minWidth: 120,

			},
			{
				title: '招聘途径',
				key: 'add_type_name',
				minWidth: 120,

			},
			{
				title: '试岗部门',
				key: 'try_depart_name',
				minWidth: 120,

			},
			{
				title: '试岗时间',
				key: 'try_time',
				minWidth: 220,
				// render: (h, { row }) => {
				// 	return <div>
				// 		{row.try_start_time} - {row.try_end_time}
				// 	</div>;
				// }
			},
			{
				title: '预计入职时间',
				key: 'predict_entry_time',
				minWidth: 120,

			},






			{
				title: '职位',
				key: 'position_name',
				minWidth: 220,

			}, {
				title: '工号',
				key: 'staff_number',
				minWidth: 120,

			}, {
				title: '性别',
				key: 'sex',
				minWidth: 120,

			}, {
				title: '出生年月',
				key: 'birthday',
				minWidth: 120,

			}, {
				title: '入职日期',
				key: 'create_time',
				minWidth: 120,

			},
			{
				title: '离职时间',
				key: 'leave_time',
				minWidth: 120,

			}, {
				title: '工龄',
				key: 'work_day',
				minWidth: 120,

			}, {
				title: '籍贯',
				key: 'province',
				minWidth: 120,

			},
			{
				title: '毕业学校',
				key: 'college',
				minWidth: 250,
				render: (h, params) => {
					const { college } = params.row;
					return (
						<div>
							{college.length > 15
								? <Tooltip
									transfer
									placement="top"
									max-width="200"
								>
									<div>{college.substr(0, 15) + '...'}</div>
									<div slot="content">
										{college}
									</div>
								</Tooltip>
								: college}
						</div>
					);
				}
			},
			{
				title: '专业',
				key: 'profession',
				minWidth: 250,
				render: (h, params) => {
					const { profession } = params.row;
					return (
						<div>
							{profession.length > 15
								? <Tooltip
									transfer
									placement="top"
									max-width="200"
								>
									<div>{profession.substr(0, 15) + '...'}</div>
									<div slot="content" style="margin:0 5px">
										{profession}
									</div>
								</Tooltip>
								: profession}
						</div>
					);
				}
			},
			{
				title: '学历',
				key: 'education_name',
				minWidth: 120,
			}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			this.$auth['1127'] && columnsShow.push({
				title: '操作',
				key: 'status',
				fixed: 'right',
				align: "center",
				width: 100,
				render: (h, { row }) => {
					return (
						row.type && row.type == 1 ? <div style={{ color: "rgb(172, 168, 153)", cursor: 'no-drop' }}>查看</div> : < div
							class= "g-operation"
							onClick={() => this.handleCheck(row.add_type, row.staff_id, row.status, row.applicant_id)
							}
						> 查看</div >

					);
				}
			});
			return columnsShow;
		},
		handleCheck(addType, staffId, status, applicant_id) {
			 let scenario = this.$route.query.type || 3;
			this.$router.push(
				/* eslint-disable */
				`/hr/archives/person/details?type=1&cate=1&personType=1&add_type=${addType}&staff_id=${staffId}&dimission=${status}&applicant_id=${applicant_id}&scenario=${scenario}`
				/* eslint-enable */
			);
		}

	}
};
