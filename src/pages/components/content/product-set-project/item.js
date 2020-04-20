import API from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";
import { DELPRO } from "./popup/del-ture";

export default {
	data() {
		return {
			columns: [
				{
					title: "名字",
					key: "process_name",
					tooltip: true,
				},
				{
					title: "创建时间",
					key: "create_time"
				},
				{
					title: "流程介绍",
					key: "describe",
					tooltip: true,
				},

				{
					title: "操作",
					key: "process_id",
					render: (h, params) => {
						return (
							<div class="g-operation g-c-blue-light ">
								{this.$auth[34] && <span onClick={() => this.handleEidt(params.row.process_id)}>
									编辑
								</span>}
								{(this.$auth[34] && this.$auth[35]) && <span class="g-m-lr-5">|</span>}
								{ this.$auth[35] && <span onClick={() => this.handleClear(params.row.process_id)}
								>
									删除
								</span>}
							</div>
						);
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("CONTENT_PRODUCT_SET_PROJECT_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("CONTENT_PRODUCT_SET_PROJECT_LIST_RESET", {
				type: this.type
			});
		},
		delList(val) {
			this.$request({
				url: API._CONTENT_PRODUCT_SET_PROJECT_LIST_DEL_GET,
				type: "GET",
				param: {
					process_id: val
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.handleResetCur();
			}).catch(error => {
				this.$Message.error(error.msg);
				console.error(error);
			});
		},
		// 列表编辑
		handleEidt(val) {
			this.$auth[34] && this.$router.push({ name: "content-product-newproject", query: { request_id: val } });
		},
		// 列表删除
		handleClear(val) {
			this.$auth[35] && Confirm.popup({
				title: '确定删除',
				msg: '请问是是否要确定删除吗？'
			}).then(res => {
				this.delList(val);
			}).catch(res => {});
		},



	}
};
