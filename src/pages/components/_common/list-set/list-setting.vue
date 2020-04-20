<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="c-list-setting"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			列表设置
		</div>

		<div class="g-tabs-card">
			<i-tabs
				:value="tabs"
				type="card"
				@on-click="handleSwitchTabs"
			>
				<i-tab-pane v-if="sortUrl" name="sort" label="排序设置">
					<oa-sort ref="sortSetting" :sort-data="sortData"/>
				</i-tab-pane>
				<i-tab-pane name="search" label="筛选设置">
					<oa-search ref="searchSetting" :search-data="searchData"/>
				</i-tab-pane>
			</i-tabs>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import Sort from "./sort";
import Search from "./search";

export default {
	name: "sc-list-setting",

	components: {
		"i-modal": Modal,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-sort": Sort,
		"oa-search": Search
	},

	props: {
		name: String,
		sortData: Array,
		scenario: Number,
		sort_mutation: String,
		searchData: Object,
		search_mutation: String,
		sortUrl: String,
		searchUrl: String
	},

	data() {
		return {
			tabs: "",
			visible: false,
			type: 0
		};
	},

	mounted() {
		this.tabs = this.sortUrl ? "sort" : "search";
		this.visible = true;
	},

	methods: {
		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},

		handleOk() {    
			Promise.all(this.sortUrl ? [this.handleSortSetting(), this.handleSearchSetting()] : [this.handleSearchSetting()]).then(res => {
				this.$Message.success("设置成功");
				this.$emit("sure", true);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
        
		handleSortSetting() {
			let sorts = [];

			this.$refs.sortSetting.sort.forEach(item => {
				if (item.is_checked === 1) {
					sorts.push(item.sort_id);
				}
			});

			sorts.length != 0 && this.$request({
				url: this.sortUrl,
				type: "POST",
				param: {
					scenario: this.scenario,
					label: "sort",
					id: sorts
				},
				loading: false
			}).then(res => {
				this.$store.commit(this.sort_mutation, this.$refs.sortSetting.sort);
			}).catch(error => {
				if (this.$refs.modal) {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSearchSetting() {
			let search = {};

			search = JSON.parse(JSON.stringify(this.$refs.searchSetting.search));

			let searchId = [];

			search.title_show.forEach(item => {
				searchId.push(item.search_id);
			});

			this.$request({
				url: this.searchUrl,
				type: "POST",
				param: {
					scenario: this.scenario,
					label: "search",
					id: searchId
				},
				loading: false
			}).then(res => {
				this.$store.commit(this.search_mutation, search);
			}).catch(error => {
				if (this.$refs.modal) {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const ListSettingModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-list-setting{
	.ivu-tabs-tabpane{
		max-height: 307px;
		overflow-y: auto;
	}

	.ivu-modal{
		width: 680px !important;
	}

	.ivu-modal-content {
		width: 680px !important;
	}

	.ivu-modal-footer {
		border-top: none;
	}
}
</style>