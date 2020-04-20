import { Progress } from "iview";
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					title: "公司名称",
					key: "contract_company_name",
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.contract_company_name}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "补款合同",
					key: "contract_num",
					minWidth: 140,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.contract_num}
								width="120px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "下单产品",
					key: "product_name",
					minWidth: 140,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.product_name}
								width="120px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "补款金额",
					key: "payment_amount",
					minWidth: 100
				},
				{
					title: "补款人",
					key: "staff_name",
					minWidth: 160
				},
				{
					title: "补款时间",
					key: "create_time",
					minWidth: 160
				},
				{
					title: " ",
					key: "is_ignore",
					minWidth: 80,
					render: (h, params) => {
						if (params.row.is_ignore == 1) {
							return (
								<div class="g-c-red-mid">已忽略</div>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				}	
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SC_MAIN_SUPPLIST_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_MAIN_SUPPLIST_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};