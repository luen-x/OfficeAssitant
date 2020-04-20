import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import callService from '@components/sale/call-manage/call/service';
import { DetailDrawer } from "../_common/service-manage-detail/detail.vue";
import Poptip from "../_common/poptip/poptip.vue";

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': []
			}
		};
	},

	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},

	mounted() {
		this.$vc.on("sc-service-inspection-title-change", (res) => {
			this.loadTitleArray(this.type);
		});
	},

	beforeDestroy() {
		this.$vc.off("sc-service-inspection-title-change");
	},

	methods: {
		handleCall(row) {
			let cus = {
				...row,
				tel: row.phone,
				contract_company_name: row.company_name
			};
			callService.prepareToCallOut(row.phone, { customer: cus });
		},
		handleOpenDrawer(row) {
			if (!this.$auth[347]) {
				return;
			}

			DetailDrawer.popup({
				type: this.type,
				quality_id: Number(row.quality_id),
				contract_company_id: Number(row.contract_company_id),
				data: row,
				flag: 2,
				name: "inspection"
			}).then(res => {
				this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
			});
		},

		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},

		handleResetFirst() {
			this.$store.commit('SC_SERVICE_INSPECTION_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('SC_SERVICE_INSPECTION_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		},

		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [{
				title: "公司名称",
				key: "company_name",
				minWidth: 220,
				fixed: "left",
				render: (h, { row }) => {
					let arr = [];

					row.is_follow == 1 && arr.push("需跟进");
					row.return_visit == 1 && arr.push("要求重新质检");
					row.is_new_contract == 1 && arr.push("新合同");

					return (
						<div class="g-flex-ac">
							<AutoToolTip 
								content={row.company_name}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass={this.$auth[347] ? "g-c-blue-mid g-pointer" : ""}
							/>
							{arr.length != 0 ? <Poptip tag={arr}/> : ""}
						</div>
					);
				}
			},
			{
				title: "客户姓名",
				key: "customer_name",
				minWidth: 100
			},
			{
				title: "客户手机号",
				key: "phone",
				minWidth: 140,
				render: (h, { row }) => {
					if (!_global.staff.seat_number) {
						return (
							<span>{row.phone}</span>
						);
					} else {
						return (
							<span
								class="_value g-operation"
								onClick={
									() => {
										window.event.stopPropagation();
										this.handleCall(row);
									}
								}
							>
								{row.phone}
								<i class="icon iconfont icon-call2 g-m-l-5" />
							</span>
						);
					}
				}
			},
			{
				title: "下单产品",
				key: "product_items",
				minWidth: 200,
				render: (h, params) => {
					let product_items = params.row.product_items && params.row.product_items.join("、");

					return (
						<AutoToolTip 
							content={product_items}
							width="160px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			},
			{
				title: "分配人",
				key: "assign_person_name",
				minWidth: 120
			},
			{
				title: "分配时间",
				key: "assign_time",
				minWidth: 160
			},
			{
				title: "客户评分",
				key: "score",
				minWidth: 120
			},
			{
				title: "谈判人",
				key: "negotiator_items",
				minWidth: 100,
				render: (h, params) => {
					let negotiator_items = params.row.negotiator_items && params.row.negotiator_items.join("、");
					
					return (
						<AutoToolTip 
							content={negotiator_items}
							width="60px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			},
			{
				title: "邀约人",
				key: "invitor_name",
				minWidth: 100
			},
			{
				title: "服务人",
				key: "service_person_name",
				minWidth: 100
			},
			{
				title: "合同金额",
				key: "contract_amount",
				minWidth: 120
			},
			{
				title: "应付金额",
				key: "need_amount",
				minWidth: 100
			},
			{
				title: "实付金额",
				key: "payment_amount",
				minWidth: 110
			},
			{
				title: "合同年限",
				key: "contract_limit_year",
				minWidth: 100,
				render: (h, params) => {
					if (params.row.contract_limit_year) {
						return (
							<div>{params.row.contract_limit_year}年</div>
						);
					} else {
						return null;
					}
				}
			},
			{
				title: "下单日期",
				key: "place_order_time",
				minWidth: 120
			},
			{
				title: "系统完成日期",
				key: "system_finish_date",
				minWidth: 120
			},
			{
				title: "回款金额（万）",
				key: "return_money",
				minWidth: 120
			},
			{
				title: "代理人数（人）",
				key: "agent_num",
				minWidth: 120
			},
			{
				title: "服务到期日期",
				key: "service_expire_date",
				minWidth: 120
			},
			{
				title: "提单年限",
				key: "bill_year",
				minWidth: 110,
				render: (h, params) => {
					if (params.row.bill_year) {
						return (
							<div>{params.row.bill_year}年</div>
						);
					} else {
						return null;
					}
				}
			},
			{
				title: "大课培训评分",
				key: "lecture_train_score",
				minWidth: 110
			},
			{
				title: "系统制作评分",
				key: "system_make_score",
				minWidth: 110
			},
			{
				title: "软件评分",
				key: "software_score",
				minWidth: 110
			},
			{
				title: "海报文案评分",
				key: "poster_score",
				minWidth: 110
			},
			{
				title: "百度评分",
				key: "baidu_score",
				minWidth: 110
			},
			{
				title: "视频评分",
				key: "video_score",
				minWidth: 110
			}, {
				title: "服务人部门",
				key: "service_depart_name",
				minWidth: 150
			},
			{
				title: "包装评分",
				key: "package_project_score",
				minWidth: 110
			},
			{
				title: "部门简称",
				key: "service_depart_abbreviation",
				minWidth: 100
			}, {
				title: "系统到期时间",
				key: "system_expire_date",
				minWidth: 160
			}];

			if (type == 1) {
				columns.splice(columns.length, 0, {
					title: "待质检人",
					key: "assign_staff_name",
					minWidth: 120
				}, {
					title: "上次接通情况",
					key: "call_status",
					minWidth: 120
				}, {
					title: "上次质检时间",
					key: "quality_date",
					minWidth: 120
				}, {
					title: "上次质检人",
					key: "quality_staff_name",
					minWidth: 100
				});
			} else {
				columns.splice(columns.length, 0, {
					title: "质检人",
					key: "quality_staff_name",
					minWidth: 100
				}, {
					title: "上次接通情况",
					key: "call_status",
					minWidth: 120
				}, {
					title: "质检时间",
					key: "quality_date",
					minWidth: 160
				});
			}

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			return columnsShow;
		}
	}
};