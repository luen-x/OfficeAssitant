<template>
	<div>
		<div
			ref="setoolkit"
			class="g-flex v-sale-setoolkit g-pd-tb-20 g-pd-lr-20"
		>
			<div
				ref="left"
				class="_left g-flex g-fd-c g-ai-c"
			>
				<div class="__top">
					<div
						v-for="(item, index) in menu_list"
						:key="item.value"
						:class="{'__menu-active': menu_index === index}"
						class="g-pointer"
						@click="handleClickMenu(index,item.label)"
					>
						<i
							v-if="item.value === 1"
							class="iconfont icon-file g-fs-18"
						/>
						<i
							v-if="item.value === 2"
							class="iconfont icon-unmark g-fs-18"
						/>
						<i
							v-if="item.value === 3"
							class="iconfont icon-browse g-fs-18"
						/>
						<span class="g-fs-14">{{ item.label }}</span>
					</div>
				</div>
				<i-tree :data="tree_list"/>
			</div>
			<div
				ref="middle"
				:class="{'_not':!is_tree,'_tree':is_tree}"
				class="_middle"
			>
				<div
					v-if="is_tree"
					:class="{'g-jc-sb': file_list.length}"
					class="__all g-pd-lr-10 g-pd-tb-15 g-flex g-ai-c"
				>
					<i
						v-if="pid !== -1 && showBack"
						class="iconfont icon-arrow-left g-fs-20 g-pointer g-m-r-10"
						@click="handleBack"
					/>
					<i-input
						v-model.trim="search"
						placeholder="请搜索"
						clearable
						style="width:100px;height:32px;"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>
					<div v-if="file_list.length">
						<i-checkbox
							:value="is_all"
							style="line-height:20px;"
							@on-change="handleSelectAll"
						>
							全选
						</i-checkbox>
						<span
							class="g-pointer g-fs-12 __download"
							@click.stop="handleDownload('all')"
						>
							批量下载
						</span>
					</div>
				</div>
				<div
					:class="{'__tree':is_tree}"
					:style="is_tree ? 'height: calc(100% - 120px);': 'height: 100%;'"
				>
					<div
						v-if="is_tree"
						class="__sub-list"
					>
						<div
							v-for="(it, i) in category_list"
							:key="i"
							:class="{'__active':category_index === i}"
							class="__item g-pd-tb-10 g-pd-l-30 g-pd-r-20 g-flex g-ai-c g-pointer"
							@dblclick="handleDbclickCategory(it, i)"
							@click="handleClickCategory(it, i)"
						>
							<i class="icon iconfont icon-folder g-fs-20"/>
							<i-tooltip
								v-if="it.category_name.length > 15"
								:content="it.category_name"
								max-width="250"
							>
								<span class="g-fs-14 g-m-l-10">{{ it.category_name.substr(0, 15) + '...' }}</span>
							</i-tooltip>
							<span v-else class="g-fs-14 g-m-l-10">{{ it.category_name }}</span>
						</div>
					</div>
					<div
						:style="is_tree ? `height: calc(100% - ${52*category_list.length}px);` : 'height: 100%;'"
						class="__file-list g-relative"
					>
						<div v-if="file_list.length">
							<div
								v-for="(_item, _index) in file_list"
								:key="_index"
								:class="{'__active':file_index === _index}"
								class="__item g-pd-tb-10 g-pd-l-10 g-pd-r-20 g-flex g-pointer"
								@click.stop="handleFileClick($event, _index, _item)"
							>
								<div>
									<i-checkbox
										v-if="is_tree"
										:value="checked_list.map(data=>data.material_id).includes(_item.material_id)"
										style="margin-top:4px;"
										@on-change="handleSelectChange($event, _index, _item)"
									/>
								</div>

								<oa-file-icon :file-url="_item.file_url"/>

								<div class="__info" style="flex:1">
									<div class="g-m-l-10 g-fs-14">
										<div class="__name-box g-flex">
											<div class="__name">
												<span>{{ _item.material_name }}</span>
											</div>
											<span ref="icon" class="__icon g-m-l-20">
												<i
													v-if="collect_list.includes(_item.material_id)"
													class="iconfont icon-collected g-m-l-10"
													@click.stop="handleCollection(true, _item.material_id, menu_index,file_index)"
												/>
												<i
													v-else
													class="iconfont icon-unmark g-m-l-10"
													@click.stop="handleCollection(false, _item.material_id, menu_index,file_index)"
												/>
												<i
													v-if="!_item.is_delete"
													class="iconfont icon-download g-m-l-10"
													@click.stop="handleDownload('one', _item.file_url, [_item.material_id])"
												/>
											</span>
										</div>
									</div>
									<div class="__detail g-flex g-ai-c">
										<div class="__time g-m-l-10">{{ _item.update_date }}</div>
										<span class="g-m-l-10">{{ _item.file_size }}</span>
									</div>
								</div>
							</div>
						</div>
						<div
							v-else-if="is_empty"
							class="g-flex g-ai-c g-jc-c"
							style="width: 100%;height: 100%;"
						>
							抱歉，没有找到相关内容哦。
						</div>
						<oa-loading v-else-if="visible"/>
					</div>
				</div>
				<div v-if="is_tree" class="g-lh-60 g-pd-l-10 __total-count">
					总共{{ totalCount }}项
				</div>
			</div>
			<div class="_right">
				<div
					v-if="file_list.length && !is_folder"
					class="__head g-flex g-jc-sb g-pd-lr-20 g-pd-tb-5"
				>
					<div class="__info">
						<div class="__name g-fs-14">{{ file_name }}</div>
						<div v-if="is_tree" class="__module g-fs-12">
							<i class="iconfont icon-folder" />
							<span>{{ file_position }}</span>
						</div>
					</div>
					<div
						v-if="!is_delete"
						class="__download g-flex g-ai-c g-pointer"
					>
						<vc-debounce-click
							tag="i"
							class="iconfont icon-download"
							@click="handleDownload('one', file_url)"
						/>
					</div>
				</div>
				<div class="__content g-relative">
					<oa-loading v-if="loading"/>
					<oa-file-fail
						v-if="file_type === 1 || !file_type || is_delete || is_empty || is_folder"
						:file-type="file_type || 0"
						:file-url="file_url"
						:is-delete="is_delete"
						:is-empty="is_empty"
						:is-folder="is_folder"
						:material-id="material_id"
						:type="2"
					/>
					<div
						v-else-if="file_type === 2 && file_url && !is_delete"
						style="height:100%;"
					>
						<iframe
							v-if="+file_size < 10 * 1024 * 1024"
							:src="'https://view.officeapps.live.com/op/view.aspx?src='+file_url"
							scrolling="auto"
							width="100%"
							height="100%"
						/>
						<oa-file-fail
							v-else
							:file-type="file_type"
							:file-url="file_url"
							:is-delete="is_delete"
							:is-big="true"
							:material-id="material_id"
							:type="2"
						/>
					</div>
					<oa-file-img
						v-else-if="file_type === 3 && !is_delete"
						:file-url="file_url"
						:img-data="imageArr"
					/>
					<oa-file-video
						v-else-if="file_type === 4 && !is_delete"
						:file-url="file_url"
					/>
					<oa-file-audio
						v-else-if="file_type === 5 && !is_delete"
						:file-url="file_url"
					/>
					<oa-file-pdf
						v-else-if="file_type === 6 && !is_delete"
						:file-url="file_url"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tree, Checkbox, Input, Tooltip } from 'iview';
