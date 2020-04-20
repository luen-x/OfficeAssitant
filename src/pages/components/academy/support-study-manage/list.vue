<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight}"
		mode="table"
		class="g-m-t-20 v-academy-support-study-manage-list"
		@row-click="handlePreview"
		@page-size-change="handleChangePageSize"
		@page-change="handleChangePage"
		@selection-change="handleSelectChange"
		@select-all="tableSelectAll"
	>
		<div v-if="$auth[1622]||$auth[1623]" slot="extra" class="g-flex-ac">
			<i-checkbox v-model="isSelect" @on-change="handleSelectAll">
				<span style="margin-left: 10px;">全选</span>
			</i-checkbox>
			<i-button v-if="$auth[1622]" @click="handleDelateAll">全部删除</i-button>
			<i-button v-if="$auth[1623]" style="margin-left:7px" @click="handleChangeCategory">类目调整</i-button>
			<i-button v-if="$auth[1669]" style="margin-left:7px" @click="handleChangePower">权限调整</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import { Checkbox, Button } from 'iview';
import { tableHeight } from '@extends/mixins/tableHeight';
import { Confirm } from "@components/_common/confirm/confirm";
import { changeCategory } from './popup/change-category.vue';
import { AddMaterial } from "./popup/add-material";
import { ChangePower } from "../support-tool-manage/popup/change-power";
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, tableHeight({ tab: false, extra: 80 })],
	data() {
		const { query } = this.$route;

		return {
			isSelect: '',
			selection: [],
			tableLenght: '',
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academySupportStudyManage.listInfo;
		}
	},
	watch: {
		'$route.query.category_id': function (v) {
			this.selection = [];
		}
	},
	methods: {
	    async loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			const { data } = await this.loadCategoryList();
			this.isSelect = false;
			return this.request({
				url: 'ACADEMY_SUPPORT_STUDY_MANAGE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					category_id: query.category_id || data[0].category_id,
					category_name: query.category_name || data[0].category_name,
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		loadCategoryList() {
			return this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_ALL_GET',
				type: 'GET',
			});
		},
		tableSelectAll(res) {
			this.isSelect = true;
			this.tableLenght = res.length;
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

		handleChangePower() {
			let { query = {} } = getParseUrl();
			if (!this.selection.length) {

				this.$Message.warning('请先选择要调整权限的素材');
				return;
			}
			ChangePower.popup({
				material_ids: this.selection.map((e) => e.material_id),
				material_list: this.selection.map((e) => { return { material_name: e.material_name, file_url: e.file_url }; }),
				old_category_name: query.category_name || this.classList[0].title,
				api: '_ACADEMY_SUPPORT_LIBRARY_ADJUST_POWER_POST'
			}).then(() => {
				this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
			}).catch((err) => {
				console.error(err);
			});
		},
		handleChangeCategory() {
			let { query = {} } = getParseUrl();
			if (!this.selection.length) {
				this.$Message.warning('请先选择要批量更改类目的素材。');
				return;
			}
			changeCategory.popup({
				material_ids: this.selection.map((e) => e.material_id),
				material_list: this.selection.map((e) => { return { material_name: e.material_name, file_url: e.file_url }; }),
				old_category_name: query.category_name || this.classList[0].title,
				api: '_ACADEMY_SUPPORT_LIBRARY_ADJUST_POWER_POST'
			}).then(() => {
				this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
			}).catch((err) => {
				console.error(err);
			});
		},
		handleDelateAll() {
			if (!this.selection.length) {
				this.$Message.warning('请先选择要批量删除的素材。');
				return;
			} let arr = [];
			this.selection.map((e) => {
				arr.push(e.material_id);
				return;
			});
			Confirm.popup({
				title: '提示',
				msg: '你是否确认删除所选素材？',
			}).then(() => {
				this.request({
					url: '_ACADEMY_SUPPORT_LIBRARY_MATERIAL_DELETE_GET',
					type: 'POST',
					param: {
						material_ids: arr
					}
				}).then((res) => {
					this.$Message.success('删除成功！');
					this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
					this.isSelect = false;
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch((err) => {
				console.error(err);
			});
		},
		handleChangePage() {
			this.isSelect = false;
			this.selection = [];
		},
		handleChangePageSize() {
			this.isSelect = false;
			this.selection = [];
			this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
    .v-academy-support-study-manage-list {
        &.vc-paging .__footer {
            position: absolute !important;
            width: calc(100% - 335px) !important;
        }
        ._inline-block {
            display: inline-block;
            vertical-align: middle;
        }
        ._edit {
            color: #2397f9;
            padding: 2px 8px 2px 0px;
            cursor: pointer;
        }
        ._delete {
            color: #2397f9;
            padding: 2px 8px;
            cursor: pointer;
        }
        ._hold {
            background: #2397f9;
            display: inline-block;
            width: 1px;
            height: 10px;
        }
		._left-border::after{
			content: "|";
			color:'#515a6e';
		}
		._left-border:last-child::after{
			content: "";
		}
    }
</style>