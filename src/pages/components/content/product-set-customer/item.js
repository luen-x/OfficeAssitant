import API from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";
import { DelCus } from "./popup/del-customer";
import { DelCusFail } from "./popup/del-customer-fail";

export default {
	data() {
		return {
			columns: [
				{
					title: '客户信息名称',
					key: 'process_name',
					minWidth: 150,
					tooltip: true,
				},
				{
					title: '创建时间',
					key: 'create_time',
					minWidth: 150,
				},
				{
					title: '流程介绍',
					key: 'describe',
					minWidth: 150,
					tooltip: true,
				},
				{
					title: "操作",
					key: "process_id",
					minWidth: 150,
					render: (h, params) => {
						return (
							<div class="g-operation g-c-blue-light ">
								{this.$auth[37] && <span onClick={() => this.handleEidt(params.row.process_id)}>
									编辑
								</span>}
								{(this.$auth[37] && this.$auth[38]) && <span class="g-m-lr-5">|</span>}
								{this.$auth[38] && <span onClick={() => this.handleClear(params.row.process_id)}
								>
									删除
								</span>}
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_PRODUCT_SET_CUSTOMER_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_PRODUCT_SET_CUSTOMER_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		DelList(val) {
			this.$request({
				url: API._CONTENT_PRODUCT_SET_CUSTOMER_LIST_DEL_GET,
				type: "GET",
				param: {
					process_id: val
				}
			}).then(res => {
				this.$Message.success(res.data);
				this.handleResetCur();
			}).catch(error => {
				this.$Message.error(error.msg);
				console.error(error);
				Confirm.popup({
					title: '删除失败',
					msg: '删除失败!当前有产品正在使用流程删除后会导致这些产品无法正常下单'
				}).then(res => {
					this.DelList(val);
				}).catch(res => {});
			});
		},
		// 列表编辑
		handleEidt(val) {
			this.$auth[37] && this.$router.push({ name: 'content-product-newcustomer', query: { request_id: val } });
		},
		// 列表删除
		handleClear(val) {
			this.$auth[38] && Confirm.popup({
				title: '确定删除',
				msg: '请问是否确定删除吗？'
			}).then(res => {
				this.DelList(val);
			}).catch(res => {});
		},
	}
};