import { debounce } from 'lodash';
import API_ROOT from "@stores/apis/root";
import downloadFile from '@utils/download';
import Loading from '@components/_common/loading/loading';
import { FileVideo } from '../_common/toolkit/file-video';
import { FileAudio } from '../_common/toolkit/file-audio';
import { FilePdf } from '../_common/toolkit/file-pdf';
import { FileImg } from '../_common/toolkit/file-img';
import { FileFail } from '../_common/toolkit/file-fail';
import { FileIcon } from '../_common/toolkit/file-icon';

export default {
	name: 'oa-setoolkit',
	components: {
		'i-tree': Tree,
		'i-input': Input,
		'i-checkbox': Checkbox,
		'i-tooltip': Tooltip,
		'oa-file-video': FileVideo,
		'oa-file-audio': FileAudio,
		'oa-file-pdf': FilePdf,
		'oa-file-img': FileImg,
		'oa-file-fail': FileFail,
		'oa-file-icon': FileIcon,
		'oa-loading': Loading
	},
	data() {
		return {
			loading: false,
			visible: false,
			is_tree: false, // 是否为树形菜单
			showBack: true, // 是否显示返回按钮
			is_empty: false, // 搜索时数据为空
			is_collect: false, // 是否点击收藏按钮
			is_all: false,
			is_folder: false, // 是否为子目录
			is_delete: '', // 文件是否已删除
			menu_index: 0, // 非树形菜单的索引
			file_index: 0, // 文件索引
			category_index: '', // 子目录索引
			file_name: '', // 文件名
			category_name: '', // 类目名
			file_position: '', // 文件所在的模块
			file_url: '', // 文件url
			file_type: '', // 文件类型
			file_size: '', // 文件大小
			pid: -1, // 父级id
			page: 1, // 请求页
			pageSize: 20, // 每页的条数
			currentPage: null, // 当前页
			totalPage: null, // 总页数
			totalCount: null, // 总文件数
			param_url: API_ROOT.TOOLKIT_NEW_LIST_GET, // 非树形菜单默认显示最新文档
			material_id: '', // 文件id
			material_ids: [], // 批量下载的文件id
			collect_list: [], // 收藏列表的文件id
			file_list: [], // 文件列表
			category_list: [], // 子目录列表
			checked_list: [], // 选中的文件列表
			imageArr: [], // 图片文件数组
			tree_list: [], // 树形菜单列表
			middle: null,
			search: '', // 搜索关键字
			menu_list: [
				{
					value: 1,
					label: '最新文档'
				},
				{
					value: 2,
					label: '我的收藏'
				},
				{
					value: 3,
					label: '最近浏览'
				}
			]
		};
	},
	created() {
		this.getTreeMenu();
		this.handlesubMenuAndFileData();
	},
	mounted() {
		let innerHeight = window.innerHeight - 86;
		this.$refs.setoolkit.style.height = innerHeight + 'px';

		this.$refs.middle.addEventListener('scroll', this.scrollTable, true);
	},
	methods: {
		/**
		 * 获取树形菜单
		 */
		getTreeMenu() {
			this.loading = true;

			let tree_data = [{
				category_id: 0,
				category_name: '我的工具包',
				category_year: 0,
				children: [],
				pid: -1
			}];

			this.$request({
				url: API_ROOT.TOOLKIT_CATEGORY_GET,
				type: 'GET',
				loading: false,
				param: {
					kit_type: 2,
					is_power: 1
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				tree_data[0].children = JSON.parse(JSON.stringify(res.data));
				this.tree_list = this.handleTreeData(tree_data);
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 处理树形菜单数据并渲染
		 */
		handleTreeData(arr) {
			let temp = arr.map(item => {
				return {
					title: item.category_name,
					expand: item.pid === -1,
					render: (h, { root, node, data }) => {
						return (
							<span
								class={`g-pointer ${this.material_id === item.category_id ? '__menu-active' : ''}`}
								style={{
									display: 'inline-block',
									width: '100%',
									lineHeight: '40px',
									paddingLeft: '38px',
									marginLeft: '-22px'
								}}
								onClick={() => {
									this.category_name = item.category_name;
									this.file_list = [];
									this.checked_list = [];
									this.page = 1;
									this.currentPage = null;
									this.totalPage = null;
									this.totalCount = null;
									this.is_tree = true;
									this.showBack = item.pid !== -1;
									this.is_collect = false;
									this.material_id = item.category_id;
									this.menu_index = 'clear';
									this.search = '';
									this.param_url = API_ROOT.TOOLKIT_FILE_LIST_GET;
									this.handlesubMenuAndFileData();
								}}
							>
								<i
									class="iconfont icon-folder"
									style={{
										marginRight: '8px'
									}}
								/>
								{
									data.title.length <= 15 && <span class="g-fs-14">{data.title}</span>
								}
								{
									data.title.length > 15 && <Tooltip
										content={data.title}
										maxWidth="250"
									>
										<span class="g-fs-14">{data.title.substr(0, 15) + '...'}</span>
									</Tooltip>
								}
							</span>
						);
					},
					...(item.children ? { children: this.handleTreeData(item.children) } : {})
				};
			});

			return temp;
		},
		/**
		 * 获取子目录和文件列表
		 */
		async handlesubMenuAndFileData() {
			this.visible = true;
			this.category_list = [];
			this.file_list = [];
			await this.handleSubMenu();
			await this.getFileList(this.page, this.material_id);
			this.visible = false;
			this.is_empty = !this.category_list.length && !this.file_list.length;
		},
		/**
		 * 获取子目录
		 */
		handleSubMenu() {
			this.category_index = '';
			return this.$request({
				url: API_ROOT.TOOLKIT_CATEGORY_LIST_GET,
				type: 'GET',
				loading: false,
				param: {
					category_id: this.material_id,
					kit_type: 2,
					search: this.search
				},
				autoTip: false
			}).then(res => {
				if (res.data.length) {
					this.is_empty = false;
					this.category_list = res.data;
				}
			}).catch(error => {});
		},
		/**
		 * 点击文件
		 */
		handleFileClick(event, index, item) {
			// 阻止点击checkbox触发点击文件
			let path = event.path || (event.composedPath && event.composedPath()) || [];
			if (path.some((el) => /(ivu-checkbox-wrapper)/.test(el.className))) {
				return;
			}

			this.is_collect = false;
			this.is_folder = false;
			this.file_index = index;
			this.category_index = '';
			this.file_name = item.material_name;
			this.file_url = item.file_url;
			this.file_type = item.file_type;
			this.file_size = item.original_file_size;
			this.material_ids = [item.material_id];

			if (item.is_delete) {
				this.is_delete = item.is_delete;
			}

			this.handleBrowser(item.material_id);
		},
		handleBrowser(material_id) {
			// 添加到最近浏览
			this.$request({
				url: API_ROOT.TOOLKIT_VIEW_POST,
				type: 'POST',
				loading: false,
				param: {
					kit_type: 2,
					material_id,
					category_id: this.material_id
				},
				autoTip: false
			}).then(res => {
				this.file_position = res.data.category_name_route;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 获取文件列表
		 */
		getFileList(page, material_id) {
			this.is_all = false;

			if (this.page > 1) {
				this.loading = false;
			} else {
				this.loading = true;
				this.file_name = '';
				this.file_url = '';
				this.file_position = '';
			}

			this.file_index = this.is_collect ? this.file_index : 0;

			let param = {};

			if (material_id !== undefined) {
				param = {
					kit_type: 2,
					search: this.search,
					category_id: material_id,
					page,
					pageSize: this.pageSize
				};
			} else {
				param = {
					kit_type: 2,
				};
			}

			return this.$request({
				url: this.param_url,
				type: 'GET',
				loading: false,
				param,
				autoTip: false
			}).then(res => {
				this.loading = false;
				if (material_id !== undefined) {
					this.currentPage = res.data.currentPage;
					this.totalPage = res.data.totalPage;
					this.totalCount = res.data.total_count;
					if (this.page === 1) {
						this.file_list = res.data.list;
						this.collect_list = this.file_list.filter(item => {
							return item.is_collection === 1;
						}).map(item => item.material_id);
					} else {
						this.file_list = this.file_list.concat(res.data.list);
						let array = (res.data.list || []).filter(item => {
							return item.is_collection === 1;
						}).map(item => item.material_id);
						this.collect_list = this.collect_list.concat(array);
					}
				} else {
					this.file_list = res.data.list;
					this.collect_list = this.file_list.filter(item => {
						return item.is_collection === 1;
					}).map(item => item.material_id);
				}

				if (this.file_list.length) {
					this.is_empty = false;
					this.file_name = this.file_list[this.file_index].material_name;
					this.file_url = this.file_list[this.file_index].file_url;
					this.file_type = this.file_list[this.file_index].file_type;
					this.file_size = this.file_list[this.file_index].original_file_size;
					this.material_ids = [this.file_list[this.file_index].material_id];

					if (this.file_list[this.file_index].is_delete) {
						this.is_delete = this.file_list[this.file_index].is_delete;
					} else {
						this.is_delete = '';
					}

					this.handleBrowser(this.file_list[this.file_index].material_id);

					this.imageArr = this.file_list.filter((item) => {
						let url = item.file_url;
						return url.indexOf('.png') > -1
						|| url.indexOf('.PNG') > -1
						|| url.indexOf('.jpg') > -1
						|| url.indexOf('.JPG') > -1
						|| url.indexOf('.jpeg') > -1
						|| url.indexOf('.JPEG') > -1
						|| url.indexOf('.gif') > -1
						|| url.indexOf('.GIF') > -1;
					}).map((item) => item.file_url);

					this.$nextTick(() => {
						this.pid = res.data.pid;
						if (this.pid === -1) {
							this.showBack = false;
						}
					});
				} else {
					this.pid = res.data.pid;
				}
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击最新文档、我的收藏和最近浏览
		 */
		handleClickMenu(index, label) {
			this.file_list = [];
			this.is_collect = false;
			this.is_tree = false;
			this.menu_index = index;
			this.material_id = 'clear';

			if (this.menu_index === 0) {
				this.category_name = '最新文档';
				this.param_url = API_ROOT.TOOLKIT_NEW_LIST_GET;
			} else if (this.menu_index === 1) {
				this.category_name = '我的收藏';
				this.param_url = API_ROOT.TOOLKIT_COLLECTION_LIST_GET;
			} else {
				this.category_name = '最近浏览';
				this.param_url = API_ROOT.TOOLKIT_BROWSE_LIST_GET;
			}

			this.getFileList();
		},
		/**
		 * 下载预警
		 */
		downloadWarning(download_num) {
			return this.$request({
				url: API_ROOT.TOOLKIT_DOWNLOAD_WARNING_POST,
				type: 'POST',
				loading: false,
				param: {
					material_type: 2,
					download_num: download_num || 1
				},
				autoTip: false
			}).then(res => {
				if (res.status) {
					return true;
				} else {
					return false;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
				return false;
			});
		},
		/**
		 * 下载/批量下载
		 */
		handleDownload: debounce(async function (str, url, material_id) {
			if (str === 'all') { // 批量下载
				if (this.checked_list.length) {
					const can_download = await this.downloadWarning(this.checked_list.length);
					if (can_download) {
						this.checked_list.forEach(item => {
							downloadFile({
								fileName: item.file_url,
								downRecordParams: {
									type: 2,
									material_ids: [item.material_id]
								}
							});
						});
					}
				} else {
					this.$Message.warning('请至少选择一项进行操作！');
					return;
				}
			} else { // 单个下载
				const can_download = await this.downloadWarning();
				if (can_download) {
					downloadFile({
						fileName: url,
						downRecordParams: {
							type: 2,
							material_ids: material_id || this.material_ids
						}
					});
				}
			}
		}, 300),
		/**
		 * 返回上一级
		 */
		handleBack() {
			this.file_list = [];
			this.checked_list = [];
			this.page = 1;
			this.search = '';
			this.currentPage = null;
			this.totalPage = null;
			this.totalCount = null;
			this.material_id = this.pid;
			this.handlesubMenuAndFileData();
			if (this.pid === 0) {
				this.showBack = false;
			}
		},
		/**
		 * 收藏/取消收藏
		 */
		handleCollection: debounce(function (is_collection, material_id, menu_index, file_index) {
			let url_param = '';
			this.is_collect = true;

			if (is_collection) {
				url_param = API_ROOT.TOOLKIT_CANCEL_COLLECTION_POST;
			} else {
				url_param = API_ROOT.TOOLKIT_COLLECTION_POST;
			}

			this.$request({
				url: url_param,
				type: 'GET',
				loading: false,
				param: {
					material_id
				},
			}).then(res => {
				if (this.collect_list.includes(material_id)) {
					const index = this.collect_list.indexOf(material_id);
					this.collect_list.splice(index, 1);
				} else {
					this.collect_list.push(material_id);
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}, 300),
		/**
		 * 全选
		 */
		handleSelectAll(check) {
			if (check) {
				this.is_all = true;
				this.checked_list = this.file_list;
			} else {
				this.is_all = false;
				this.checked_list = [];
			}
		},
		/**
		 * 单个选择
		 */
		handleSelectChange(value, index, item) {
			if (value) {
				this.checked_list.push(item);
			} else {
				this.checked_list = this.checked_list.filter(_item => {
					return _item.material_id !== item.material_id;
				});
			}

			if (this.checked_list.length === this.file_list.length) {
				this.is_all = true;
			} else {
				this.is_all = false;
			}
		},
		/**
		 * 滚动到底部加载更多
		 */
		scrollTable: debounce(function () {
			let visibleHeight = this.$refs.middle.clientHeight;
			let scrollHeight = this.$refs.middle.scrollHeight;
			let scrollTop = this.$refs.middle.scrollTop;

			if (scrollHeight - (scrollTop + visibleHeight) === 0) {
				if (this.currentPage < this.totalPage) {
					this.page++;
					this.getFileList(this.page, this.material_id);
				}
			}
		}, 300),
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
			this.handlesubMenuAndFileData();
		}, 300),
		/**
		 * 双击子目录
		 */
		handleDbclickCategory(item, index) {
			this.is_folder = false;
			this.showBack = true;
			this.category_index = index;
			this.file_index = 0;
			this.material_id = item.category_id;
			this.pid = item.pid;
			this.handlesubMenuAndFileData();
		},
		handleClickCategory(item, index) {
			this.is_folder = true;
			this.category_index = index;
			this.file_index = '';
		}
	},
};
</script>

<style lang="scss">
.v-sale-setoolkit {
	overflow-y: hidden;
	background-color: #f0f0f0;
	._left {
		overflow: hidden;
		border-right: 2px solid #f5f5f6;
		background-color: #fff;
		min-width: 300px;
		.__top {
			width: 100%;
			align-self: flex-start;
			line-height: 40px;
			i {
				margin: 0 6px;
			}
		}
		.icon-file {
			color: #e84854;
		}
		.icon-unmark {
			color: #ed8f4a;
		}
		.icon-browse {
			color: #4fc43d;
		}
		.__menu-active {
			background-color: rgb(129,135,149);
			color: #fff;
			i {
				color: #fff;
			}
		}
		&:hover {
			overflow-x: overlay;
			overflow-y: overlay;
		}
	}
	._middle {
		border-right: 2px solid #f5f5f6;
		background-color: #fff;
		overflow: hidden;
		&:hover {
			overflow-y: overlay;
		}
		.__all {
			width: 100%;
			height: 56px;
			border-bottom: 2px solid #f5f5f6;
			color: #2397f9;
			background-color: #fff;
		}
		.__item {
			border-bottom: 2px solid #f5f5f6;
			i {
				line-height: 30px;
			}
			.__name {
				line-height: 30px;
				width: 120px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.__time {
				width: 140px;
			}
			.icon-download {
				color: #2397f9;
			}
			.icon-unmark,.icon-collected {
				color: #ed8f4a;
			}
			.__detail {
				color: #818794;
			}
			&:hover {
				background-color: rgb(240, 244, 252);
			}
		}
		.__active {
			background-color: rgb(240, 244, 252);
		}
		.__download {
			padding: 2px 10px;
			border: 1px solid #2397f9;
			border-radius: 3px;
			&:hover {
				background-color: #2397f9;
				color: #fff;
			}
		}
		.__file-list {
			width: 100%;
		}
		.__tree {
			overflow: hidden;
			&:hover {
				overflow-y: overlay;
			}
		}
		.__total-count {
			height: 60px;
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		}
	}
	._not {
		min-width: 280px;
	}
	._tree {
		min-width: 300px;
	}
	._right {
		min-width: 584px;
		height: 100%;
		flex: 1;
		background-color: #fff;
		.__head {
			background-color: rgb(240, 244, 252);
		}
		.__download {
			color: #2397f9;
			i {
				font-weight: bold;
			}
		}
		.__module {
			color: #818794;
		}
		.__content {
			height: 96%;
		}
	}
	.ivu-tree {
		width: 100%;
		.__menu-active {
			background-color: rgb(129,135,149);
			color: #fff;
			margin-left: -20px;
			padding-left: 22px;
		}
		.ivu-icon-ios-arrow-forward {
			font-family: "iconfont";
			font-size: 15px;

		}
		.ivu-icon-ios-arrow-forward:before {
			content: "\eb97";
		}
	}
	.ivu-tree-arrow {
		position: relative;
		color:#e84854;
		margin-right: 5px;
		z-index: 0;
		padding-left: 10px;
		i {
			font-size: 25px;
		}
	}
	.ivu-tree-empty {
		text-align: center;
		line-height: 30px;
	}
}
</style>
