<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight,highlightRow:true}"
		mode="table"
		class="g-m-t-20 v-academy-support-tool-manage-list satoolkit-wrapper"
		@page-size-change="handleChangePageSize"
		@page-change="handleChangePage"
		@selection-change="handleSelectChange"
		@select-all="tableSelectAll"
		@row-click="handlePreview"
	>
		<div v-if="$auth[1608]||$auth[1609]" slot="extra">
			<i-checkbox v-model="isSelect" @on-change="handleSelectAll">
				<span style="margin-left: 10px;">全选</span>
			</i-checkbox>
			<i-button v-if="$auth[1608]" @click="handleDelateAll">全部删除</i-button>
			<i-button v-if="$auth[1609]" class="g-m-l-5" @click="handleChangeCategory">类目调整</i-button>
			<i-button v-if="$auth[1668]" class="g-m-l-5" @click="handleChangePower">权限调整</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Paging, CreatePortal } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import { Checkbox, Button } from 'iview';
import { Confirm } from "@components/_common/confirm/confirm";
import { changeCategory } from './popup/change-category.vue';
import item from './item';
import { AddMaterial } from "./popup/add-material";
import { ChangePower } from "./popup/change-power";

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},

	// const PAGE_TITLE = 57; // 页面头部
	// const NAV1 = 47; // 一级导航
	// const NAV2 = 40; // 二级导航
	// const TAB = 78; // tab 42 + margin-top 20 + margin-bottom 16
	// const FOOTER = 65; // footer 45 + margin-top 20
	// const EXTRA = 10; // 全局高度补正

	// const MIN_HEIGHT = 230; // 最小高度

	// const TABLEHEAD = 44;
	mixins: [
		item,
		tableHeight({
			tab: false,
			extra: 50
		})
	],
	props: {
		classList: Array
	},
	data() {
		const { query } = this.$route;
		return {
			selection: [],
			isSelect: false,
			category: [],
			tableLenght: '',
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academySupportToolManage.listInfo;
		}
	},
	watch: {
		'$route.query.category_id': function (v) {
			this.selection = [];
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let categoryId = Number;
			let categoryName = "";
			let isHaveid = getParseUrl().query;
			this.isSelect = false;
			if (!isHaveid.category_id) {
				categoryId = this.classList[0].category_id;
				categoryName = this.classList[0].category_name;
			} else {
				categoryId = getParseUrl().query.category_id;
			}
			return this.request({
				url: 'ACADEMY_SUPPORT_TOOL_MANAGE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					type: 2,
					category_id: categoryId,
					category_name: categoryName
				},
			}).then((res) => {

			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePage() {
			this.isSelect = false;
			this.selection = [];
		},
		handleChangePageSize() {
			this.isSelect = false;
			this.selection = [];
			this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_INIT');
		},
		handleSelectChange(res) {
			this.selection = res;
			if (res.length === 0 || this.tableLenght > res.length) {
				this.isSelect = false;
			} else if (this.tableLenght === res.length) {
				this.isSelect = true;
			}
		},
		handleSelectAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		tableSelectAll(res) {
			this.isSelect = true;
			this.tableLenght = res.length;
		},
		handleDelateAll() {
			if (!this.selection.length) {
				this.$Message.warning('请先选择要批量删除的素材。');
				return;
			}
			let arr = [];
			this.selection.map((e) => {
				arr.push(e.material_id);
				return;
			});
			Confirm.popup({
				title: '提示',
				msg: '你是否确认删除所选素材？',
			}).then(() => {
				// 进行指派
				this.request({
					url: '_ACADEMY_SUPPORT_TOOL_MATERIAL_DELETE_GET',
					type: 'POST',
					param: {
						material_ids: arr
					}
				}).then((res) => {
					this.$Message.success('删除成功！');
					this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_INIT');
					this.isSelect = false;
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch((err) => {
				console.error(err);
			});
		},
		handleChangeCategory() {
			if (!this.selection.length) {
				this.$Message.warning('请先选择要批量更改类目的素材。');
				return;
			}
			let arr = [];
			this.selection.map((e) => {
				arr.push(e.material_id);
				return;
			});
			let { query = {} } = getParseUrl();
			changeCategory.popup({
				material_ids: arr,
				old_category_name: query.category_name || this.classList[0].title
			}).then(() => {
				this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_INIT');
			}).catch((err) => {
				console.error(err);
			});
		},
		handleChangePower() {
			if (!this.selection.length) {
				this.$Message.warning('请先选择要调整权限的素材');
				return;
			}
			// let material_list= this.selection.map((e) =>{return{material_name:e.material_name,file_url:e.file_url}})
			let { query = {} } = getParseUrl();
			ChangePower.popup({
				material_ids: this.selection.map((e) => e.material_id),
				material_list: this.selection.map((e) => { return { material_name: e.material_name, file_url: e.file_url }; }),
				old_category_name: query.category_name || this.classList[0].title,
				api: '_ACADEMY_SUPPORT_TOOL_ADJUST_POWER_POST'
			}).then(() => {
				this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_INIT');
			}).catch((err) => {
				console.error(err);
			});
		}
	}
};

</script>

<style lang="scss">
.satoolkit-wrapper{
	&.vc-paging .__footer{
		position: absolute !important;
		width: calc(100% - 335px) !important;
	}
	._inline-block{
		display: inline-block;
		vertical-align: middle;
	}
}
</style>

