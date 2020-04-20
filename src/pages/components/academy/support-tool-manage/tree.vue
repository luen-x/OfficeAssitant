<template>
	<i-tree
		:data="treeList"
		class="v-academy-support-tool-manage-tree _tree"
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
				url: '_ACADEMY_SUPPORT_TOOL_CATEGORY_ALL_GET',
				type: 'GET',
				param: {
				},
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
					this.treeList = this.handleTreeData(res.data);
				}
			}).catch((err) => {
				console.error(err);
			});
		},
		handleTreeData(arr) {
			let treeData = arr.map((item) => {
				// if (item.children) {
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
										this.resertList(item);
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
		handleClickArrow(node, event) {
			event.stopPropagation();
			this.$set(node.node, 'expand', !node.node.expand);
		},
		handleSelectedNodes(res) {
			this.categoryId = res[0].category_id;
			this.resertList(res[0]);
		},
		resertList(res) {
			this.$router.replace(getHashUrl(
				'/academy/support/tool/manage',
				{
					...this.$route.query,
					category_id: res.category_id,
					category_name: res.category_name,
					kit_type: res.kit_type,
					name: this.name
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_INIT');
		}
	}
};
</script>
<style lang="scss">
    .v-academy-support-tool-manage-tree {
        width: 100%;
        ul {
            font-size: 14px !important;
		}
		.__item:hover{
			color: #2397f9;
		}
        .__menu-hover:hover {
            color: #2296f9;
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
