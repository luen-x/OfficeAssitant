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
				url: API_ROOT._CONTENT_LIBRARY_MATERIAL_FOLDER_PREVIEW_POST,
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
				if (item.children) {
					return {
						title: item.folder_name,
						expand: true,
						render: (h, { root, node, data }) => {
							return (
								<span
									class={`g-pointer ${this.selectCategoryId === item.folder_id ? '__menu-active' : '__menu-hover'}`}
									style={{ display: 'inline-block',
										verticalAlign: 'middle',
										width: '100%',
										lineHeight: '40px',
										paddingLeft: '38px',
										marginLeft: '-22px' }}
									onClick={() => {
										this.selectCategoryId = item.folder_id;
										this.handleCheckFile(item);
									}}
								>
									<i class="g-m-r-5 iconfont icon-folder _inline-block"></i>
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
						},
						children: this.handleTreeData(item.children)
					};
				} else {
					return {
						title: item.folder_name,
						expand: false,
						render: (h, { root, node, data }) => {
							return (
								<span
									class={`g-pointer ${this.selectCategoryId === item.folder_id ? '__menu-active' : '__menu-hover'}`}
									style={{
										display: 'inline-block',
										marginLeft: ' -22px',
										paddingLeft: '22px',
									}}
								>

									<span
										style={{ position: 'relative',
											display: 'inline-block',
											verticalAlign: 'middle',
											width: '100%',
											lineHeight: '40px',
											paddingLeft: '38px',
											marginLeft: '-22px',
											zIndex: '100' }}
										onClick={() => {
											this.selectCategoryId = item.folder_id;
											this.handleCheckFile(item);
										}}
									>
										{data.title.length > 12
											? <Tooltip
												transfer
												placement="bottom-start"
												style="display: block;maxWidth:200px"
											><div>
													<Fileicon fileUrl={item.folder_name} style={{ marginRight: '5px' }}></Fileicon>
													{data.title.substr(0, 12) + '...'}
												</div>
												<div slot="content">
													<p style="whiteSpace: normal">
														{data.title}
													</p>

												</div>
											</Tooltip>
											: <span>
												<Fileicon fileUrl={item.folder_name} style={{ marginRight: '5px' }}>
												</Fileicon>
												{data.title}
											</span>
										}
									</span>
								</span>
							);
						}
					};
				}
			});
			return treeData;
		},
		handleSelectedNodes(res) {
			this.categoryId = res[0].category_id;
			// this.resertList(res[0].category_id);
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
        .__menu-hover:hover {
            background: #eff5fc;
			min-width: 100% !important;
            width: auto !important;
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
