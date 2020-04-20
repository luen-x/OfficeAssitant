import { getHashUrl, oneLinePipe } from '@utils/utils';

export default {
	data() {
		return {
			columns: {
			},
		};
	},
	methods: {
		getColumns(type) {
			const columns = [
				{
					title: '姓名',
					minWidth: 200,
					fixed: 'left',
					render: (h, { row }) => {
						return (
							<div>
								{
									(row.can_click && this.$auth[1539]) ? <span 
										class="g-operation"
										onClick={() => this.handleDetail(row.applicant_id)}
									>{row.staff_name}</span> : <span>
										{row.staff_name}
									</span>
								}
							</div>
						);
					}
				},
				{
					title: '手机号码',
					minWidth: 120,
					fixed: 'left',
					key: 'mobile'
				},
				{
					title: '离职职位',
					minWidth: 120,
					key: 'position_name'
				},
				{
					title: '入职日期',
					minWidth: 120,
					key: 'entry_time'
				},
				{
					title: '离职日期',
					minWidth: 120,
					key: 'leave_time'
				},
				{
					title: '离职原因',
					minWidth: 120,
					key: 'leave_reason'
				},
				{
					title: '在职工龄',
					minWidth: 120,
					key: 'work_day'
				},
				{
					title: '学历',
					minWidth: 120,
					key: 'education_name'
				},
				{
					title: '籍贯',
					minWidth: 120,
					key: 'native'
				},
				{
					title: '邀约人',
					minWidth: 120,
					key: 'invite_name'
				},
				{
					title: '操作',
					minWidth: 120,
					fixed: 'right',
					render: (h, { row }) => {
						return <span 
							class="g-operation" 
							onClick={() => this.handleInter(row)}>邀约</span>;
					}
				}
			];
			(type === this.yxzx_id) && columns.splice(3, 0, {
				title: '晋级体系',
				minWidth: 120,
				key: 'system_name'
			}, {
				title: '销工次数',
				minWidth: 120,
				key: 'already_count'
			});
			return columns;
		},
		handleInter(row) {
			this.$auth[1541] && this.$router.push(getHashUrl('/hr/recruit/talent/invite/leave', {
				applicant_id: row.applicant_id,
				staff_id: row.staff_id
			}));
		},
		handleDetail(applicant_id) {
			let baseUrl = `/hr/recruit/talent/detail/leave/${applicant_id}`;
			this.$router.push(getHashUrl(baseUrl, {
				...this.$route.query,
				type: this.type,
				list_type: 'talents-index'
			}));
		},
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_TALENT_LEAVE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_TALENT_LEAVE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

