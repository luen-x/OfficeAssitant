import API from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";


export default {
	data() {
		return {
			columns: [
				{
					title: "流程名称",
					key: "process_name",
					tooltip: true,
					minWidth: 150
				},
				{
					title: "流程步骤",
					key: "process_num",
					minWidth: 150
				},
				{
					title: "创建时间",
					key: "create_time",
					minWidth: 150
				},
				{
					title: "流程介绍",
					key: "describe",
					tooltip: true,
					minWidth: 150
				},
				{
					title: "操作",
					key: "process_id",
					minWidth: 150,
					render: (h, params) => {
						return (
							<div class="g-operation g-c-blue-light ">
								{this.$auth[31] && <span onClick={() => this.handleEidt(params.row.process_id)}>编辑</span>}
								{(this.$auth[31] && this.$auth[32]) && <span class="g-m-lr-5">|</span>}
								{this.$auth[32] && <span onClick={() => this.handleClear(params.row.process_id)}>删除</span>}
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
			this.$store.commit("CONTENT_PRODUCT_SET_PROCESS_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("CONTENT_PRODUCT_SET_PROCESS_LIST_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},

		DelList(val) {
			 this.$request({
				url: API._CONTENT_PRODUCT_PROCESS_DEL_POST,
				type: "post",
				param: {
					process_id: val
				}
			}).then(res => {
				this.$Message.success(res.msg);
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
			this.auth[31] && this.$router.push({
				name: "content-product-newprocess",
				query: { request_id: val }
			});
		},
		// 列表删除
		handleClear(val) {
			this.auth[32] && Confirm.popup({
				title: '确定删除',
				msg: '请问是否确定删除吗？'
			}).then(res => {
				this.DelList(val);
			}).catch(res => {});
		}
	}
};
