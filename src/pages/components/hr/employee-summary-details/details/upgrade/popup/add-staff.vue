<template>
	<div>
		<div class="g-flex g-m-b-20">
			<i-input
				v-model="search"
				placeholder="请输入员工姓名/手机"
				style="width: 220px"
				class="g-m-r-10"
				@on-enter="handleSearch"
				@on-change="handleSearch"
			/>
			<i-cascader
				v-model="depart_id"
				:data="departArr"
				:change-on-select="true"
				style="width: 220px"
				class="g-m-r-10"
				clearable
				transfer
				trigger="click"
				placeholder="请选择部门"
				@on-change="handleChangeDepart"
			/>
			<i-button type="primary" @click="handleSearch">搜索</i-button>
		</div>
		<div class="v-hr-employee-mentor-select-add-mentor">
			<i-table
				ref="table"
				:columns="columns"
				:data="data"
				:loading="loading"
				no-filtered-data-text="暂无搜索结果"
				no-data-text="暂无搜索结果"
				@on-select="handleSelect"
				@on-select-cancel="handleSelectCancel"
				@on-row-click="handleRowClick"
			/>
		</div>
	</div>
</template>

<script>
import {
	Modal,
	Button,
	Input,
	Table,
	Checkbox,
	Icon,
	Select,
	Option,
	Poptip,
	Page,
	Cascader
} from "iview";
import { debounce } from "lodash";
import { getParseUrl, getHashUrl, initTreeData } from "@utils/utils";
import API from "@stores/apis/root";

export default {
	name: "oa-choose",
	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-input": Input,
		"i-table": Table,
		"i-icon": Icon,
		"i-select": Select,
		"i-option": Option,
		"i-page": Page,
		"i-checkbox": Checkbox,
		"i-cascader": Cascader
	},
	props: {
		staff_id: String,
		proTeamStaffArr: Array,
	},
	data() {
		return {
			visible: false,
			data: [],
			flag: false, // 判断请求的数组是否为空
			page: 1,
			select_arr: [], // 选中的数据
			depart_id: [],
			search: "",
			departArr: [],
			ids: [],
			loading: false,
			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					title: "姓名",
					key: "staff_name",
					width: 120,
				},
				{
					title: "手机号码",
					key: "mobile",
					width: 120
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 120
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 120
				}
			]
		};
	},
	watch: {
		search(newvalue) {
			this.flag = false;
			this.data = [];
			this.page = 1;

			// 添加滚动事件
			this.$refs.table.$el.addEventListener("scroll", this.scrollBottom);

			this.loadData(this.page);
		},

		depart_id(newvalue) {
			this.flag = false;
			this.data = [];
			this.page = 1;

			// 添加滚动事件
			this.$refs.table.$el.addEventListener("scroll", this.scrollBottom);

			this.loadData(this.page);
		}
	},
	async mounted() {
		await this.loadData(1);
		// 添加滚动事件
		this.$refs["table"].$el.addEventListener("scroll", this.scrollBottom);
		this.visible = true;
		await this.loadDepart(this.$global.staff.depart_id);
	
		await this.handleSelect(this.proTeamStaffArr);
	},
	methods: {
		loadDepart(depart_id) {
			this.$request({
				url: "_HR_EMPLOYEE_CI_DEPART_SON_GET",
				type: "GET",
				param: {
					depart_id
				},
				loading: false
			}).then(res => {
				this.departArr = initTreeData(
					res.data,
					"depart_id",
					"depart_name"
				);
			}).catch(err => {});
		},
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
			this.handleGetIds(Array.from(Object.values(hash)));
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
			this.handleGetIds(selection);
		},

		loadData(page) {
			const { query = {} } = this.$route;
			this.$request({
				url: API._HR_EMPLOYEE_PRO_INFO_STAFF_LIST_GET,
				type: "GET",
				loading: false,
				param: {
					page: page || 1,
					search: this.search,
					staff_id: this.staff_id,
					depart_id: this.depart_id
						? this.depart_id.map(item => Number(item))
						: ""
				}
			})
				.then(res => {
					this.flag = false;
					if (page == 1 || page == undefined) {
						if (this.search || this.depart_id.length != 0) {
							if (res.data.list.length == 0) {
								this.data = [];
								// 移除滚动事件
								this.$refs.table.$el.removeEventListener(
									"scroll",
									this.scrollBottom
								);
							} else {
								this.data = [];
							}
						} else {
							this.data = [];
						}
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
					let staffArr = _.uniqWith(res.data.list, _.isEqual); // 去重
					this.data.push(...staffArr);
					this.handleGetIds(Array.from(this.select_arr));
				})
				.catch(error => {
					this.$Message.error(error.msg);
				});
		},
		scrollBottom(e) {
			if (this.flag) {
				return;
			}
			if (
				e.target.scrollTop + e.target.clientHeight
                > e.target.scrollHeight - 10
			) {
				this.flag = true;
				this.page++;
				this.loadData(this.page);
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
		handleGetIds(value) {
			this.ids = value;
		},
		handleRowClick(row, index) {
			this.$refs.table.toggleSelect(index);
		},
		handleSearch(e) {
			this.loadData();
		},
		handleChangeDepart(val) {
			this.depart_id = val;
			this.loadData();
		}
	}
};
</script>
<style lang="scss" >
.v-hr-employee-mentor-select-add-mentor {
	th:nth-child(1)>.ivu-table-cell {
		display:none;
	}
	.ivu-table-wrapper {
        border: 0px;
        max-height: 242px !important;
        overflow-x: hidden;
        overflow-y: auto;
    }
    ._btn {
        width: 47px;
        height: 20px;
        border-radius: 4px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        text-align: center;
    }
    ._recommend {
        @extend ._btn;
        border: 1px solid #f39700;
        color: #f39700;
    }
    ._master {
        @extend ._btn;
        border: 1px solid #4787f2;
        color: #4787f2;
    }
}
</style>

