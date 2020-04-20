<template>
	<div ref="document" class="g-flex g-pd-l-20 g-pd-t-20 v-tech-share-document-content">
		<div class="g-pd-tb-15" style="background-color: #fff;">
			<div ref="left" class="_left g-flex g-fd-c g-ai-c">
				<i-tree :data="documentTree"/>
			</div>
		</div>

		<div ref="middle" class="g-relative _middle _tree">
			<div style="border-left: 2px solid #f5f5f6;border-right: 2px solid #f5f5f6;height: 100%;">
				<div
					v-show="document_id"
					class="g-pd-lr-10 g-pd-tb-15 g-flex g-ai-c"
				>
					<i
						v-if="parent_id"
						class="iconfont icon-arrow-left g-fs-20 g-pointer g-m-r-10"
						style="color: #2397f9;"
						@click="handleBack"
					/>
					<i
						v-else
						class="iconfont icon-arrow-left g-fs-20 g-pointer g-m-r-10"
						style="color: #999999;"
					/>
					<i-input
						v-model.trim="search"
						placeholder="请搜索"
						clearable
						style="width:220px;height:32px;"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>
				</div>

				<div class="__tree">
					<div v-if="contentList.length > 0">
						<div
							v-for="(item,index) in contentList"
							:key="index"
							:class="item.show ? '__background' : ''"
							class="g-pd-l-20 g-pd-t-10 g-fs-12 g-bb g-pointer __content"
							@click="handleClick(item)"
						>
							<div
								:style="{'color': item.show ? '#2397f9' : '#333333'}"
								class="g-m-b-10"
							>
								{{ item.title }}
							</div>
							<div style="color: #666666;">{{ item.update_time }}</div>
						</div>
					</div>
					<div v-else class="g-flex g-flex-cc" style="height: 100%;">
						该类目无内容，请选择其他类目
					</div>
				</div>

				<div class="g-tc g-absolute g-lh-30 __total-count">
					总共{{ contentList.length }}项
				</div>
			</div>
		</div>

		<div class="g-pd-20 _right">
			<div v-if="text.length > 0">
				<div class="g-fs-18 g-c-black2 g-m-b-10">{{ title }}</div>
				<div class="g-fs-12 g-m-b-20" style="color: #666666;">
					发布时间：{{ updateTime }}
				</div>
				<oa-editor-preview
					:content="text"
					max-height="88%"
				/>
			</div>
			<div v-else class="g-flex g-flex-cc" style="height: 100%;">
				<div>
					<img :src="OSS_NO_MESSAGE08" alt="" style="width: 230px;">
					<div class="g-fs-14 g-m-t-10 g-tc">
						点击左侧导航查看详细内容
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tree, Input } from 'iview';
import { debounce } from 'lodash';
import { OSS_NO_MESSAGE08 } from "@constants/constants";
import { Editor } from "wya-vc";
import EditorPreview from '@common/editor-preview/editor-preview';

