<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="type === 1?'添加徒弟':'分配徒弟'"
		width="680"
		class="v-hr-personnel-member-relationship-add-apprentice"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div v-if="type===1" class="g-fs-14 g-m-b-20" style="color:#E84C57">选择员工并作为{{ master_name }}的徒弟。</div>
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
		<div>
			<i-table
				ref="table"
				:columns="columns"
				:data="data"
				:loading="loading"
				width="646"
				no-filtered-data-text="暂无搜索结果"
				no-data-text="暂无搜索结果"
				@on-select="handleSelect"
				@on-select-cancel="handleSelectCancel"
				@on-row-click="handleRowClick"
			/>
		</div>
	</i-modal>
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
import { CreatePortal } from "wya-vc";
import { debounce } from "lodash";
import { getParseUrl, getHashUrl, initTreeData } from "@utils/utils";
import { services, staffByMutiTermNew } from "@stores/services/hr";
import API from "@stores/apis/root";

export default {
	name: "v-hr-personnel-member-relationship-add-apprentice",
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
		master_name: String,
		master_id: Number,
		type: Number
	},
	data() {
		return {
			visible: false,
			data: [],
			departArr: [],
			flag: false, // 判断请求的数组是否为空
			page: 1,
			select_arr: [], // 选中的数据
			depart_id: [],
			search: "",
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
					minWidth: 180,
					align: 'left',
					render: (h, params) => {
						return (
							<div class="g-flex _name">
								{params.row.is_has_master === 1 && (
									<div class="_master">有师傅</div>
								)}
								{params.row.is_has_master === 0 && (
									<div class="_btn" />
								)}
								<div class="g-m-l-5">
									{params.row.staff_name}
								</div>
							</div>
						);
					}
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
		handleOk() {
			if (this.type === 2) {
				this.$Modal.confirm({
					title: "",
					content:
                        "如果选中的员工有归属的师傅，将会转移至其它的师傅，是否继续操作？",
					onOk: () => {
						this.loadSaveData();
					},
					onCancel: () => {
						this.$refs.modal.buttonLoading = false;
					}
				});
			} else {
				this.loadSaveData();
			}
		},
		loadSaveData() {
			let marstURL = API._HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_SAVE_MASTER_POST;
			let assignURL = API._HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_ASSIGN_APPRENTICE_POST;
			let url = this.type === 1 ? marstURL : assignURL;
			this.$request({
				url,
				type: "POST",
				loading: false,
				param: {
					master_id: this.master_id,
					apprentice_id: this.ids.map(item => {
						return item.staff_id;
					})
				}
			}).then(res => {
				this.visible = false;
				this.$store.commit(
					"HR_PERSONNEL_MEMBER_RELATIONSHIP_LIST_INIT"
				);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
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
			let addApprenticeUrl = API._HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_ADD_APPRENTICE_GET;
			let assingApprenticeUrl = API._HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_ASSIGN_APPRENTICE_LIST_GET;
			let url = this.type === 1 ? addApprenticeUrl : assingApprenticeUrl;
			this.$request({
				url,
				type: "GET",
				loading: false,
				param: {
					page: page || 1,
					master_id: this.master_id,
					search: this.search,
					depart_id: this.depart_id
						? this.depart_id.map(item => Number(item))
						: ""
				}
			}).then(res => {
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
			}).catch(error => {
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
export const AddApprentice = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" >
.v-hr-personnel-member-relationship-add-apprentice {
	th:nth-child(1)>.ivu-table-cell {
		display:none;
	}
	th:nth-child(2)>.ivu-table-cell {
		padding-left:56px!important;
	}
	td:nth-child(2)>.ivu-table-cell {
		padding-left:2px!important;
	}
    .ivu-table-wrapper {
        border: 0px;
        max-height: 242px;
        overflow-x: hidden;
        overflow-y: auto;
    }
	.ivu-table-overflowX{
		overflow-x:hidden!important;
	}
    ._btn {
        width: 47px;
        height: 20px;
        border-radius: 4px;
        font-size: 12px;
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
	.ivu-modal-footer{
		margin-top: -16px!important;
	}
}
</style>

