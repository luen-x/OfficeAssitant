<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight,}"
		mode="table"
		class="g-m-t-20 v-content-config-material-bank-list bank-wrapper"
		@row-click="handlePreview"
		@page-size-change="handleChangePageSize"
		@selection-change="handleSelectChange"
		@select-all="tableSelectAll"
	>
		<div v-if="this.$auth[1200]" slot="extra" class="g-flex-ac">
			<i-checkbox v-model="isSelect" @on-change="handleSelectAll">
				<span style="margin-left: 10px;">全选</span>
			</i-checkbox>
			<i-button @click="handleDelateAll">全部删除</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import { Checkbox, Button } from 'iview';
import { tableHeight } from '@extends/mixins/tableHeight';
import { Confirm } from "../_common/confirm";
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, tableHeight({ tab: false, extra: 125 })],
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
			return this.$store.state.contentConfigMaterialBank.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			this.isSelect = false;
			return this.request({
				url: 'CONTENT_CONFIG_MATERIAL_BANK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					is_control_role: 0,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error, 'error');
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
				this.request({
					url: '_CONTENT_CONFIG_MATERIAL_DEL_POST',
					type: 'POST',
					param: {
						material_ids: arr
					}
				}).then((res) => {
					this.$Message.success('删除成功！');
					this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
					this.isSelect = false;
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch((err) => {
				console.error(err);
			});
		},
		handleChangePageSize() {
			this.isSelect = false;
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
    .bank-wrapper {
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
