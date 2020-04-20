import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from "@components/_common/confirm/confirm";

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
							<div>
								<AutoToolTip 
									content={params.row.title}
									width="180px"
									theme="dark"
									placement="bottom" 
									labelClass=""
								/>
							</div>
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
					key: "status",
					minWidth: 100,
					render: (h, params) => {
						let look = "none";
						let del = "none";
						
						(this.$auth[333] && this.$route.query.flag == 1) || (this.$auth[1254] && this.$route.query.flag == 2) 
							? look = "inline-block" : "";
						(this.$auth[334] && this.$route.query.flag == 1) || (this.$auth[1255] && this.$route.query.flag == 2) 
							? del = "inline-block" : "";

						return (
							<div class="g-flex">
								<div 
									class="g-pointer g-m-r-5 g-fs-12" 
									style={{ color: "#2397F9", display: look }}
									onClick={() => {
										let url = this.$route.query.flag == 1 ? "/sc/customer/cooperate/look/mail" : "/sc/product/look/mail";

										this.$router.push({
											path: url,
											query: {
												email_id: params.row.email_id,
												flag: this.$route.query.flag
											}
										});
									}}
								>
									查看
								</div>
								<div style={{ color: "#2397F9", display: look }}>
									|
								</div>
								<div 
									class="g-pointer g-m-l-5 g-fs-12"
									style={{ color: "#2397F9", display: del }}
									onClick={() => {
										Confirm.popup({
											title: "温馨提示",
											msg: "确认删除该邮件？"
										}).then(() => {
											this.$request({
												url: '_SC_CUSTOMER_COOPERATE_OUTBOX_POST',
												type: 'POST',
												loading: false,
												param: {
													email_id: params.row.email_id
												}
											}).then(res => {
												this.$Message.success(res.msg);
												this.$store.commit('SC_CUSTOMER_COOPERATE_OUTBOX_LIST_RESET', { type: this.type });
											}).catch(error => {
												this.$Message.error(error.msg);
											});
										}).catch(error => {});
									}}
								>
									删除
								</div>
							</div>
						);
					}
				}
			],
		};
	},

	methods: {
		handleResetFirst() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_OUTBOX_LIST_INIT');
		},
		
		handleResetCur() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_OUTBOX_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		}
	}
};