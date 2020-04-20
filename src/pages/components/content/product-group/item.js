import API from "@stores/apis/root";
import { Poptip, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Confirm } from "@components/_common/confirm/confirm";
import { DelGroup } from './popup/del-group';

export default {
	data() {
		return {
			columns: [
				{
					title: "组合名称",
					key: "product_name",
					tooltip: true,
				},
				{
					title: "产品数量",
					key: "product_num",
					render: (h, params) => {
						return (
							<div>
								<Dropdown placement="right-start">
									<span class="g-pd-r-10 g-operation">{params.row.product_num}</span>
									<DropdownMenu slot="list" style="max-height:200px;overflow-y: auto;" >
										{
											params.row.product_name_arr.map(item => <DropdownItem> {item}</DropdownItem>)
										}
									</DropdownMenu>
								</Dropdown>
							</div>
						);
					}
				},
				{
					title: "组合价格",
					key: "product_total_price",
					render: (h, params) => {
						return (
							<div>
								<span >&yen;{params.row.product_total_price}</span>
							</div>
						);
					}
				},
				{
					title: "组合介绍",
					key: "product_describe",
					tooltip: true,

				},
				{
					title: "操作",
					key: "process_id",
					render: (h, params) => {
						return (
							<div class="g-c-blue-light g-operation">
								{this.$auth[40] && <span onClick={() => this.handleEidt(params.row.product_id)}>编辑</span>}
								{(this.$auth[40] && this.$auth[41]) && <span class="g-m-lr-5">|</span>}
								{this.$auth[41] && <span onClick={() => this.handleClear(params.row.product_id)}>删除</span>}
							</div>
						);
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("CONTENT_PRODUCT_GROUP_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("CONTENT_PRODUCT_GROUP_LIST_RESET", { type: this.type });
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		DelList(val) {
			this.$request({
				url: API._CONTENT_PRODUCT_GROUP_DEL_POST,
				type: "post",
				param: {
					product_id: val
				}
			})
				.then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				})
				.catch(error => {
					this.$Message.error(error.msg);
					console.error(error);
					DelProductFail.popup({})
						.then(data => {
							res = {};
						})
						.catch(data => {});
				});
		},
		// 列表编辑
		handleEidt(val) {
			 this.$router.push({
				name: "content-product-newgroup",
				query: { product_id: val }
			});
		},
		renderContent(h, params) {
			return (
				<div class="g-c-black2 g-fs-14">
					<div>删除后不可恢复,确认删除？</div>
					<div>删除后已经下单的组合按照删除前的组合信息去走<br />
						删除后该组件组合消失,无法再进行下单</div>
				</div>
			);
		},
		// 列表删除
		handleClear(val) {
			Confirm.popup({
				title: '确认删除',
				renderContent: this.renderContent
			})
				.then(data => {
					this.DelList(val);
				})
				.catch(data => {});
		}
	}
};
