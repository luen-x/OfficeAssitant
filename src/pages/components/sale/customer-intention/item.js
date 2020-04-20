import { Tooltip, Input } from 'iview';
import callService from '@components/sale/call-manage/call/service';
import { oneLinePipe, getParseUrl } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { OSS_PROP_ICON2 } from '@constants/constants';
import { CustomerDetail } from "../_common/customer/popup/index";
import { getAuth } from "../_common/util";

export default {
	data() {
		const columns = [
			{
				title: "公司名称",
				key: "company_name",
				fixed: "left",
				width: 230,
				render: (h, params) => {
					const name = params.row.company_name;
					const iconClass = params.row.sort ? 'icon-zhiding3 ' : 'icon-zhiding2 g-c-black4';
					return (
						<div
							class="g-dp-ib g-operation"
							style="width:100%;"
						>
							{name.length <= 14 && name}
							{name.length > 14 && (
								<Tooltip
									transfer
									content={name}
									maxWidth={180}
								>
									{oneLinePipe(name, 15)}
								</Tooltip>
							)
							}
							{params.row.is_own == 1 && this.$auth[830] && (
								<i
									class={"icon iconfont g-fs-14 g-m-r-5 g-pointer g-fr " + iconClass}
									onClick={() => this.handleTop(params.row)}
								/>
							)}
						</div>
					);
				}
			},
			{
				title: "客户姓名",
				key: "customer_name",
				minWidth: 80,
				// className: "g-pd-l-10",
				render: (h, params) => {
					return (
						<AutoToolTip
							content={params.row.customer_name}
							theme="dark"
							placement="bottom"
							labelClass="g-pointer"
						/>
					);
				}
			},
			{
				title: "联系电话",
				key: "tel",
				minWidth: 140,
				renderHeader: (h, { row }) => {
					return (
						<span>
							联系电话
							{this.coinConfig.tip_3_1 
							&& <Tooltip
								transfer
								content={this.coinConfig.tip_3_1}
								placement="top"
								maxWidth={180}
							>
								<img src={OSS_PROP_ICON2} style="height:18px;width:18px;position: relative;" class="g-m-l-10 g-pointer"/>
							</Tooltip>
							}
						</span>
					);

				},
				render: (h, { row }) => {
					if (!_global.staff.seat_number) {
						return (
							<span>{row.tel}</span>
						);
					} else {
						return (
							<span
								class="_value g-operation"
								onClick={
									() => {
										window.event.stopPropagation();
										callService.prepareToCallOut(row.tel);
									}
								}
							>
								{row.tel}
								<i class="icon iconfont icon-call2 g-m-l-5" />
							</span>
						);
					}
				}
			},
			// {
			// 	title: "剩余指派次数",
			// 	key: "todo",
			// 	minWidth: 80,
			// },
			{
				title: "接通状态",
				key: "connect_status",
				minWidth: 80
			},
			{
				title: "客户意向",
				key: "customer_intention",
				minWidth: 80
			},
			{
				title: "地址",
				key: "region",
				minWidth: 150,
				render: (h, params) => {
					return (
						<AutoToolTip
							content={params.row.region}
							theme="dark"
							placement="bottom"
							labelClass="g-pointer"
						/>
					);
				}
			},

			{
				title: "上次跟进时间",
				key: "visit_time",
				minWidth: 140
			},
			{
				title: "剩余保护时间",
				key: "surplus_days",
				minWidth: 120,
				renderHeader: (h, params) => {
					return (
						<span>
							剩余保护时间
							<span class="ivu-table-sort">
								<i
									class={"ivu-icon ivu-icon-md-arrow-dropup " + (this.sort == 1 ? 'g-c-blue-mid' : '')}
									onClick={this.handleaAsc.bind(this)}
								/>
								<i
									class={"ivu-icon ivu-icon-md-arrow-dropdown " + (this.sort == 3 ? 'g-c-blue-mid' : '')}
									onClick={this.handleDesc.bind(this)}
								/>
							</span>
						</span>
					);
				},
			},
			{
				title: "保护时间",
				key: "protect_time",
				minWidth: 170,
			},
			{
				title: "客户等级",
				key: "level_str",
				minWidth: 70
			},
			{
				title: "负责人",
				key: "staff_name",
				minWidth: 170,
			},
			{
				title: "领取时间",
				key: "get_time",
				minWidth: 170,
			},
			{
				title: "行业",
				key: "industry_name",
				minWidth: 110,
			},
			{
				title: "转手次数",
				key: "change_times",
				minWidth: 80,
			},
			{
				title: "人员规模",
				key: "scale",
				minWidth: 80,
				// render: (h, { row }) => {
				// 	return (
				// 		row.company_type == 1 ? <span>{row.scale}</span> : <span/>
				// 	);
				// }
			},
			{
				title: "创建人",
				key: "init_staff_name",
				minWidth: 150,
			},
			{
				title: "创建时间",
				key: "create_time",
				minWidth: 170,
			},
			{
				title: "注册资金",
				key: "capital",
				minWidth: 100,
				render: (h, { row }) => {
					return (
						<span>{parseFloat(row.capital) > 0 ? row.capital : '-'}</span>
					);
				}
			}
		];
		if (this.$auth[402] || this.$auth[1678]) {
			columns.splice(0, 0, {
				type: "selection",
				width: 50,
				fixed: "left",
				className: "g-pd-l-10"
			});
		}
		return {
			columns,
			sort: parseInt(this.$route.query.sort || '2', 10),
			// arr: [
			// 	{ id: 1, value: 'wqw' }
			// ]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		handleaAsc() {
			if (this.sort == 1) {
				this.sort = 2;
			} else {
				this.sort = 1;
			}
			this.handleSearch({ ...this.$route.query, sort: this.sort });
		},
		handleDesc() {
			if (this.sort == 3) {
				this.sort = 2;
			} else {
				this.sort = 3;
			}
			this.handleSearch({ ...this.$route.query, sort: this.sort });
		},
		handleOpenDrawer(row) {
			if (!getAuth(row.is_own == 1, 378, 379)) return;
			const page = (getParseUrl().query || {}).page || 1;
			const infoArr = this.listInfo.data[page];
			if (infoArr) {
				this.openIndex = infoArr.findIndex(item => {
					return item.customer_id == row.customer_id;
				});
			}
			CustomerDetail.popup({
				router: this.$router,
				data: {
					own_id: row.own_id,
					staff_id: row.staff_id, // 负责人
					staff_name: row.staff_name,
					customer_id: row.customer_id,
					deal_status: row.deal_status || 2, // 合同公司成交状态 1已成交 2 未成交，
					contract_company_id: row.contract_company_id,
					customer_name: row.customer_name,
					is_own: row.is_own == '1',
				},
				showCall: true,
				showContacts: true,
				readOnly: false,
				store: this.$store
			}).then(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				this.openIndex = -1;
			}).catch(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				this.openIndex = -1;
			});
		},
		async handleTop(row) {
			window.event.stopPropagation();
			if (row.is_own == 2) {
				this.$Message.error('只能置顶自己的客户');
				return;
			}
			if (row.sort) {
				const result = await Confirm.popup({ title: '提示', msg: '确定取消置顶吗？' }).then(() => 1).catch(() => 0);
				if (!result) return;
			}
			this.$request({
				url: "_SALE_INTENTION_SET_TOP",
				type: "POST",
				param: {
					own_id: row.own_id
				},
				loading: true,
			}).then(res => {
				this.$Message.success(res.msg);
				this.handleResetCur();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};
