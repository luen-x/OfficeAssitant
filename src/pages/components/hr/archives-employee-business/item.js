import moment from 'moment';
import { Copy, Upload } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem, Poptip, Tooltip } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-archives-employee-business-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-archives-employee-business-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: "姓名",
					key: "staff_name",
					fixed: "left",
					minWidth: 130,
					render: (h, params) => {
						const { staff_name, add_type } = params.row;
						return (
							<div class="g-flex-ac">
								{ this.$auth[1103]
									? <span>
										{ staff_name.length <= 7 ? staff_name
											: <AutoToolTip
												content={staff_name}
												labelClass=""
												width="105px"
												theme="dark"
											>
												{staff_name}
											</AutoToolTip>
										}
									</span> : null }
							</div>
						);
					}
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 120
				},
				{
					title: "入职时间",
					key: "create_time",
					minWidth: 150
				},
				{
					title: "月份",
					key: "months",
					minWidth: 120
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 150
				},
				{
					title: "过客户",
					key: "adoptive",
					minWidth: 100
				},
				{
					title: "过出来客户",
					key: "adoptived",
					minWidth: 100
				},
				{
					title: "谈判客户",
					key: "negotiation",
					minWidth: 100
				},
				{
					title: "跟进客户",
					key: "follow_up",
					minWidth: 100
				},
				{
					title: "成交客户",
					key: "deal",
					minWidth: 100
				},
				{
					title: "加微信客户",
					key: "wechat",
					minWidth: 100
				},
				{
					title: "维护客户",
					key: "maintenance",
					minWidth: 100
				},
				{
					title: "维护出来客户",
					key: "maintenanced",
					minWidth: 110
				},
				{
					title: "约见客户",
					key: "appoint",
					minWidth: 100
				},
				{
					title: "绕前台",
					key: "proscenium",
					minWidth: 100
				},
				{
					title: "业绩金额数据（元）",
					key: "achievement",
					minWidth: 150,
					render: (h, params) => {
						return (
							<Tooltip placement="top">
						  {params.row.achievement}
						    <div slot="content">
						        {
										params.row.refund_info.map(item => {
											return <div>
												<span>{item.product_name}:</span>
												<span>{item.refund_amount}</span>
											</div>;
										})
									}
						    </div>
							</Tooltip>
						);
					}
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				return result;
			}).filter(Boolean);

			columnsShow.push({
				title: '操作',
				key: 'action',
				width: 140,
				fixed: 'right',
				align: 'center',
				render: (h, params) => {
					return (
						<router-link
							class="g-c-blue-mid g-pointer"
							to={this.handleLinkTo(params)}
						>
							<span>查看</span>
						</router-link>
					);
				}
			});

			return columnsShow;
		},
		handleLinkTo(params) {
			const { query } = this.$route;
			return this.type === '1'
				? getHashUrl(
					'/hr/archives/employee/business/detail',
					{ staff_id: params.row.staff_id, month: query.month || '', type: this.type }
				)
				: getHashUrl(
					'/hr/archives/employee/business/detail',
					{ staff_id: params.row.staff_id, month: query.month || '', type: this.type }
				);
		},
	}
};

