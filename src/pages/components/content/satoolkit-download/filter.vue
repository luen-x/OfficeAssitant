<template>
	<div class="v-sale-satoolkit-download-filter js-filter">
		<div>
			<i-input
				v-model="keyword"
				clearable
				placeholder="请输入关键字搜索"
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
				<i-poptip placement="bottom">
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
				</i-poptip>
				<i-date-picker
					v-model="start_time"
					type="date"
					clearable
					placeholder="下载时间（开始）"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleStartTime"
				/>
				<i-date-picker
					v-model="end_time"
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

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-tree': Tree,
		'i-poptip': Poptip,
		'vc-expand': Expand,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			category_id: String(query.name || ''),
			show: false,
			start_time: String(query.start_time || ''),
			end_time: String(query.end_time || ''),
			categoryList: [],
			categoryTitle: String(query.name || '')
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
			if (this.categoryTitle === '') {
				this.category_id = '';
			}
			this.$router.replace(getHashUrl(
				'/content/config/satoolkit/download',
				{
					...this.$route.query,
					keyword: this.keyword,
					start_time: this.start_time,
					end_time: this.end_time,
					category_id: this.category_id,
					name: this.categoryTitle
				}
			));
			this.$store.commit('CONTENT_SATOOLKIT_DOWNLOAD_LIST_INIT');
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
			this.start_time = data;
			this.handleSearch();
		},
		handleEndTime(data) {
			this.end_time = data;
			this.handleSearch();
		},
		getCheckedClassNode() {
			let treeArray = this.$refs.classTree.getSelectedNodes();
			this.categoryId = treeArray[0].category_id;
			this.categoryTitle = treeArray[0].title;
			this.handleSearch();
		},
		handleCategoryList() {
			this.$request({
				url: API_ROOT._CONTENT_CATEGORY_LIST_GET,
				type: 'GET',
				param: {
					kit_type: 2,
					is_control_role: 0
				}
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
			});
		}
	}
};

</script>

<style lang="scss" scoped>
.v-sale-satoolkit-download-filter {
	.btn-red{
		background: #e74854;
		color: #fff !important;
	}
	/deep/ .ivu-tree{
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
	/deep/ .ivu-tree-arrow{
		position: relative;
		margin-right: 5px;
		z-index: 0;
		i {
			font-size: 18px;
		}
	}

	/deep/ .ivu-tree-title{
		vertical-align: middle;
	}
}
</style>
