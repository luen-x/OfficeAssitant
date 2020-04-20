<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="选择素材"
		class="v-hr-course-choose-material"
		width="720"
		@on-ok="handleConfirm"
		@on-cancel="handleCancel"
	>
		<div style="height:540px">
			<div>
				<i-input
					slot="prefix"
					v-model="query.search"
					placeholder="请输入素材名称"
					style="width: 180px"
					class="g-m-r-5"
					clearable
					@on-change="handleClear"
					@on-enter="handleSearch"
				/>
				<i-cascader
					v-model="query.category_ids"
					:data="materialCategory"
					change-on-select
					clearable
					class="g-m-r-5"
					placeholder="请选择类目"
					style="width: 180px"
					@on-change="handleSearch"
				/>
				<i-button
					slot="prefix"
					type="primary"
					class="g-red-btn"
					@click="handleSearch"
				>搜索</i-button>
			</div>
			<vc-paging
				ref="tableTarget"
				:show="showList"
				:columns="columns"
				:data-source="listInfo.data"
				:total="listInfo.total"
				:reset="listInfo.reset"
				:history="false"
				:load-data="loadData"
				:footer="!inLoading"
				:table-opts="{height: tableHeight, highlightRow: true}"
				:page-opts="{
					showTotal: false,
					showSizer: true,
					showElevator: false,
					placement: 'top',
					pageSizeOpts: [10, 20, 30]
				}"
				mode="table"
				class="g-m-t-20"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div slot="extra" class="g-flex-ac">
					<i-checkbox v-model="isAll" @on-change="handleIsAll">全选</i-checkbox>
					<span>已勾选: <span class="g-c-blue-mid">{{ selects.length }} 个素材</span></span>
				</div>
			</vc-paging>
		</div>


	</i-modal>
</template>

<script>
import { Modal, Button, Input, Table, Checkbox, Icon, Select, Option, Poptip, Page, Cascader } from 'iview';
import { debounce } from 'lodash';
import API from '@stores/apis/root';
import { Paging, CreatePortal } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import keepSelect from '@extends/mixins/keepSelects';
import checkAll from '@extends/mixins/checkAll';

import { Confirm } from '@common/confirm/confirm';
import { services } from '@stores/services/hr';

const config = {
	sale: {
		listUrl: "_SALE_LIBRARY_MATERIAL_LIST_GET",
		param: {
			is_control_role: 1,
			is_course_select: 1
		}
	},
	hr: {
		listUrl: "CONTENT_CONFIG_MATERIAL_BANK_LIST_GET",
		param: {
			is_control_role: 0,
			is_course_select: 0
		}
	}
};

export default {
	name: "oa-choose",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-input': Input,
		'i-table': Table,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-page': Page,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
		'i-cascader': Cascader
	},
	mixins: [
		keepSelect({ rowKey: 'material_id' }),
		services.saleMaterialCategory(),
		services.hrMaterialCategory()

	],
	props: {
		author: {
			type: String,
			default: "hr"
		},
		materials: {
			type: Array,
			default: () => []
		},
	},

	data() {
		return {
			visible: false,
			query: {
				...config[this.author].param,
				search: '',
				category_id: '',
				category_ids: [],
				material_type: ''
			},
			checkAll: false,
			showList: false,
			inLoading: false,
			selects: [...this.materials],
			curPage: 0,
			columns: [
				{
					type: "selection",
					width: 60,
					fixed: "left",
					className: "g-pd-l-10",
					tooltip: true
				},
				{
					title: '素材名称',
					key: 'material_name',
					minwWidth: 200,
					fixed: "left",
					tooltip: true

				},
				{
					title: '类目名称',
					key: 'category_name',
					minwWidth: 100,
					tooltip: true
				}
			],

		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentConfigMaterialBank.listInfo;
		},
		tableHeight() {
			if (this.listInfo.data[this.curPage] && this.listInfo.data[this.curPage].length > 10) {
				return 450;
			} else {
				return undefined;
			}
		},
		materialCategory() {
			if (this.author == 'hr') {
				return this.hrMaterialCategory;
			} else {
				return this.saleMaterialCategory;
			}
		}
	},
	watch: {
		'query.category_ids': function (val) {
			this.query.category_id = val[val.length - 1] || '';
		}

	},
	created() {
	},
	mounted() {
		this.visible = true;
		setTimeout(() => {
			this.showList = true;
		}, 100);
	},
	destroyed() {
		this.handleResetFirst();

	},
	methods: {
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handleConfirm: debounce(function () {
			this.$refs.modal.buttonLoading = false;
			if (this.selects.length !== 0) {
				this.handleOk(this.selects);
			}

		}, 200),
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadData(page, pageSize) {
			this.isAll = false;
			const query = this.query;
			this.inLoading = true;
			return this.request({
				url: config[this.author].listUrl,
				redirect: 'CONTENT_CONFIG_MATERIAL_BANK_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...query,
					category_ids: '',
					page: this.curPage ? page : 1,
					pageSize
				},
			}).then((res) => {
				this.afterLoadData(res);

			}).catch((error) => {
				console.error(error);
			}).finally(() => {
				this.inLoading = false;
			});
		},
		beforeChangePageSize() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		beforePageChange(page) {
			this.curPage = page;
		},
		handleSearch() {
			this.handleResetFirst();
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleResetFirst() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
		}

	}
};
export const ChooseMaterial = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" >
.v-hr-course-choose-material{
	.vc-paging {
		margin-bottom: 0px;
		.__footer {
			position: relative;
			width: auto !important ;
			// border: 1px solid lightgrey;
			box-shadow: none;
			border-top: none;
			padding-left: 28px !important;
		}
	}

}
</style>

