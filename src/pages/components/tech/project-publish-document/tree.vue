<template>
	<i-tree
		:data="treeList"
		class="v-tech-project-publish-tree _tree"
		@on-select-change="handleSelectedNodes"
		@on-toggle-expand="handleToggle"
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
			documentId: '',
			selectDocumentId: '',
			selectProjectId: '',
			prjectId: '',
			treeList: [],
			parentId: ''
		};
	},
	mounted() {
		this.getClassList();
	},
	methods: {
		handleToggle(e) {
		},
		getClassList() {
			this.$request({
				url: API_ROOT._TECH_PROJECT_PUBLISH_DOCUMENT_TREE_GET,
				type: 'GET',
				param: {},
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/document_name/g, 'title');
				if (res.data.length) {
					this.classList = JSON.parse(listString);
					this.$emit('handleIsRender', true);
					this.selectDocumentId = this.classList[0].document_id;
					this.documentId = this.classList[0].document_id;
					this.selectProjectId = this.classList[0].project_id;
					this.projectId = this.classList[0].project_id;
					this.$emit('handleClassList', this.classList);
					this.treeList = this.handleTreeData(res.data);
				}
				this.handleInit();
			}).catch((err) => {
				console.error(err);
			});
		},
		handleInit() {
			this.searchDocumentId(this.treeList);
		},
		searchDocumentId(arr) {
			let flag = true;
			let document_id = this.$route.query.document_id;
			arr.map(v => {
				if (v.children) {
					if (v.children.length && flag) {
						this.searchDocumentId(v.children);
					}
				}
				if (v.id == document_id) {
					// v.expand = true;
					flag = false;
					this.parentId = v.parentId;
					this.selectDocumentId = v.id;
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
		// search
		handleTreeData(arr) {
			let treeData = arr.map((item) => {
				if (item.children) {
					return {
						title: item.document_name,
						id: item.document_id,
						projectId: item.project_id,
						parentId: item.parent_id,
						expand: false,
						render: (h, { root, node, data }) => {
							return (
								<span
									class={`g-pointer ${this.selectDocumentId === item.document_id ? '__menu-active' : '__menu-hover'}`}
									style={{
										display: 'inline-block',
										verticalAlign: 'middle',
										width: '100%',
										lineHeight: '40px',
										paddingLeft: '38px',
										marginLeft: '-22px'
									}}
									onClick={() => {
										this.selectDocumentId = item.document_id;
										this.selectProjectId = item.project_id;
										this.resertList(this.selectDocumentId, this.selectProjectId);
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
							);
						},
						children: this.handleTreeData(item.children)
					};
				} else {
					return {
						title: item.document_name,
						id: item.document_id,
						projectId: item.project_id,
						parentId: item.parent_id,
						expand: false,
						render: (h, { root, node, data }) => {
							return (
								<span
									class={`g-pointer ${this.selectDocumentId === item.document_id ? '__menu-active' : '__menu-hover'}`}
									style={{
										position: 'relative',
										display: 'inline-block',
										verticalAlign: 'middle',
										width: '100%',
										lineHeight: '40px',
										paddingLeft: '38px',
										marginLeft: '-22px',
										zIndex: '100'
									}}
									onClick={() => {
										this.selectDocumentId = item.document_id;
										this.selectProjectId = item.project_id;
										this.resertList(this.selectDocumentId, this.selectProjectId);
									}}
								>
									{data.title.length > 15
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
										: data.title}
								</span>
							);
						}
					};
				}
			});
			return treeData;
		},
		handleSelectedNodes(res) {
			this.documentId = res[0].document_id;
			this.projectId = res[0].project_id;
			this.resertList(res[0].document_id, res[0].project_id);
		},
		resertList(res, project) {
			this.$router.replace(getHashUrl(
				'/tech/project/publish/document',
				{
					...this.$route.query,
					document_id: res,
					project_id: project
				}
			));
			this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_LIST_INIT');
		}
	}
};
</script>
<style lang="scss">
    .v-tech-project-publish-tree {
        width: 100%;
        ul {
            font-size: 14px !important;
        }
        .__menu-hover:hover {
            background: #eff5fc;
        }
        .__menu-active {
            background: #818895;
            color: #fff;
        }
        .ivu-icon-ios-arrow-forward {
            font-family: "iconfont" !important;
            font-size: 15px !important;
        }
        .ivu-icon-ios-arrow-forward:before {
            content: "\eb97" !important;
        }
        .ivu-tree-arrow {
            position: relative;
            margin-right: 5px;
			padding-left: 14px;
            z-index: 0;
            color: #e74854;
            i {
                font-size: 25px;
            }
        }

        .ivu-tree-title {
            vertical-align: middle;
        }
        .ivu-tree-empty {
            text-align: center;
        }
    }
    ._tree {
        .__menu-active {
            min-width: 100% !important;
            width: auto !important;
        }
    }
</style>
