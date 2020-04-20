<template>
	<i-tree
		:data="treeList"
		class="v-academy-support-study-manage-tree _tree"
		@on-select-change="handleSelectedNodes"
	/>
</template>
<script>
import { Tree, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";

export default {
	name: "tree",
	components: {
		"i-tree": Tree
	},
	data() {
		return {
			classList: [],
			categoryId: '',
			selectCategoryId: '',
			treeList: []
		};
	},
	mounted() {
		this.loadCategoryList();
	},
	methods: {
		loadCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_ALL_GET',
				type: 'GET',
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				const { query } = this.$route;
				if (res.data.length) {
					this.classList = JSON.parse(listString);
					this.$emit('handleIsRender', true);
					this.selectCategoryId = Number(query.category_id) || this.classList[0].category_id;
					this.categoryId = Number(query.category_id) || this.classList[0].category_id;
					this.$emit('handleClassList', this.classList);
					this.$vc.emit('TOOL_MANAGE_TREE', { treeList: this.classList });
					this.treeList = this.handleTreeData(res.data);
				}
			}).catch((err) => {
				console.error(err);
			});
		},
		handleTreeData(arr) {
			let treeData = arr.map((item) => {
				return {
					title: item.category_name,
					expand: false,
					render: (h, { root, node, data }) => {
						return (
							<div class={`g-pointer g-pd-l-20 __item ${this.selectCategoryId === item.category_id ? '__menu-active'
								: '__menu-hover'}`}>
								{
									item.children && <i
										class="icon iconfont icon-triangle-right g-fs-12 g-m-r-10"
										style={`display: inline-block;transition: transform .1s linear;${
											node.node.expand ? 'transform: rotate(90deg);' : ""
										}`}
										onClick={(event) => this.handleClickArrow(node, event)}
									/>
								}
								<span
									style={{
										display: 'inline-block',
										verticalAlign: 'middle',
										width: '100%',
										lineHeight: '40px',
									}}
									onClick={() => {
										this.selectCategoryId = item.category_id;
										this.resertList(this.selectCategoryId, item.category_name);
									}}
								>
									{
										data.title.length > 15
											? <Tooltip
												transfer
												placement="bottom-start"
												style="display: block;maxWidth:200px"
											><div>
													{data.title.substr(0, 15) + '...'}
												</div>
												<div slot="content">
													<p style="whiteSpace: normal">
														{data.title}
													</p>

												</div>
											</Tooltip>
											: data.title
									}
								</span>
							</div>
						);
					},
					children: item.children && this.handleTreeData(item.children)
				};
			});
			return treeData;
		},
		searchDocumentId(arr) {
			let flag = true;
			let category_id = this.$route.query.category_id;
			arr.map(v => {
				if (v.children) {
					if (v.children.length && flag) {
						this.searchDocumentId(v.children);
					}
				}
				if (v.id == category_id) {
					// v.expand = true;
					flag = false;
					this.pid = v.pid;
					this.category_id = v.id;
					this.selectProjectId = v.projectId;
					this.resertList(this.selectDocumentId, this.selectProjectId);
				}
				return;
			});
			this.searchParentId(this.treeList);
		},
		searchParentId(arr) {
			let flag = true;
			arr.map(v => {
				if (v.children) {
					if (v.children.length && flag) {
						this.searchParentId(v.children);
					}
				}
				if (v.id == this.parentId) {
					v.expand = true;
					if (flag) {
						this.parentId = v.parentId;
						this.searchParentId(this.treeList);
						v.parentId ? '' : flag = false;
					}
				}
				return;
			});
		},
		handleClickArrow(node, event) {
			event.stopPropagation();
			this.$set(node.node, 'expand', !node.node.expand);
		},
		handleSelectedNodes(res) {
			this.categoryId = res[0].category_id;
			this.resertList(res[0].category_id);
		},
		resertList(res, name) {
			this.$router.replace(getHashUrl(
				'/academy/support/study/manage',
				{
					...this.$route.query,
					category_id: res,
					category_name: name
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
		}
	}
};
</script>
<style lang="scss">
    .v-academy-support-study-manage-tree {
		width: 100%;
        ul {
            font-size: 14px !important;
		}
		.__item:hover{
			color: #2397f9;
		}
        .__menu-active {
			background: #eff5fc !important;
			color: #2296f9;
        }
        .ivu-icon-ios-arrow-forward {
            font-family: "iconfont" !important;
            font-size: 15px !important;
        }
        .ivu-icon-ios-arrow-forward:before {
            content: "\eb97" !important;
        }
        .ivu-tree-arrow {
			display: none;
        }

        .ivu-tree-title {
            vertical-align: middle;
        }
        .ivu-tree-empty {
            text-align: center;
        }
    }
</style>
