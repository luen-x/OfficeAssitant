
import { Tooltip } from 'iview';
import AutoTooltip from '@components/_common/auto-tooltip/auto-tooltip';
import { serviceDetail } from './popup/serviceDetail';

export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'company_name',
					width: 250,
					render: (h, { row }) => {
						return (
							<div class={{ 'g-operation': this.$auth[1501] }} onClick={() => { this.handleServiceDetail(row); }}>{
								row.company_name.length > 20
									? <Tooltip
										transfer
										placement="bottom"
									>
										<span>{row.company_name.substring(0, 16) + '...'}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{row.company_name}</span>
										</div>
									</Tooltip>
									: <span>{row.company_name}</span>
							}
							</div>
						);
					}
				},
				{
					title: '客户名称',
					key: 'customer_name',
					minWidth: 100,
				},
				{
					title: '服务人',
					key: 'service_person_name',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<AutoTooltip
								theme="dark"
								placement="bottom-start"
								content={row.service_person_name}
								labelClass=" "
							/>
						);
					}
					
				},
				{
					title: '下单产品',
					key: 'service_expire_date',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<AutoTooltip
								theme="dark"
								placement="bottom-start"
								content={row.product_names.join('、')}
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '最近接通情况',
					key: 'call_status_name',
					minWidth: 110,
				},
				{
					title: '服务到期月份',
					key: 'service_expire_date',
					minWidth: 110,
				},
				{
					title: '服务评分',
					key: 'score',
					minWidth: 90,
				},


				{
					title: '系统到期时间',
					key: 'system_expire_date',
					minWidth: 110,
				},

				{
					title: '上次质检时间',
					key: 'quality_date',
					minWidth: 110,
				},
				{
					title: '上次质检人',
					key: 'quality_staff_name',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<AutoTooltip
								theme="dark"
								placement="bottom-start"
								content={row.quality_staff_name}
								labelClass=" "
							/>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_MAIN_SERVICE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_MAIN_SERVICE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleServiceDetail(row) {
			if (this.$auth[1501]) {
				serviceDetail.popup({
					data: {
						...row
					},
					contract_company_id: row.contract_company_id,
					option: false
				}).then().catch();
			}
		},
	}
};



