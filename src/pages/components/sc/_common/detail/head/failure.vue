<template>
	<div class="v-sc-customer-failure">
		<i-table 
			ref="table"
			:columns="columns"
			:data="data"
			:border="false"
			stripe
			@on-row-click="handleRowClick"
		/>
	</div>
</template>

<script>
import { Table, Radio } from "iview";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-failure",
    
	components: {
		"i-table": Table
	},

	props: {
		product_id: Number,
		project_id: Number,
		type: String,
		searchs: String
	},
    
	data() {
		return {
			spin: false,
			new_project_id: "", // 	新项目id
			new_contract_id: "", // 新合同id
			new_contract_num: "", // 新合同编号
			columns: [
				{
					title: " ",
					key: "radio",
					minWidth: 45,
					render: (h, params) => {
						let id = params.row.project_id;
						let defaultS = false;

						if (this.new_project_id == id) {
							defaultS = true;
						} else {
							defaultS = false;
						}

						let self = this;

						return h(Radio, {
							style: {
								marginRight: "5px"
							},
							props: {
								value: defaultS
							},
							on: {
								input() {		
									self.new_project_id = params.row.project_id;
                                    
									self.obj = {
										new_project_id: params.row.project_id,
										new_contract_id: params.row.contract_id,
										new_contract_num: params.row.contract_num
									};
								}
							}
						});
					}
				},
				{
					title: "公司名称",
					key: "company",
					minWidth: 120,
					tooltip: true
				},
				{
					title: "合同编号",
					key: "contract_num",
					width: 120,
					tooltip: true
				},
				{
					title: "下单产品",
					key: "product",
					minWidth: 120,
					tooltip: true
				},
				{
					title: "客户姓名",
					key: "customer",
					width: 90,
					tooltip: true
				},
				{
					title: "分单时间",
					key: "distribute_time",
					width: 105,
					render: (h, params) => {
						return h("div", {}, params.row.distribute_time.split(" ")[0]);
					}
				},
				{
					title: "主负责人",
					key: "main_person",
					width: 90,
					tooltip: true
				},
				{
					title: "负责人",
					key: "child_person",
					minWidth: 80,
					tooltip: true
				}
			],
			data: [],
			flag: false,
			page: 1,
			obj: {}
		};
	},
    
	watch: {
		obj(val) {
			this.$emit("event", val);
		},

		searchs(val) {
			this.data = [];
			// 添加滚动事件
			this.$refs.table.$el.addEventListener(
				"scroll",
				this.scrollBottom
			);

			this.handleGetData(1, val);
		}
	},
    
	async mounted() {
		await this.handleGetData(1, this.searchs);

		// 添加滚动事件
		this.$refs.table.$el.addEventListener(
			"scroll",
			this.scrollBottom
		);
	},
    
	methods: {
		handleGetData(page, search) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_RELATION_PROJECT_GET,
				type: "GET",
				param: {
					project_id: this.project_id,
					product_id: this.product_id,
					type: this.type,
					page,
					search
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

				res.data.list.forEach(item => {
					item.checked = false;
				});
				
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

				this.handleGetData(this.page);
			}
		},

		handleRowClick(row) {
			this.new_project_id = row.project_id;
			this.obj.new_project_id = row.project_id;
			this.obj.new_contract_id = row.contract_id;
			this.obj.new_contract_num = row.contract_num;

			this.$emit("event", this.obj);
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-failure{
    .ivu-table-wrapper {
        max-height: 271px;
        border: none;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .ivu-table {
        th,td {
            border: none;
        }
    }

    .ivu-table:after {
        width: 0;
    }

	.ivu-table-overflowX {
		overflow-x: hidden; 
	}

    .ivu-table:before {
        height: 0;
    }
}
</style>