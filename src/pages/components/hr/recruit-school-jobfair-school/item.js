import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { objRegex, oneLinePipe, getHashUrl, getItem } from '@utils/utils';
import { SchoolModal } from './popup/school-modal';

export default {
	data() {
		return {
			columns: [
				{
					title: '招聘会学校',
					minWidth: 220,
					fixed: 'left',
					key: 'school_name',
					render: (h, { row }) => {
						return (
							<span onClick={() => this.handleEdit(row)}>
								<AutoTooltip content={row.school_name} theme="dark" placement="bottom" />
							</span>
						);
					}
				},
				{
					title: '合作次数',
					minWidth: 90,
					key: 'meeting_count',
					render: (h, { row }) => {
						return (

							row.meeting_count && this.$auth[1728] ? <span 
								class="g-operation"
								onClick={() => this.handleDetail(row)}
							>
								{row.meeting_count}
							</span> : <span>{row.meeting_count}</span>
						);
					}
				},
				{
					title: '联系老师',
					minWidth: 120,
					key: 'contact_teacher',
				},
				{
					title: '联系电话',
					minWidth: 120,
					key: 'contact_tel',
					render: (h, { row }) => {
						return (
							<AutoTooltip content={row.contact_tel} theme="dark" placement="bottom" labelClass=" " />
						);
					}
				}, {
					title: '学校性质',
					minWidth: 120,
					key: 'school_type_name',
				}, {
					title: '学校官网',
					minWidth: 120,
					key: 'school_url',
					render: (h, { row }) => {
						return (
							<span onClick={() => this.handleUrl(row.school_url)}>
								<AutoTooltip content={row.school_url} theme="dark" placement="bottom" />
							</span>
						);
					}
				}, {
					title: '官网账号',
					minWidth: 120,
					key: 'school_amount_number',
					render: (h, { row }) => {
						return (
							<AutoTooltip content={row.school_amount_number} theme="dark" placement="bottom" labelClass=" " />
						);
					}
				}, {
					title: '官网密码',
					minWidth: 120,
					key: 'school_password',
					render: (h, { row }) => {
						return (
							<AutoTooltip content={row.school_password} theme="dark" placement="bottom" labelClass=" " />
						);
					}
				}, {
					title: '学校地址',
					minWidth: 120,
					key: 'detail_address',
					render: (h, { row }) => {
						let address = row.detail_address == '--' ? '' : row.detail_address;
						let detail = row.province_name + row.city_name + address;
						return (
							<AutoTooltip content={detail} theme="dark" placement="bottom" labelClass=" " />
						);
					}
				}
			],
		};
	},
	methods: {
		handleEdit(row) {
			SchoolModal.popup({
				data: row,
				edit: 1
			}).then(res => {
				this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_LIST_INIT');
			}).catch(err => err && console.error(err));
		},
		handleUrl(url) {
			let college_url = objRegex.validURLScheme.regex.test(url) ? url : `http://${url}`;
			window.open(college_url);
		},
		handleDetail(row) {
			this.$router.push(`/hr/recruit/school/jobfair/info?id=${row.meeting_id}`);
		},
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

