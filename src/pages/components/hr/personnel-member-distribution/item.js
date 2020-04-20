
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Appoint } from "./popup/Appoint";


export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					minWidth: 50
				},
				{
					title: '姓名',
					key: 'applicant_name',
					minWidth: 100
				},
				{
					title: '性别',
					key: 'sex_name',
					minWidth: 100
				},
				{
					title: '应聘职位',
					key: 'position_name',
					minWidth: 100
				},
				{
					title: '毕业学校',
					key: 'college',
					minWidth: 100,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.college}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '专业',
					key: 'profession',
					minWidth: 100
				},
				{
					title: '学历',
					key: 'education_name',
					minWidth: 100
				},
				{
					title: '操作',
					key: 'status',
					minWidth: 100,
					render: (h, { row }) => {
						// return h('div', {
						// 	style: {
						// 		marginRight: '5px'
						// 	},
						// 	class: ['g-operation'],
						// 	on: {
						// 		click: () => { this.handleChangeAppoint(row, true); }
						// 	}
						// }, '指派');
						return (
							this.$auth[1747] && <div style="margin-right: 5px">{
								this.awaitCount > 0
									? <div class="g-operation" onClick={() => { this.handleChangeAppoint(row, true); }}>指派</div>
									: <div class="g-operation-disable">指派</div>
							}
							</div>
						);
					}
				}
			],
			// 选择表头
			columns1: [
				{
					title: '姓名',
					key: 'applicant_name',
					minWidth: 100,
					fixed: 'left',
					render: (h, { row }) => {
						return h('div', {
							class: ['g-operation'],
							on: {
								click: () => { this.handleApplicantDetail(row); }
							}
						}, row.applicant_name);
					}

				},
				{
					title: '手机号',
					key: 'mobile',
					minWidth: 150,
					fixed: 'left',
				},
				{
					title: '试岗部门',
					key: 'try_depart_name',
					minWidth: 120
				},
				{
					title: '试岗分配时间',
					key: 'create_time',
					minWidth: 140
				},
				{
					title: '指派类型',
					key: 'scenario_name',
					minWidth: 120
				},
				{
					title: '性别',
					key: 'sex_name',
					minWidth: 120
				},
				{
					title: '应聘职位',
					key: 'position_name',
					minWidth: 120
				},
				{
					title: '毕业学校',
					key: 'college',
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.college}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '专业',
					key: 'profession',
					minWidth: 120,
					tooltip: true,
				},
				{
					title: '学历',
					key: 'education_name',
					minWidth: 120
				},
				{
					title: '邮箱',
					key: 'email',
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.email}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '微信号',
					key: 'wechat',
					minWidth: 120
				},
				{
					title: '到杭车次',
					key: 'ticket_info',
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.ticket_info}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '到杭时间',
					key: 'ticket_arrive_time',
					sortable: 'custom',
					minWidth: 170,
				}
			]
		};
	},

	methods: {
		handleResetFirst() {
			this.$store.commit('HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_INIT');
		},
		handleApplicantDetail(row) {
			this.$router.push({
				path: '/hr/personnel/member/detail',
				query: {
					applicant_id: row.applicant_id

				}
			});
		},
		handleChangeAppoint(row, zone) {
			Appoint.popup({
				data: {
				},
				try_depart_id: this.$route.query.type == 3 ? row.try_depart_id : '',
				assign_type: row.assign_type,
				type: this.$route.query.type || 1,
				applicant_id: row.applicant_id + '',
				scenario: 2,
				zone,
				title: this.$route.query.type == 3 ? '重新指派' : '指派'
			}).then(res => {
				this.handleResetCur();
			}).catch(err => { err && console.error(err); });
		},
		handleResetCur() {
			this.$store.commit('HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

