<template>
	<i-tree
		:data="treeList"
		class="_content-setoolkit-manage-tree _tree"
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
		this.gitClassList();
	},
	methods: {
		gitClassList() {
			this.$request({
				url: API_ROOT._CONTENT_CATEGORY_LIST_GET,
				type: 'GET',
				param: {
					kit_type: 1,
					is_control_role: 0
				},
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				if (res.data.length) {
					this.classList = JSON.parse(listString);
					this.$emit('handleIsRender', true);
					this.selectCategoryId = this.classList[0].category_id;
					this.categoryId = this.classList[0].category_id;
					this.$emit('handleClassList', this.classList);
					this.treeList = this.handleTreeData(res.data);
				}
			}).catch((err) => {
				console.error(err);
			});
		},
		handleTreeData(arr) {
			let treeData = arr.map((item) => {
				if (item.children) {
					return {
						title: item.category_name,
						expand: false,
						render: (h, { root, node, data }) => {
							return (
								<span
									class={`g-pointer ${this.selectCategoryId === item.category_id ? '__menu-active' : '__menu-hover'}`}
									style={{
										display: 'inline-block',
										verticalAlign: 'middle',
										width: '100%',
										lineHeight: '40px',
										paddingLeft: '38px',
										marginLeft: '-22px'
									}}
									onClick={() => {
										this.selectCategoryId = item.category_id;
										this.resertList(this.selectCategoryId);
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
						title: item.category_name,
						expand: false,
						render: (h, { root, node, data }) => {
							return (
								<span
									class={`g-pointer ${this.selectCategoryId === item.category_id ? '__menu-active' : '__menu-hover'}`}
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
										this.selectCategoryId = item.category_id;
										this.resertList(this.selectCategoryId);
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
							// return h('span', {
							// 	class: `g-pointer ${this.selectCategoryId === item.category_id ? '__menu-active' : '__menu-hover'}`,
							// 	style: {
							// 		position: 'relative',
							// 		display: 'inline-block',
							// 		verticalAlign: 'middle',
							// 		width: '100%',
							// 		lineHeight: '40px',
							// 		paddingLeft: '27px',
							// 		marginLeft: '-22px',
							// 		zIndex: '100'
							// 	},
							// 	on: {
							// 		'click': () => {
							// 			this.selectCategoryId = item.category_id;
							// 			this.resertList(this.selectCategoryId);
							// 		}
							// 	}
							// }, data.title);
						}
					};
				}
			});

			return treeData;
		},
		handleSelectedNodes(res) {
			this.categoryId = res[0].category_id;
			this.resertList(res[0].category_id);
		},
		resertList(res) {
			this.$router.replace(getHashUrl(
				'/content/config/setoolkit/manage',
				{
					...this.$route.query,
					category_id: res,
					name: this.name
				}
			));
			this.$store.commit('CONTENT_SETOOLKIT_MANAGE_LIST_INIT');
		}
	}
};
</script>
<style lang="scss">
    ._content-setoolkit-manage-tree {
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
            z-index: 0;
			padding-left: 14px;
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
        /deep/ .__menu-active {
            min-width: 100% !important;
            width: auto !important;
        }
    }
</style>
