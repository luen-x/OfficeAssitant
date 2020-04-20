import { Divider } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DelTipModal } from '@components/hr/_common/delete-tip';

export default {
	data() {
		return {
			columns: [
				{
					title: "邮件主题",
					key: "title",
					minWidth: 220,
					fixed: "left",
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.title}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "发送时间",
					key: "create_time",
					minWidth: 160
				},
				{
					title: "发件人",
					key: "staff_name",
					minWidth: 140
				},
				{
					title: "发件邮箱",
					key: "account",
					minWidth: 200
				},
				{
					title: "发送成功数",
					key: "success_count",
					minWidth: 100
				},
				{
					title: "发送失败数",
					key: "failed_count",
					minWidth: 100
				},
				{
					title: "操作",
					key: "action",
					width: 120,
					align: 'center',
					render: (h, params) => {
						let type = this.$route.query.recruitType;
						return <div>
							{ ((type === 'school' && this.$auth[1269]) || (type === 'social' && this.$auth[1258])) && <span
								class="g-c-blue-mid g-pointer" onClick={() => this.handleWatch(params)}>
								查看
							</span> }
							{ ((type === 'school' && !this.$auth[1269]) || (type === 'social' && !this.$auth[1258])) && <span>
								查看
							</span> }
							{ ((type === 'school' && this.$auth[1269] && this.$auth[1270])
								|| (type === 'social' && this.$auth[1258] && this.$auth[1259])) && <span
								style={{ paddingLeft: '3px', paddingRight: '3px' }}>
								<Divider
									type="vertical"
								/>
							</span> }
							{ ((type === 'school' && (!this.$auth[1269]
								|| !this.$auth[1270])) || (type === 'social' && (!this.$auth[1258] || !this.$auth[1259]))) && <span
								class="iconfont icon-vertical-line g-fs-10 g-m-l-5 g-m-r-5 g-c-black1">
							</span> }
							{ ((type === 'school' && this.$auth[1270]) || (type === 'social' && this.$auth[1259])) && <span
								class="g-c-blue-mid g-pointer"
								onClick={() => this.handleDelete(params)}>
								删除
							</span> }
							{ ((type === 'school' && !this.$auth[1270]) || (type === 'social' && !this.$auth[1259])) && <span>
								删除
							</span> }
						</div>;
					}
				}
			]
		};
	},
	methods: {
		handleWatch(params) {
			if (this.$route.query.recruitType === 'school') {
				this.$router.push(getHashUrl('/hr/recruit/school/summary/elook', {
					email_id: params.row.email_id,
					recruitType: 'school'
				}));
			} else {
				this.$router.push(getHashUrl('/hr/recruit/social/summary/elook', {
					email_id: params.row.email_id,
					recruitType: 'social'
				}));
			}
		},
		handleDelete(params) {
			DelTipModal.popup({
				title: '删除',
				content: '确认删除该邮件？'
			}).then(res => {
				this.$request({
					url: '_HR_RECRUIT_DEL_EMAIL_GET',
					type: 'GET',
					param: {
						email_id: params.row.email_id
					},
				}).then((ress) => {
					this.$Message.success('操作成功');
					this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_LIST_RESET');
				}).catch((error) => {
					console.error(error);
				});
			});
		}
	}
};

