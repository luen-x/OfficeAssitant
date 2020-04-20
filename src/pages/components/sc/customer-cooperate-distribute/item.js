import { getHashUrl } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from "./popup/detail";

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
				'4': this.getColumns('4')
			},
		};
	},
	methods: {
		handleOpenDrawer(row) {
			if (+this.type === 3 || +this.type === 4) {
				if (this.$refs.tableTarget.length === 4) {
					this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
				} else {
					this.$refs.tableTarget[this.type - 3].$refs.tableTarget.clearCurrentRow();
				}
				
				return;
			}

			DetailDrawer.popup({
				type: this.type,
				staff_id: Number(row.staff_id),
				contract_company_id: Number(row.contract_company_id),
				staff_name: row.staff_name,
				contract_company_name: row.contract_company_name
			}).then(res => {
				this.$store.commit("SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_RESET", {
					type: this.type
				});

				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleResetFirst() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		getColumns(type) {
			let column = [];

			switch (type) {
				case "1": 
					column = [
						{
							title: "姓名",
							key: "staff_name",
							minWidth: 120,
							render: (h, params) => {
								return (
									<div class="g-pointer g-c-blue-mid">
										{params.row.staff_name}
									</div>
								);
							}
						},
						{
							title: "月份",
							key: "complete_month",
							minWidth: 120
						},
						{
							title: "部门",
							key: "depart_name",
							minWidth: 120
						},
						{
							title: "职位",
							key: "position_name",
							minWidth: 120
						},
						{
							title: "海报完成数",
							key: "poster_num",
							minWidth: 120
						},
						{
							title: "海报文案完成数",
							key: "poster_copy_num",
							minWidth: 120
						},
						{
							title: "朋友圈文案完成数",
							key: "circle_copy_num",
							minWidth: 140
						}
					];
					
					break;

				case "2":
					column = [
						{
							title: "公司名称",
							key: "contract_company_name",
							minWidth: 220,
							render: (h, params) => {
								return (
									<div class="g-pointer g-c-blue-mid">
										{params.row.contract_company_name}
									</div>
								);
							}
						},
						{
							title: "品牌名称",
							key: "brand_name",
							minWidth: 120
						},
						{
							title: "月份",
							key: "complete_month",
							minWidth: 120
						},
						{
							title: "海报完成数",
							key: "poster_num",
							minWidth: 120
						},
						{
							title: "海报文案完成数",
							key: "poster_copy_num",
							minWidth: 120
						},
						{
							title: "朋友圈文案完成数",
							key: "circle_copy_num",
							minWidth: 140
						}
					];

					break;

				case "3":
					column = [
						{
							title: "姓名",
							key: "staff_name",
							minWidth: 120
						},
						{
							title: "部门",
							key: "depart_name",
							minWidth: 120
						},
						{
							title: "职位",
							key: "position_name",
							minWidth: 150
						},
						{
							title: "待完成单量",
							key: "wait_complete_count",
							minWidth: 100,
							render: (h, params) => {
								let isJump = this.$auth[297] && this.$auth[777];

								if (isJump) {
									return (
										<div 
											class="g-pointer" 
											style="color: #2397f9;"
											onClick={() => {
												let url = "http://" + location.host 
												+ "/sc/customer/cooperate?staff_name=" + params.row.staff_name + "&&type=4";
	
												window.open(url, '_blank');
											}}
										>
											{params.row.wait_complete_count}
										</div>
									);
								} else {
									return (
										<div>
											{params.row.wait_complete_count}
										</div>
									);
								}
							}
						},
						{
							title: "当月单量",
							key: "month_complete_count",
							minWidth: 110,
							render: (h, params) => {
								let isJump = this.$auth[297] && this.$auth[777];

								if (isJump) {
									return (
										<div 
											class="g-pointer" 
											style="color: #2397f9;"
											onClick={() => {
												let url = "http://" + location.host 
											+ "/sc/customer/cooperate?staff_name=" + params.row.staff_name + "&&type=4";

												window.open(url, '_blank');
											}}
										>
											{params.row.month_complete_count}
										</div>
									);
								} else {
									return (
										<div>
											{params.row.month_complete_count}
										</div>
									);
								}
							}
						},
						{
							title: "今年单量",
							key: "year_complete_count",
							minWidth: 120,
							render: (h, params) => {
								let isJump = this.$auth[297] && this.$auth[777];

								if (isJump) {
									return (
										<div 
											class="g-pointer" 
											style="color: #2397f9;"
											onClick={() => {
												let url = "http://" + location.host 
											+ "/sc/customer/cooperate?staff_name=" + params.row.staff_name + "&&type=4";

												window.open(url, '_blank');
											}}
										>
											{params.row.year_complete_count}
										</div>
									);
								} else {
									return (
										<div>
											{params.row.year_complete_count}
										</div>
									);
								}
							}
						},
						{
							title: "累计单量",
							key: "total_count",
							minWidth: 100,
							render: (h, params) => {
								let isJump = this.$auth[297] && this.$auth[777];

								if (isJump) {
									return (
										<div 
											class="g-pointer" 
											style="color: #2397f9;"
											onClick={() => {
												let url = "http://" + location.host 
											+ "/sc/customer/cooperate?staff_name=" + params.row.staff_name + "&&type=4";

												window.open(url, '_blank');
											}}
										>
											{params.row.total_count}
										</div>
									);
								} else {
									return (
										<div>
											{params.row.total_count}
										</div>
									);
								}
							}
						},
						{
							title: "最近一单时间",
							key: "last_time",
							minWidth: 160
						}
					];
					
					break;

				case "4":
					column = [
						{
							title: "公司名称",
							key: "company_name",
							minWidth: 150,
							render: (h, params) => {
								return (
									<AutoToolTip 
										content={params.row.company_name}
										width="140px"
										theme="dark"
										placement="bottom"
										labelClass=""
									/>
								);
							}
						},
						{
							title: "下单产品",
							key: "product",
							width: 120,
							render: (h, params) => {
								return (
									<AutoToolTip 
										content={params.row.product}
										width="100px"
										theme="dark"
										placement="bottom"
										labelClass=""
									/>
								);
							}
						},
						{
							title: "客户姓名",
							key: "customer",
							minWidth: 120
						},
						{
							title: "主负责人",
							key: "main_person_name",
							minWidth: 100,
							render: (h, params) => {
								return (
									<AutoToolTip 
										content={params.row.main_person_name}
										width="80px"
										theme="dark"
										placement="bottom"
										labelClass=""
									/>
								);
							}
						},
						{
							title: "负责人",
							key: "distributes_person_name",
							minWidth: 140,
							render: (h, params) => {
								return (
									<AutoToolTip 
										content={params.row.distributes_person_name}
										width="120px"
										theme="dark"
										placement="bottom"
										labelClass=""
									/>
								);
							}
						},
						{
							title: "分配时间",
							key: "create_time",
							minWidth: 160
						},
						{
							title: "合同编号",
							key: "contract_num",
							minWidth: 160
						}
					];
					break;
					
				default:
					break;
			}

			return column;
		}
	}
};