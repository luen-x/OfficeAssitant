<template>
	<div class="v-sc-cooperate-dp">
		<i-table 
			ref="table"
			:columns="columns" 
			:data="data" 
			:border="false"
			stripe 
			@on-select="handleSelect"
			@on-select-cancel="handleSelectCancel"
			@on-row-click="handleRowClick"
		/>
	</div>
</template>

<script>
import { Table } from "iview";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-allocate-people",

	components: {
		"i-table": Table
	},

	props: {
		staff_name: String,
		product_name: String,
		make_id: Number,
		product_assign_id: Number
	},

	data() {
		return {
			spin: false,
			visible: false,
			ids: [],
			count: 0, // 计算是否超过5个人
			columns: [
				{
					type: 'selection',
					align: 'center',
					minWidth: 50
				},
				{
					title: "姓名",
					key: "staff_name",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "待完成单量",
					key: "wait_complete_count",
					minWidth: 90,
					tooltip: true
				},
				{
					title: "本月单量",
					key: "month_complete_count",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "今年单量",
					key: "year_complete_count",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "累计单量",
					key: "total_count",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "最近一单时间",
					key: "last_time",
					minWidth: 120,
					tooltip: true
				}
			],
			data: [],
			flag: false, // 判断请求的数组是否为空
			page: 1,
			select_arr: [] // 选中的数据
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

			this.loadData(newvalue, this.product_name, this.page);
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

			this.loadData(this.staff_name, newvalue, this.page);
		}
	},

	async mounted() {
		await this.loadData("", "", 1);

		// 添加滚动事件
		this.$refs.table.$el.addEventListener("scroll", this.scrollBottom);

		this.visible = true;
	},

	methods: {
		handleSelect(ids, row) {
			// 设置被选中的_checked值
			this.handleSetChecked(true, row);
		
			this.select_arr = [...this.select_arr, ...ids];

			let hash = {};

			this.select_arr.forEach(v => {
				if (!hash[v.staff_id]) {
					hash[v.staff_id] = v;
				}
			});

			this.$emit("event", Array.from(Object.values(hash)));
		},

		handleSelectCancel(selection, row) {
			// 取消被选中的_checked值
			this.handleSetChecked(false, row);

			let arr = [];
			this.select_arr.forEach(elemment => {
				if (row.staff_id != elemment.staff_id) {
					arr.push(elemment);
				}
			});

			this.select_arr = [...arr];

			this.$emit("event", selection);
		},

		loadData(staff_name, product_name, page) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_DISTRIBUTE_PERSON_GET,
				type: "GET",
				param: {
					staff_name,
					product_name,
					make_id: this.make_id,
					product_assign_id: this.product_assign_id,
					page
				},
				loading: false
			}).then(res => {
				this.flag = false;

				if (res.data.list.length == 0) {
					// 移除滚动事件
					this.$refs.table.$el.removeEventListener("scroll", this.scrollBottom);
				}

				this.count = 0;
				this.ids = [];

				res.data.list.forEach(item => {
					if (this.select_arr.length != 0) {
						item._checked = false;

						this.select_arr.forEach(elemment => {
							if (item.staff_id == elemment.staff_id) {
								item._checked = true;
							}
						});
					}

					if (item._checked) {
						this.ids.push(item);
					}
				});

				if (this.select_arr.length == 0) {
					this.select_arr = [...this.ids];
				}

				this.data.push(...res.data.list);
		
				this.$emit("event", Array.from(this.select_arr));
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		
		scrollBottom(e) {
			if (this.flag) {
				return;
			}

			if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.flag = true;

				this.page++; 

				this.loadData(this.staff_name, this.product_name, this.page);
			}
		},

		handleSetChecked(bool, row) {
			for (let item of this.data) {
				if (item.staff_id == row.staff_id) {
					item._checked = bool;
					break;
				}
			}
		},

		handleRowClick(row, index) {
			this.$refs.table.toggleSelect(index);
		}
	}
};
</script>

<style lang="scss">
.v-sc-cooperate-dp{
	.ivu-table-wrapper {
		border: 0px;
		max-height: 251px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.ivu-table-overflowX {
		overflow-x: hidden;
	}

	.ivu-table {
		th,
		td {
			border: none;
		}
	}

	.ivu-table:after {
		width: 0;
	}

	.ivu-table:before {
		height: 0;
	}

	.ivu-table {
		th:nth-of-type(1) {
			.ivu-checkbox-wrapper {
				display: none;
			}
		}
	}
}
</style>