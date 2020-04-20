
import { DetailDrawer } from "@components/sc/_common/service-manage-detail/detail.vue";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'company_name',
					minWidth: 220,
					fixed: "left",
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.company_name}
								theme="dark"
								placement="bottom"
							/>
						);
					}
				},
				{
					title: '客户姓名',
					key: 'customer_name',
					minWidth: 100
				},
				{
					title: '服务人',
					key: 'service_person_name',
					minWidth: 100,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.service_person_name}
								theme="dark"
								placement="bottom"
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '部门简称',
					key: 'abbreviation',
					minWidth: 100
				},
				{
					title: '下单产品',
					key: 'product_names',
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.product_names.join(',')}
								theme="dark"
								placement="bottom"
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '最近接通情况',
					key: 'call_status_name',
					minWidth: 120
				},
				{
					title: '服务评分',
					key: 'score',
					minWidth: 100
				},
				{
					title: '服务到期月份',
					key: 'service_expire_date',
					minWidth: 120
				},
				{
					title: '系统到期时间',
					key: 'system_expire_date',
					minWidth: 120
				},
				{
					title: '上次质检时间',
					key: 'quality_date',
					minWidth: 120
				},
				{
					title: '上次质检人',
					key: 'quality_staff_name',
					minWidth: 100
				}
			],
		};
	},
	methods: {
		handleOpenDrawer(row) {
			if (!this.$auth[341]) {
				return;
			}

			DetailDrawer.popup({
				type: this.type,
				quality_id: Number(row.quality_id),
				contract_company_id: Number(row.contract_company_id),
				data: row,
				flag: 1,
				name: "manage",
				option: false
			}).then(res => {
				this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleResetFirst() {
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