export default {
	name: 'oa-content',
	components: {
		'i-tree': Tree,
		'i-input': Input,
		'vc-editor': Editor,
		'oa-editor-preview': EditorPreview
	},
	data() {
		return {
			OSS_NO_MESSAGE08,
			documentTree: [],
			document_id: '', // 文件id
			search: '',
			contentList: [],
			parent_id: null,
			text: '',
			title: '',
			updateTime: '',
			flag: true
		};
	},
	created() {
		this.document_id = this.$route.query.document_id;
		this.loadData();
	},
	mounted() {
		let innerHeight = window.innerHeight - 105;
		this.$refs.document.style.height = innerHeight + 'px';
	},
	methods: {
		loadData() {
			this.$request({
				url: "_TECH_SHARE_DOCUMENT_RED_TREE_GET",
				type: "GET",
				param: {}
			}).then(res => {
				this.documentTree = this.handleTreeData(res.data);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		/**
		 * 处理树形菜单数据并渲染
		 */
		handleTreeData(arr) {
			let temp = arr.map(item => {
				return {
					title: item.document_name,
					expand: true,
					render: (h, { root, node, data }) => {
						if (+this.document_id === +item.document_id) {
							this.document_name = item.document_name;
							this.parent_id = item.parent_id;
						}

						if (+this.document_id === +item.document_id && this.flag) {
							this.handleContentData();
						}

						return (
							<div class={`g-pointer g-pd-l-20 __item ${+this.document_id === +item.document_id ? '__menu-active' : ''}`}>
								{
									item.children && item.children.length
										&& <i
											class="icon iconfont icon-triangle-right g-fs-12"
											style={`display: inline-block;transition: transform .1s linear;${
												node.node.expand ? 'transform: rotate(90deg);' : ""
											}`}
											onClick={(event) => this.handleClickArrow(node, event)}
										/>
								}
								<span
									style={{
										display: 'inline-block',
										width: '90%',
										lineHeight: '40px',
										paddingLeft: `${item.children && item.children.length ? '10px' : ''}`
									}}
									onClick={(event) => {
										event.stopPropagation();
										this.document_name = item.document_name;
										this.document_id = item.document_id;
										this.search = '';
										this.parent_id = item.parent_id;
										this.text = '';

										this.handleContentData();
									}}
								>
									{
										data.title.length <= 15 && <span class="g-fs-14">{data.title}</span>
									}
									{
										data.title.length > 15
									&& <Tooltip
										content={data.title}
										maxWidth="250"
									>
										<span class="g-fs-14">{data.title.substr(0, 15) + '...'}</span>
									</Tooltip>
									}
								</span>
							</div>
						);
					},
					children: item.children ? this.handleTreeData(item.children) : ''
				};
			});

			return temp;
		},

		/**
		 * 返回上一级
		 */
		handleBack() {
			this.search = '';
			this.document_id = this.parent_id;
			this.handleContentData();
		},

		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.handleContentData();
		}, 300),

		handleContentData() {
			this.$request({
				url: "_TECH_SHARE_DOCUMENT_READ_GET",
				type: "GET",
				param: {
					document_id: this.document_id,
					search: this.search
				}
			}).then(res => {
				res.data.length && res.data.forEach(item => {
					item.show = false;
				});

				this.contentList = res.data.length ? res.data : [];

				if (this.$route.query.read_id && this.flag) {
					this.contentList.forEach(item => {
						if (+item.read_id === +this.$route.query.read_id) {
							this.updateTime = item.update_time;
							this.title = item.title;
							this.text = item.text;
							this.$set(item, 'show', true);
						}
					});
				} else if (this.contentList[0]) {
					this.updateTime = this.contentList[0].update_time;
					this.title = this.contentList[0].title;
					this.text = this.contentList[0].text;
					this.$set(this.contentList[0], 'show', true);
				} else {
					this.updateTime = "";
					this.title = "";
					this.text = "";
				}

				this.flag = false;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleClick(v) {
			this.contentList.forEach(item => {
				if (+item.read_id === +v.read_id) {
					v.show = true;
				} else {
					item.show = false;
				}
			});

			this.updateTime = v.update_time;
			this.title = v.title;
			this.text = v.text;
		},
		handleClickArrow(node, event) {
			event.stopPropagation();
			this.$set(node.node, 'expand', !node.node.expand);
		},
	},
};
</script>

<style lang="scss">
.v-tech-share-document-content{
	overflow-y: hidden;
	background-color: #FAFAFA;
	margin-top: -5px;

	._left {
		overflow: hidden;
		min-width: 300px;
		height: 100%;

		.__menu-active {
			background: rgba(35, 151, 249, 0.1);
			color: #2397f9;

			i {
				color: #2397f9;
			}
		}

		&:hover {
			overflow-x: overlay;
			overflow-y: overlay;
		}
	}

	.ivu-tree {
		width: 100%;
		.__menu-active {
			background: rgba(35, 151, 249, 0.1);
			color: #2397f9;
		}
		.__item:hover{
			background: rgba(35, 151, 249, 0.1);
			color: #2397f9;
		}

		.ivu-tree-arrow {
			display: none;
		}
	}

	.ivu-tree-empty {
		text-align: center;
		line-height: 30px;
	}

	._middle {
		background-color: #fff;
		overflow-x: hidden;
		overflow-y: overlay;

		&:hover {
			overflow-y: overlay;
		}

		.__tree {
			overflow: hidden;
			height: 88%;

			&:hover {
				overflow-y: overlay;


			}

			.__content{
				height: 64px;
			}

			.__background{
				background: rgba(35, 151, 249, 0.1);
				color: #2397f9;
			}
		}

		.__total-count {
			bottom: 0px;
			width: 100%;
			border-top: 1px solid #f5f5f6;
			border-bottom: 1px solid #f5f5f6;
		}
	}

	._tree {
		min-width: 300px;
	}

	._right {
		min-width: 584px;
		height: 100%;
		flex: 1;
		overflow-y: auto;
		background-color: #fff;
	}

	.ivu-tree{
		ul{
			li{
				margin: 0;
			}
		}
	}
}
</style>