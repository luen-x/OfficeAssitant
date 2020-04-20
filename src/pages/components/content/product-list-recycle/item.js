import API from "@stores/apis/root";
import { Poptip } from "iview";
import { Confirm } from "@components/_common/confirm/confirm";

export default {
	data() {
		return {
			type: ['', "标准价成本", "成交金额成本", "固定成本"],
			columns: [
				{
					title: "产品名称",
					key: "product_name",
					tooltip: true,
					minWidth: 200,
				},
				{
					title: "产品分类",
					key: "category_name",
					minWidth: 150,
				},
				{
					title: "标准价格",
					tooltip: true,
					minWidth: 200,
					key: "price",
					render: (h, params) => {
						return (
							<div>
								{params.row.standard_price_str.length <= 15 && params.row.standard_price_str}
								{params.row.standard_price_str.length > 15 && (
									<Poptip trigger="hover" transfer placement="bottom" content="content" maxWidth={250}>
										{params.row.standard_price_str.substr(0, 15) + "..."}
										<div slot="content">
											{
												params.row.standard_price_str.split(",").map(el => {
													return <div>{el}</div>;
												})
											}
										</div>
									</Poptip>
								)}
							</div>
						);
					}
				},
				{
					title: "实扣成本",
					minWidth: 220,
					key: "cost_str",
					render: (h, params) => {
						return (
							<div>
								{params.row.cost_str.length <= 15 && params.row.cost_str}
								{params.row.cost_str.length > 15 && (
									<Poptip trigger="hover" transfer placement="bottom" content="content" maxWidth={250}>
										{params.row.cost_str.substr(0, 15) + "..."}
										<div slot="content">
											{
												params.row.cost_str.split("、").map(el => {
													return <div>{el}</div>;
												})
											}
										</div>
									</Poptip>
								)}
							</div>
						);
					}
				},
				{
					title: "服务提成",
					minWidth: 150,
					key: "has_service_amount"
				},
				{
					title: "操作",
					minWidth: 150,
					key: "process_id",
					render: (h, params) => {
						return (
							<div class="g-operation ">
								<span onClick={() => this.handleEidt(params.row.product_id)}>恢复</span>
							</div>
						);
					}
				}
			]
		};
	},
	computed: {
		auth() {
			return this.$auth;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("CONTENT_PRODUCT_LIST_RECYCLE_INIT");
		},
		handleResetCur() {
			this.$store.commit("CONTENT_PRODUCT_LIST_RECYCLE_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		recoveryProduct(val) {
			this.$request({
				url: API._CONTENT_PRODUCT_LIST_RECOVERY_GET,
				type: "post",
				param: {
					product_id: val
				}
			}).then(res => {
				this.$Message.success("恢复成功！");
				this.handleResetCur();
			}).catch(error => {
				this.$Message.error(error.msg);
				console.error(error);
			});
		},
		// 列表编辑
		handleEidt(val) {
			Confirm.popup({
				title: '确认恢复',
				msg: '确认将此产品从回收站恢复至正常状态？'
			}).then(res => {
				this.recoveryProduct(val);
			}).catch(err => {

			});
		},
		// 列表删除
		handleClear(val) {

		}
	}
};
