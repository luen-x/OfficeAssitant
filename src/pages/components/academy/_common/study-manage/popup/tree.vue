<template>
	<i-tree
		:data="treeList"
		class="v-content-config-material-check _tree"
		@on-select-change="handleSelectedNodes"
	/>
</template>
<script>
import { Tree, Tooltip } from 'iview';
import Fileicon from '@components/_common/file-icon/file-icon';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";

export default {
	name: "tree",
	components: {
		"i-tree": Tree,
		Fileicon
	},
	props: {
		material_id: {
			type: [String, Number],
			default() {
				return '';
			}
		},
		folder_api: {
			type: [String],
			default: ''
		}
	},

	data() {
		return {
			classList: [],
			categoryId: '',
			selectCategoryId: '',
			treeList: []

		};
	},
	watch: {
		material_id(v) {
			this.gitClassList();
		}
	},
	mounted() {
		this.gitClassList();
	},
	methods: {
		gitClassList() {
			this.$request({
				url: this.folder_api,
				type: 'GET',
				param: {
					material_id: this.material_id
				},
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				if (res.data.length) {
					this.classList = JSON.parse(listString);
					this.$emit('handleIsRender', true);
					this.selectCategoryId = this.classList[0].folder_id;
					this.categoryId = this.classList[0].folder_id;
					this.$emit('handleClassList', this.classList);
					this.treeList = this.handleTreeData(res.data);
				} else {
					this.treeList = [];
				}
			}).catch((err) => {
				console.error(err);
			});
		},
		handleTreeData(arr) {
			let treeData = arr.map((item) => {
				return {
					title: item.folder_name,
					expand: true,
					render: (h, { root, node, data }) => {
						return (
							<div class={`g-pointer g-pd-l-20 __item ${this.selectCategoryId === item.folder_id ? '__menu-active'
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
									style={{ display: 'inline-block',
										verticalAlign: 'middle',
										width: '100%',
										lineHeight: '40px', }}
									onClick={() => {
										this.selectCategoryId = item.folder_id;
										this.handleCheckFile(item);
									}}
								>
									{item.type == 2 ? <i class="g-m-r-5 iconfont icon-folder _inline-block"/> : <Fileicon fileUrl={item.path} />}
									{data.title.length > 13
										? <Tooltip
											transfer
											placement="bottom-start"
											style="maxWidth:180px"
										><div>
												{data.title.substr(0, 13) + '...'}
											</div>
											<div slot="content">
												<p style="whiteSpace: normal">
													{data.title}
												</p>

											</div>
										</Tooltip>
										: data.title}
								</span>
							</div>
						);
					},
					children: item.children && this.handleTreeData(item.children)
				};
			});
			return treeData;
		},
		handleSelectedNodes(res) {
			this.categoryId = res[0].category_id;
			// this.resertList(res[0].category_id);
		},
		handleClickArrow(node, event) {
			event.stopPropagation();
			this.$set(node.node, 'expand', !node.node.expand);
		},
		handleCheckFile(item) {
			let res = {
				hrefUrl: '',
				fileType: '',
				fileName: '',
				fileSize: ''
			};
			res.hrefUrl = item.path;
			res.fileType = item.path.split('.')[item.path.split('.').length - 1];
			res.fileName = item.folder_name;
			res.fileSize = item.file_size;
			res.material_id = item.material_id;
			this.$emit('check', res);
		},
	}
};
</script>
<style lang="scss">
    .v-content-config-material-check {
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
    ._tree {
        /deep/ .__menu-active {
            min-width: 100% !important;
            width: auto !important;
        }
    }
</style>
