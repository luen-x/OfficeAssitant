import API from "@stores/apis/root";
import { Poptip } from "iview";
import { Confirm } from "@components/_common/confirm/confirm";
import { DelProduct } from "./popup/del-product";
import { DelProductFail } from "./popup/del-product-fail";




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
												params.row.cost_str.split(",").map(el => {
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
							<div class="g-c-blue-light g-operation">
								{this.auth[22] && <span onClick={() => this.handleEidt(params.row.product_id)}>编辑</span>}
								{(this.auth[22] && this.auth[23]) && <span class="g-m-lr-5">|</span>}
								{this.auth[23] && <span onClick={() => this.handleClear(params.row.product_id)}>删除</span>}
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
			this.$store.commit("CONTENT_PRODUCT_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("CONTENT_PRODUCT_LIST_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		DelList(val) {
			this.$request({
				url: API._CONTENT_PRODUCT_LIST_DEL_POST,
				type: "post",
				param: {
					product_id: val
				}
			}).then(res => {
				this.$Message.success("删除成功！");
				this.handleResetCur();
			}).catch(error => {
				this.$Message.error(error.msg);
				console.error(error);
			});
		},
		// 列表编辑
		handleEidt(val) {
			this.$router.push({
				name: "content-product-new",
				query: { product_id: val }
			});
		},
		// 列表删除
		handleClear(val) {
			Confirm.popup({
				title: '确认删除',
				msg: '确认删除？删除后产品将进入回收站'
			}).then(res => {
				this.DelList(val);
				res = {};
			}).catch(err => {

			});
		}
	}
};
