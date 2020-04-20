import { Confirm } from "@common/confirm/confirm";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					minWidth: 200,
					key: 'name',
					fixed: "left",
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '手机号码',
					minWidth: 120,
					fixed: "left",
					key: 'mobile'
				},
				{
					title: '身份证号',
					minWidth: 220,
					key: 'id_card'
				},
				{
					title: '邀约人',
					minWidth: 120,
					key: 'invite_staff_name'
				},
				{
					title: '籍贯',
					minWidth: 120,
					key: 'region'
				},
				{
					title: '期望薪资',
					minWidth: 120,
					key: 'salary'
				},
				{
					title: '学历',
					minWidth: 120,
					key: 'education'
				},
				{
					title: '应聘职位',
					minWidth: 220,
					key: 'position_name'
				},
				{
					title: '招聘渠道',
					minWidth: 120,
					key: 'ditch'
				},
				{
					title: '转介绍人',
					minWidth: 120,
					key: 'introducer_name'
				},
				{
					title: '操作',
					key: 'action',
					align: 'center',
					minWidth: 100,
					fixed: "right",
					render: (h, params) => {
						return (
							this.$auth[1533] 
								? <span onClick={() => this.handleRemove(params.row.list_id)} class="g-pointer g-c-blue-mid">移出</span>
								: ''
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SOCIAL_BLACKLIST_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SOCIAL_BLACKLIST_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleRemove(list_id) {
			Confirm.popup({
				title: "",
				msg: "确定移出黑名单？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_HR_RECRUIT_SOCIAL_BLACKLIST_REMOVE_GET',
					type: "GET",
					param: {
						list_id
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit('HR_RECRUIT_SOCIAL_BLACKLIST_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			}).catch(error => error && console.error(error.msg));
		},
	}
};

