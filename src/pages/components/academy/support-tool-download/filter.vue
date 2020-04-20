<template>
	<div class="v-academy-support-tool-download-filter js-filter">
		<div>
			<i-input
				v-model="material_name"
				clearable
				placeholder="请输入素材名称关键字搜索"
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 btn-red"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
			<span
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle"
			>
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="staff_name"
					clearable
					placeholder="请输入下载人姓名"
					style="width: 220px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<oa-input-tree
					:title="category_name"
					v-model="category_id"
					:data-source="categoryList"
					style="display:inline-block"
					@input="handleSearch"
					@on-change="handleclear"
				/>
				<!-- <i-poptip placement="bottom">
					<i-input
						v-model="categoryTitle"
						clearable
						placeholder="请选择所属类目"
						style="width: 220px"
						class="g-m-r-5"
						@on-change="handleSearch"
					/>
					<div slot="content" style="width: 190px">
						<i-tree
							ref="classTree"
							:data="categoryList"
							@on-select-change="getCheckedClassNode"
						/>
					</div>
				</i-poptip> -->
				<i-date-picker
					v-model="create_time_start"
					type="date"
					clearable
					placeholder="下载时间（开始）"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleStartTime"
				/>
				<i-date-picker
					v-model="create_time_end"
					type="date"
					placeholder="下载时间（结束）"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleEndTime"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Tree, Poptip } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import inputTree from '../_common/study-manage/input-tree';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-tree': Tree,
		'i-poptip': Poptip,
		'vc-expand': Expand,
		'oa-input-tree': inputTree
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			staff_name: String(query.staff_name || ''),
			material_name: String(query.material_name || ''),
			category_id: String(query.category_id || ''),
			show: false,
			create_time_start: String(query.create_time_start || ''),
			create_time_end: String(query.create_time_end || ''),
			categoryList: [],
			category_name: String(query.category_name || '')
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.handleCategoryList();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/support/tool/download',
				{
					...this.$route.query,
					keyword: this.keyword,
					staff_name: this.staff_name,
					material_name: this.material_name,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end,
					category_id: this.category_id,
					category_name: this.category_name,
					name: this.categoryTitle
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_TOOL_DOWNLOAD_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleStartTime(data) {
			this.create_time_start = data;
			this.handleSearch();
		},
		handleEndTime(data) {
			this.create_time_end = data;
			this.handleSearch();
		},
		handleclear(v) {
			if (!v.target.value) {
			 this.category_id = '';
				this.handleSearch();
			 }
		},
		getCheckedClassNode() {
			let treeArray = this.$refs.classTree.getSelectedNodes();
			this.category_id = treeArray[0].category_id;
			this.categoryTitle = treeArray[0].title;

			this.handleSearch();
		},
		handleCategoryList() {
			this.$request({
				url: API_ROOT._CONTENT_CATEGORY_LIST_GET,
				type: 'GET',
				param: {	}
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
			});
		}
	}
};

</script>

<style lang="scss" >
.v-academy-support-tool-download-filter {
	.btn-red{
		background: #e74854;
		color: #fff !important;
	}
	.ivu-tree{
		width: 100%;
		ul{
			font-size: 14px !important;
		}
		.__menu-hover:hover{
			background: #eff5fc;
		}
		.__menu-active{
			background: #818895;
			color: #fff;
		}
		.ivu-icon-ios-arrow-forward:before {
			content: "\F341" !important;
		}
	}
	.ivu-tree-arrow{
		position: relative;
		margin-right: 5px;
		z-index: 0;
		i {
			font-size: 18px;
		}
	}

	.ivu-tree-title{
		vertical-align: middle;
	}
}
</style>
