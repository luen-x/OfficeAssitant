import API_ROOT from "@stores/apis/root";
import { Divider } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					title: "公司名称",
					key: "contract_company_name",
					minWidth: 130,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.contract_company_name}
								labelClass=""
								theme="dark"
							>{params.row.contract_company_name}</AutoToolTip>
						);
					}
				},
				{
					title: "客户名称",
					key: "customer_name",
					minWidth: 140
				},
				{
					title: "邀约人",
					key: "staff_name",
					minWidth: 120
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 150
				},
				{
					title: "下单产品",
					key: "product_num",
					minWidth: 100
				},
				{
					title: "实付金额",
					key: "payment",
					minWidth: 120
				},
				{
					title: "付款时间",
					key: "first_deal_time",
					minWidth: 160
				},
				{

					title: '操作',
					key: 'action',
					width: 140,
					align: 'center',
					render: (h, params) => {
						return (
							<span>
								{ this.$auth[1111] ? <span class="g-c-blue-mid g-pointer" onClick={() => this.handleWatch(params.row)}>
									查看
								</span> : null }
							</span>
						);
					}
				}
			],
		};
	},
	methods: {
		// 查看
		handleWatch(info) {
			this.$router.push(`/hr/archives/employee/customer/detail?contract_company_id=${info.contract_company_id}`);
		}
	}
};

