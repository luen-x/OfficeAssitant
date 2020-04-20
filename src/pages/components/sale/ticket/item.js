import API from "@stores/apis/root";
import { oneLinePipe } from '@utils/utils';
import { Tooltip } from 'iview';
import { ModalReceive } from "./popup/receive";
import { Confirm } from "./popup/confirm";

export default {
	data() {
		return {
			columns: [
				{
					title: "发票抬头",
					key: "invoice_title",
					fixed: 'left',
					width: 250,
					render: (h, params) => {
						return (
							<div
								class="g-operation"
								// onClick={() => this.handleEdit(params.row.invoice_id)}
							>
								{params.row.invoice_title.length <= 15 && params.row.invoice_title}
								{params.row.invoice_title.length > 15 && (
									<Tooltip
										transfer
										content={params.row.invoice_title}
										max-width={250}
									>
										{params.row.invoice_title.substr(0, 15) + '...'}
									</Tooltip>
								)
								}
							</div>
						);
					}
				},
				{
					title: "客户名称",
					key: "customer_name",
					minWidth: 200,
					tooltip: true
				},
				{
					title: "客户电话",
					key: "customer_phone",
					minWidth: 150,

				},
				{
					title: "发票类型",
					key: "invoice_name",
					minWidth: 150,
				},
				{
					title: "部门",
					key: "department",
					minWidth: 100,
				},
				{
					title: "申请人",
					key: "staff_name",
					minWidth: 100,
				},
				{
					title: "申请时间",
					key: "create_date",
					minWidth: 180,
				},
				{
					title: "状态",
					key: "status_name",
					minWidth: 150,
				}
			],
			columns1: [
				{
					title: "发票抬头",
					key: "invoice_title",
					fixed: 'left',
					width: 250,
					render: (h, params) => {
						return (
							<div
								class="g-operation"
								// onClick={() => this.handleEdit(params.row.invoice_id)}
							>
								{params.row.invoice_title.length <= 15 && params.row.invoice_title}
								{params.row.invoice_title.length > 15 && (
									<Tooltip
										transfer
										content={params.row.invoice_title}
										max-width={250}
									>
										{params.row.invoice_title.substr(0, 15) + '...'}
									</Tooltip>
								)
								}
							</div>
						);
					}
				},
				{
					title: "客户名称",
					key: "customer_name",
					minWidth: 200,
					tooltip: true
				},
				{
					title: "客户电话",
					key: "customer_phone",
					minWidth: 150,

				},
				{
					title: "发票类型",
					key: "invoice_name",
					minWidth: 150,
				},
				{
					title: "部门",
					key: "department",
					minWidth: 100,
				},
				{
					title: "申请人",
					key: "staff_name",
					minWidth: 100,
				},
				{
					title: "申请时间",
					key: "create_date",
					minWidth: 180,
				},
				{
					title: "状态",
					key: "status_name",
					minWidth: 150,
				},
				{
					minWidth: 120,
					fixed: 'right',
					title: "操作",
					key: "invoice_title",
					render: (h, params) => {
						return (
							<div class="g-operation" style="min-width:200px" onClick={
								(e) => {
									e.stopPropagation();
								}
							} >
								<span onClick={(e) => {
									e.stopPropagation();
									this.handleAgainEdit(params.row.invoice_id, params.row.is_again, params.row.is_personal);
								}}>
									{this.apply && (
										<span style={{ color: params.row.is_again == 0 ? "#2296f9" : "#ACA899" }}>重新申请</span>
									)}
									{this.type == 1 && (
										<span>重新编辑</span>
									)}
								</span>
								{
									this.auth
								&& <span class="_delete " onClick={(e) => {
									e.stopPropagation();
									this.handleDelet(params.row.invoice_id, params.row.is_again);
								}}>
									删除
								</span>
								}
							</div>
						);
					}
				}
			],
		};
	},
	computed: {
		auth() {
			if (this.type == 4 && this.$auth[728]) {
				return true;
			} else {
				return false;
			}
		},
		apply() {
			if (this.type == 4 && this.$auth[716]) {
				return true;
			} else {
				return false;
			}
		}
	},
	created() {},
	methods: {
		GetDetail(v) {
			this.$request({
				url: API._SALE_TICKET_INVOICE_DETAIL_GET,
				type: "post",
				param: {
					invoice_id: v
				}
			});
		},
		handleResetFirst() {
			this.$store.commit("SALE_TICKET_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_TICKET_LIST_RESET", { type: this.type });
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		handleEdit(row) {
			ModalReceive.popup({
				router: this.$router,
				data: {
					invoice_id: row.invoice_id,
				}
			}).then(res => {
				let i = this.type - 1;
				this.$refs.tableTarget[i].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				let i = this.type - 1;
				this.$refs.tableTarget[i].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleAgainEdit(invoice_id, is_again, is_personal) {
			if (is_again == 1) {
				this.$Message.warning("不能重复重新申请！");
			} else {
				this.$router.push({ name: "sale-ticket-apply", query: { invoice_id, parent_invoice_id: invoice_id, type: this.type, is_personal } });
			}
		},
		handlecolumns(i) {
			if (i == 1 || i == 4) {
				return this.columns1;
			} else {
				return this.columns;
			}
		},
		handleDelet(invoice_id) {
			Confirm.popup({}).then(() => {
				this.$request({
					url: API._SALE_TICKET_DEL_INVOICE_GET,
					type: "post",
					param: {
						invoice_id
					}
				}).then(() => {
					this.handleResetCur();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			});
		}
	},
};
