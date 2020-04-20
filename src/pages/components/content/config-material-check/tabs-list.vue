<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="v-content-config-material-check-tab"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
			style="border-radius:none"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:table-opts="{height: tableHeight,}"
				:history="true"
				:load-data="loadData"
				class="v-content-config-material-check-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@row-click="handlePreview"
				@selection-change="handleSelectChange"
				@select-all="tableSelectAll"
			>
				<div v-if="$auth[1208]" slot="extra" class="g-flex-ac">
					<i-checkbox v-model="isSelect" @on-change="handleSelectAll">
						<span style="margin-left: 10px;">全选</span>
					</i-checkbox>
					<i-button @click="handleDownAll">批量下载</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { downloadFile } from '@utils/download';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'i-checkbox': Checkbox
	},
	mixins: [item, tableHeight({ tab: false, extra: 100 }), autoFix()],
	data() {
		const { query } = this.$route;
		return {
			isSelect: '',
			selection: [],
			tableLenght: '',
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: '',
		};
	},
	computed: {
		listInfo() {
			this.select();
			return this.$store.state.contentConfigMaterialCheck.listInfo;
		},
		tabs() {
			return [
				{ label: `待审核${this.count.check_count || 0}`, value: '1' },
				{ label: `已通过${this.count.pass_count || 0}`, value: '2' },
				{ label: `已驳回${this.count.refuse_count || 0}`, value: '3' }
			];
		}
	},
	methods: {
		select() {
			this.isSelect = false;
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			this.isSelect = false;
			return this.request({
				url: 'CONTENT_CONFIG_MATERIAL_CHECK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = res.data;
				const count = [this.count.check_count, this.count.pass_count, this.count.refuse_count];
				this.resetType('1', count, '/content/config/material/check', { tabs: this.tabs });
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleChange(type) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(false);
			this.isSelect = false;
			// this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAllCancel();
			this.type = type;
			this.selection = [];
			this.tableLenght = "";


			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type],
				fixPosition: false,
			};
			this.$router.replace(getHashUrl('/content/config/material/check', { ...query }));
		},
		handleChangePageSize() {
			this.isSelect = false;
			this.$store.commit('CONTENT_CONFIG_MATERIAL_CHECK_LIST_INIT');
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
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		downloadCreate(material_id) {
			this.$request({
				url: '_SALE_LIBRARY_DOWNLOAD_CREATE_POST',
				type: 'post',
				param: {
					material_ids: [material_id]
				},
			}).then((data) => {});
		},
		handleDownAll(v) {
			if (this.selection.length > 0) {
				this.selection.forEach(ele => {
					if (ele.type == 2) {
						this.$request({
							url: '_SALE_LIBRARY_FOLDER_ALL_FILE_GET',
							type: 'post',
							param: {
								material_id: ele.material_id
							},
						}).then((data) => {
							this.downloadCreate(ele.material_id);
							data.data.map(it => {
								downloadFile({ fileName: it.path }).then((res) => {

								}).catch((err) => {

								});
								return;
							});
						});
					} else {
						downloadFile({ fileName: ele.file_url }).then((data) => {
							this.downloadCreate(ele.material_id);
						}).catch(err => {
							console.error(err);
						});
					}
				});
			} else {
				this.$Message.error('下载前请先选择');
			}
		}
	}
};

</script>

<style lang="scss">
    .v-content-config-material-check-tab {
        /deep/ .ivu-tabs-bar {
            /deep/ .ivu-tabs-tab {
                border-radius: none !important;
            }
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
