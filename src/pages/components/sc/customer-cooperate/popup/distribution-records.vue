<template>
	<div class="v-cooperate-dr">
		<i-table 
			ref="table"
			:columns="columns" 
			:data="data" 
			:border="false" 
			stripe
		/>
	</div>
</template>

<script>
import { Table } from "iview";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-distribution-records",

	components: {
		"i-table": Table
	},

	props: {
		staff_name: String,
		product_name: String
	},

	data() {
		return {
			currentId: "",
			visible: false,
			columns: [
				{
					title: "公司名称",
					key: "company_name",
					maxWidth: 140,
					tooltip: true
				},
				{
					title: "下单产品",
					key: "product",
					maxWidth: 140,
					tooltip: true
				},
				{
					title: "客户姓名",
					key: "customer",
					maxWidth: 100,
					tooltip: true
				},
				{
					title: "主负责人",
					key: "main_person_name",
					maxWidth: 120,
					tooltip: true
				},
				{
					title: "负责人",
					key: "distributes_person_name",
					maxWidth: 140,
					tooltip: true
				}, {
					title: "分配时间",
					key: "create_time",
					maxWidth: 120,
					tooltip: true
				}, {
					title: "合同编号",
					key: "contract_num",
					maxWidth: 140,
					tooltip: true
				}
			],
			data: [],
			page: 1,
			flag: false // 判断请求的数组是否为空
		};
	},

	watch: {
		staff_name(newvalue) {
			this.flag = false;
			this.data = [];
			this.page = 1;

			// 添加滚动事件
			this.$refs.table.$el.addEventListener(
				"scroll",
				this.scrollBottom
			);
			
			this.handleGetDate(1, newvalue, this.product_name);
		},

		product_name(newvalue) {
			this.flag = false;
			this.data = [];
			this.page = 1;

			// 添加滚动事件
			this.$refs.table.$el.addEventListener(
				"scroll",
				this.scrollBottom
			);
			
			this.handleGetDate(1, this.staff_name, newvalue);
		}
	},

	async mounted() {
		await this.handleGetDate(1);

		// 添加滚动事件
		this.$refs.table.$el.addEventListener(
			"scroll",
			this.scrollBottom
		);

		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$emit("sure");
		},

		handleCancel() {
			this.$emit("close");
		},

		handleGetDate(page, staff_name, product_name) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_DISTRIBUTE_RECORD_GET,
				type: "GET",
				param: {
					staff_name,
					product_name,
					page
				}
			}).then(res => {
				this.flag = false;
                
				if (res.data.list.length == 0) {
					// 移除滚动事件
					this.$refs.table.$el.removeEventListener(
						"scroll",
						this.scrollBottom
					);
				}

				this.data = [...this.data, ...res.data.list];
			}).catch(error => {
			});
		},

		scrollBottom(e) {
			if (this.flag) {
				return;
			}

			if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.flag = true;

				this.page++; 

				this.handleGetDate(this.page, this.staff_name, this.product_name);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.v-cooperate-dr{
	.ivu-table-wrapper {
		border: 0px;
		max-height: 250px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	/deep/ .ivu-table-overflowX {
		overflow-x: hidden;
	}

	/deep/ .ivu-table {
		th,
		td {
			border: none;
		}
	}

	/deep/ .ivu-table:after {
		width: 0;
	}

	/deep/ .ivu-table:before {
		height: 0;
	}
}
</style>


