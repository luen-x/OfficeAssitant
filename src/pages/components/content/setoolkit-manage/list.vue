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
		class="g-m-t-20 v-content-setoolkit-manage-list setoolkit-wrapper"
		@page-size-change="handleChangePageSize"
		@selection-change="handleSelectChange"
		@select-all="tableSelectAll"
		@row-click="handlePreview"
	>
		<div v-if="this.$auth[616]" slot="extra" class="g-flex-ac">
			<i-checkbox
				v-model="isSelect"
				@on-change="handleSelectAll"
			>
				<span style="margin-left: 10px;">全选</span>
			</i-checkbox>
			<i-button @click="handleDelateAll">全部删除</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Paging, CreatePortal } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
// item
import { Checkbox, Button } from 'iview';
import item from './item';
import { Confirm } from "../_common/confirm";

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			footer: true,
			extraHeight: 50
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
			tableLenght: '',
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentSetoolkitManage.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let categoryId = Number;
			let isHaveid = getParseUrl().query;
			this.isSelect = false;
			this.selection = [];
			if (!isHaveid.category_id) {
				categoryId = this.classList[0].category_id;
			} else {
				categoryId = getParseUrl().query.category_id;
			}
			return this.request({
				url: 'CONTENT_SETOOLKIT_MANAGE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					kit_type: 1,
					is_control_role: 0,
					category_id: categoryId
				},
			}).then((res) => {

			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_SETOOLKIT_MANAGE_LIST_INIT');
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
				showBtn: true
			}).then(() => {
				// 进行指派
				this.request({
					url: '_CONTENT_MATERIAL_BATCH_DELATE_POST',
					type: 'POST',
					param: {
						kit_material_ids: arr
					}
				}).then((res) => {
					this.$Message.success('删除成功！');
					this.$store.commit('CONTENT_SETOOLKIT_MANAGE_LIST_INIT');
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch((err) => {
				console.error(err);
			});
		}
	}
};

</script>

<style lang="scss" >
.setoolkit-wrapper{
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
