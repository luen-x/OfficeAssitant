import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import Record from "../../../_common/detail/quality-record/record";

export default {
	data() {
		return {
			columns: [
				{
					type: "expand",
					minWidth: 20,
					render: (h, params) => {
						return (
							<Record datas={params.row.qualityRecordLesson} isRequest={false}/>
						);
					}
				},
				{
					title: "公司名称",
					key: "contract_company_name",
					minWidth: 160,
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
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100
				},
				{
					title: "评分套系",
					key: "qualityRecordLesson",
					minWidth: 220,
					render: (h, params) => {
						let arr = [];

						params.row.qualityRecordLesson && params.row.qualityRecordLesson.length && params.row.qualityRecordLesson.forEach(item => {
							if (item.lesson_type == 1) {
								arr.push(`${item.product_name}：${item.lecture_set_name}(${item.whole_score})`);
							} else if (item.lesson_type == 2) {
								arr.push(`${item.lecture_set_name}(${item.whole_score})`);
							}
						}); 

						return (
							<AutoToolTip 
								content={arr.join("、")}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass="g-pd-t-5"
							/>
						);
					}
				},
				{
					title: "担任角色评分",
					key: "role_type_score",
					minWidth: 120,
					render: (h, params) => {
						let arr = [];

						params.row.role_type_score && params.row.role_type_score.length && params.row.role_type_score.forEach(item => {
							arr.push(`${item.role_type}(${item.score == -1 ? '未评' : item.score + '分'})`);
						});

						return (
							<AutoToolTip 
								content={arr.join("、")}
								width="90px"
								theme="dark"
								placement="bottom" 
								labelClass="g-pd-t-5"
							/>
						);
					}
				},
				{
					title: "质检日期",
					key: "create_time",
					minWidth: 160
				}	
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('COLLAGE_STATICSTIC_CHECK_QUALITY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_STATICSTIC_CHECK_QUALITY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};