import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from './popup/detail.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: "姓名",
					key: "staff_name",
					fixed: "left",
					minWidth: 150,
					render: (h, params) => {
						return <span class="g-c-blue-mid g-pointer" onClick={() => this.handleShowDetail(params.row)}>
							{ params.row.staff_name }
						</span>;
					}
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 150,
					render: (h, params) => {
						return (params.row.depart_name
							? <AutoToolTip
								content={params.row.depart_name}
								labelClass=""
								theme="dark"
							/> : <span>-</span>
						);
					}
				},
				{
					title: "部门简称",
					key: "abbreviation",
					minWidth: 150,
					render: (h, params) => {
						return <span>{params.row.abbreviation || '-'}</span>;
					}
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 150,
					render: (h, params) => {
						return <span>{params.row.position_name ? params.row.position_name : '-'}</span>;
					}
				},
				{
					title: "合作项目",
					key: "projects",
					minWidth: 150,
					render: (h, params) => {
						return (params.row.projects.length
							? <AutoToolTip
								content={params.row.projects}
								labelClass=""
								theme="dark"
							/> : <span>-</span>
						);
					}
				},
				{
					title: "合作年限",
					key: "cooperate_year",
					minWidth: 150,
					render: (h, params) => {
						return <span>{params.row.cooperate_year || '-'}</span>;
					}
				},
				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 150,
					render: (h, params) => {
						return <span>{params.row.payment_amount || '-'}</span>;
					}
				},
				{
					title: "服务提成",
					key: "contract_service_amount",
					minWidth: 150,
					render: (h, params) => {
						return <span>{params.row.contract_service_amount || '-'}</span>;
					}
				},
				{
					title: "已发服务提成",
					key: "contract_grant_service_amount",
					minWidth: 150,
					render: (h, params) => {
						return <span>{params.row.contract_grant_service_amount || '-'}</span>;
					}
				},
				{
					title: "合作公司",
					key: "contract_company_names",
					minWidth: 150,
					render: (h, params) => {
						return (params.row.contract_company_names
							? <AutoToolTip
								content={params.row.contract_company_names}
								labelClass=""
								theme="dark"
							/> : <span>-</span>
						);
					}
				},
				{
					title: "应发服务提成",
					key: "need_service_amount",
					minWidth: 150,
					render: (h, params) => {
						return <span>{params.row.need_service_amount || '-'}</span>;
					}
				},
				{
					title: "实发服务提成",
					key: "service_amount",
					minWidth: 150,
					render: (h, params) => {
						return <span>{params.row.service_amount || '-'}</span>;
					}
				},
				{
					title: "发放原因",
					key: "grant_reason",
					minWidth: 150,
					render: (h, params) => {
						return (params.row.grant_reason
							? <AutoToolTip
								content={params.row.grant_reason}
								labelClass=""
								theme="dark"
							/> : <span>-</span>
						);
					}
				}
			],
		};
	},
	methods: {
		handleShowDetail(info) {
			DetailDrawer.popup({
				info,
				test: 'test'
			}).then(res => {
				// this.$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				// this.$refs.tableTarget.clearCurrentRow();
			});
		},
	}
};

