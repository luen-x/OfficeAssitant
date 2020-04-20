import { Tooltip } from 'iview';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { getParseUrl } from '@utils/utils';
import { SeaCompanyDetail } from "./popup/company-detail";

export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'company_name',
					width: 250,
					fixed: "left",
					render: (h, { row }) => {
						const name = row.company_name;

						return (
							<div>
								<div class="g-operation g-dp-ib g-m-r-10" style="width:185px">
									<AutoTooltip
										content={name}
										theme="dark"
										placement="bottom"
									/>
								</div>
								{
									!row.can_get && (
										<i 
											class="iconfont icon icon-bklq g-c-red-mid g-c-red-mid g-dp-ib" 
											style="transform: scale(1.5);"
										/>
									)
								}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip
									content={row.customer_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '行业',
					key: 'industry_name',
					minWidth: 100,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip
									content={row.industry_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '地址',
					key: 'address_str',
					width: 270,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip
									content={row.address_str}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '创建时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '回收时间',
					key: 'recovery_time',
					minWidth: 160
				},
				{
					title: '注册资金',
					key: 'capital',
					minWidth: 100
				},
				{
					title: '转手次数',
					key: 'change_times',
					minWidth: 100
				},
				{
					title: "人员规模",
					key: "scale",
					minWidth: 110
				},
				{
					title: '创建人',
					key: 'staff_name',
					minWidth: 100,
					tooltip: true
				},
				{
					title: '最后联系人',
					key: 'last_staff_name',
					minWidth: 100
				}
			]
		};
	},
	methods: {
		handleOpenDrawer(row) {
			if (this.$auth[476]) {
				const page = (getParseUrl().query || {}).page || 1;
				const infoArr = this.listInfo.data[page];
				if (infoArr) {
					this.openIndex = infoArr.findIndex(item => {
						return item.customer_id == row.customer_id;
					});
				}
				SeaCompanyDetail.popup({
					customerId: row.customer_id
				}).then(res => {
					this.$refs.tableTarget && this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
					this.openIndex = -1;
				}).catch(error => {
					error && console.error(error);
					this.$refs.tableTarget && this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
					this.openIndex = -1;
				});
			}
		}
	}
};

