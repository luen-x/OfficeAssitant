import { Dropdown, DropdownMenu, DropdownItem, Tag, Poptip, Tooltip } from "iview";
import { getHashUrl } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import { UpdateCustonmer } from '../_common/customer/update-customer';
import { PayLeft } from "../_common/customer/pay-left";
import { ApplyLeftRefund } from "../_common/customer/apply-left-refund";
import { AddTag } from "../_common/customer/add-tag";
import { Distribute } from "../_common/customer/distribute";
import { ChooseStaff } from "../_common/customer/choose-staff";
import { RelateApply } from "../customer-deal-relation/popup/relate-apply";
import { getAuth } from '../_common/util';
import Explain from '../../_common/explain/explain';


export default {
	data() {
		const columns = [
			{
				title: "公司名称",
				key: "contract_company_name",
				fixed: "left",
				width: 250,
				render: (h, params) => {
					const name = params.row.contract_company_name;
					const maxlength = params.row.label.length > 0 ? 13 : 15;
					return (
						<div>
							<span
								class="g-operation"
							>
								{name.length <= maxlength && name}
								{name.length > maxlength && (
									<Tooltip
										transfer
										content={name}
										maxWidth={250}								>
										{name.substr(0, maxlength) + '...'}
									</Tooltip>
								)
								}
							</span>
							{params.row.label.length > 0 && (
								<Poptip
									transfer
									placement="right"
									trigger="hover"
									width="250"
									word-wrap
								>
									<i class="iconfont icon-tag g-c-red-dark g-m-l-10" />
									{params.row.label.map(item => {
										return (
											<Tag color="#d9444f" slot="content" key={item.label_id}>
												{item.label_name}
											</Tag>
										);

									})}

								</Poptip>
							)}
						</div>
					);
				}
			},

			{
				title: "客户姓名",
				key: "customer_name",
				minWidth: 120,
				ellipsis: true
			},
			{
				title: "客户手机号",
				key: "phone",
				minWidth: 130
			},
			{
				title: "成交时间",
				key: "first_deal_time",
				minWidth: 200
			},
			{
				title: "最近成交时间",
				key: "last_deal_time",
				minWidth: 200
			},
			{
				title: "总实付金额",
				key: "total_payment_amount",
				minWidth: 130,
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							总实付金额
							<Explain
								style={{ marginLeft: '2px' }}
								title=""
								content="客户总共打款到账的金额，即客户从首次合作开始到现在，共打款了多少金额"
							/>
						</div>
					);
				}
			},
			{
				title: "总到账金额",
				key: "total_received_amount",
				minWidth: 130,
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							总到账金额
							<Explain
								style={{ marginLeft: '2px' }}
								title=""
								content="总实付金额减去所有手续费"
							/>
						</div>
					);
				}
			},
			{
				title: "下单金额",
				key: "contract_payment_amount",
				minWidth: 130,
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							下单金额
							<Explain
								style={{ marginLeft: '2px' }}
								title="客户下单购买产品所支付的金额"
								content="举例：假如购买A支付5万，购买B支付5万，则下单金额为10万"
							/>
						</div>
					);
				}
			},
			{
				title: "可用余额",
				key: "total_balance_amount",
				minWidth: 130,
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							可用余额
							<Explain
								style={{ marginLeft: '2px' }}
								title="客户账户内剩余的金额，可用于购买产品"
								content="举例：假如客户账户一共有15万，当下单减去10万后，则可用金额为5万"
							/>
						</div>
					);
				}
			},
			{
				title: "剩余尾款",
				key: "contract_last_amount",
				minWidth: 130,
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							剩余尾款
							<Explain
								style={{ marginLeft: '2px' }}
								title="客户合作后还未付清的费用"
								content="举例：假如产品A需要10万，客户下单支付8万，则剩余尾款为2万"
							/>
						</div>
					);
				}
			},
			{
				title: "邀约人",
				key: "invite_staff_name",
				minWidth: 100,
				ellipsis: true

			},
			{
				title: "部门",
				key: "invite_depart_name",
				minWidth: 100,
				ellipsis: true
			},
			{
				title: "客户公司",
				key: "company_name",
				minWidth: 200,
				ellipsis: true
			},
			{
				title: "关联公司",
				key: "relation_customer",
				minWidth: 200,
				ellipsis: true
			},
			{
				title: "操作",
				key: "link",
				width: 100,
				fixed: 'right',
				align: 'center',
				render: (h, { row }) => {
					return (
						<Dropdown transfer placement="left-start" style="max-height:240px; width: 100%" onOn-click={name => this[name](row)}>
							<div onClick={(e) => { e.stopPropagation(); }}>
								<i
									class="iconfont icon-point g-pointer "
									style="font-size: 20px; display: block"
								/>
							</div>
							<DropdownMenu slot="list">
								{getAuth(row.is_own == '1', 440, 448) && (
									<DropdownItem name="handlePayment">
										录入到账
									</DropdownItem>
								)}
								{getAuth(row.is_own == '1', 441, 449) && (
									<DropdownItem name="handleOrder">
										下单
									</DropdownItem>
								)}
								{getAuth(row.is_own == '1', 444, 452) && (
									<DropdownItem name="handleAddTag">
										添加标签
									</DropdownItem>
								)}
								{getAuth(row.is_own == '1', 445, 453) && (
									<DropdownItem name="handleDistribute">
										指派
									</DropdownItem>
								)}
								{getAuth(row.is_own == '1', 442, 443) && (
									<DropdownItem name="handleRelate">
										关联公司
									</DropdownItem>
								)}
							</DropdownMenu>
						</Dropdown>
					);
				}
			}
		];
		return {
			columns
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("SALE_CUSTOMER_DEAL_DEAL_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_CUSTOMER_DEAL_DEAL_LIST_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		handleRowClick(row) {
			if (!getAuth(row.is_own == '1', 446, 454)) return;
			this.$router.push(
				getHashUrl(
					'/sale/customer/deal/deal/detail',
					{
						contract_company_id: row.contract_company_id,
						is_own: row.is_own
					}
				)
			);
		},
		async handlePayment(row) {
			if (!this.$global.staff.is_charge
				&& !row.is_update
				&& row.contract_company_name.length >= 6) {
				let ok = await Confirm.popup({
					msg: '请先更新' + row.contract_company_name + '的资料信息，再进行录账操作',
					okText: '确定并去更新'
				}).then(() => 1).catch(e => e && console.error(e));
				if (ok) {
					ok = await UpdateCustonmer.popup({
						companyName: row.contract_company_name,
						customerId: row.customer_id,
						type: 3, // 客户类型 1 意向客户 2 公海 3 成交客户

					}).then(() => 1).catch(e => e && console.error(e));
				}
				if (!ok) return;
			}
			this.$router.push(
				getHashUrl("/sale/customer/deal/arrive/record", {
					customer_id: row.customer_id,
					staff_id: row.invite_staff_id,
					staff_name: row.invite_staff_name,
					deal_status: 1,
					contract_company_id: row.contract_company_id,
					customer_name: row.customer_name,
					// company_name: row.contract_company_name,  // 从成交客户里录入到账不显示公司名称
					action: "add"
				})
			);
		},
		handleOrder(row) {
			this.$router.push(
				getHashUrl('/sale/customer/deal/contract/order', {
					customer_id: row.customer_id,
					contract_company_id: row.contract_company_id,
					action: 'add'
				})
			);
		},
		handleAddTag(row) {
			AddTag.popup({
				data: {
					curTags: row.label,
					contract_company_id: row.contract_company_id
				}
			}).then(() => {
				this.handleResetCur();
			}).catch(() => {});
		},
		handleDistribute(row) {
			Distribute.popup({
				customerIds: [row.customer_id],
				contractCompanyId: row.contract_company_id,
				distributeCompany: true,
			}).then(() => {
				this.handleResetCur();
			}).catch(e => e && console.error(e));

		},
		handleRelate(row) {
			RelateApply.popup({
				data: {
					title: '关联公司申请',
					action: 'add',
					contract_company_id: row.contract_company_id,
					contract_company_name: row.contract_company_name
				}
			}).catch(e => e && console.error(e));

		}
	}
};
