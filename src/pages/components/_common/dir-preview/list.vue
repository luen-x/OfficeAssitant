<template>
	<div class="c-dir-preview-list g-flex g-fd-c">
		<div :class="{'g-jc-sb': !canSearch}" class="g-pd-tb-15 g-pd-l-5 g-flex g-ai-c">
			<i 
				v-if="showBack"
				class="iconfont icon-arrow-left g-fs-20 g-pointer g-c-blue-mid" 
				@click="handleBack"
			/>
			<i v-else class="iconfont icon-arrow-left g-fs-20" style="color: #999;"/>
			<i-input 
				v-if="canSearch"
				v-model.trim="search"
				:class="{'g-jc-sb':canDownload}"
				:style="canDownload ? 'width: 110px': 'width: 230px'"
				placeholder="搜索"
				clearable
				style="height:32px;"
				class="g-m-l-10 g-flex g-ai-c"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<div v-if="canDownload">
				<i-checkbox
					v-model="isAll"
					:disabled="!data.length"
					style="line-height:20px;"
					class="g-m-l-5"
					@on-change="handleIsAll"
				>
					全选
				</i-checkbox>
				<span 
					class="g-pointer g-fs-12 _download g-fr"
					@click.stop="handleDownloadSelected"
				>
					批量下载
				</span>
			</div>
		</div>
		<oa-scroll :loading="scrollLoading" class="g-col g-relative" @reach-bottom="handelReachBottom">
			<oa-loading v-if="inSearch"/>
			<div 
				v-else-if="data.length==0"
				class="g-flex g-ai-c g-jc-c"
				style="width: 100%;height: 100%;"
			>
				该类目无内容，请选择其他类目
			</div>
			<i-checkbox-group v-model="checkList" @on-change="handleCheckListChange">
				<div 
					v-for="(item,index) in data" 
					:key="index" 
					:class="{'_item-active':index==activeFileIndex}"
					class="g-flex _list-item g-pointer g-pd-tb-5 g-pd-l-5"
					@click="handleClickFile(item, index)"
				>
					<template v-if="item.is_folder || item.is_category">
						<i 
							:class="{'icon-leimu':item.is_category,'icon-folder':item.is_folder}" 
							class="icon iconfont g-fs-20"
							style="margin-top: 6px;"
						/>
						<div class="g-m-l-5" style="width: 170px;margin-top: 6px;">
							<oa-auto-tooltip 
								:content="item.name"
								style="line-height: 30px;"
								theme="dark"
								placement="bottom"
								label-class=""
							/>
						</div>
					</template>
					<template v-else>
						<i-checkbox
							v-if="canDownload"
							:label="item.id"
							style="line-height:20px;"
						>
							<i v-if="item.is_folder" class="icon iconfont icon-folder" />
							<oa-file-icon 
								v-else 
								:file-url="item.url" 
								style="position: relative;top: 2px;"
							/>
						</i-checkbox>
						<div style="width: 145px">
							<oa-auto-tooltip 
								:content="item.name"
								theme="dark"
								placement="bottom"
								label-class=""
							/>
							<div class="g-fs-12 g-c-black4 g-m-t-5">{{ item.time }}</div>
						</div>
						<div class="g-col g-tc">
							<div >
								<i 
									v-if="showStar" 
									:class="item.star?'icon-collected':'icon-unmark'" 
									class="iconfont g-m-l-10 g-c-orange-mid g-pointer" 
									@click="handleMark(item)"
								/>
								<i 
									v-if="canDownload && !item.is_delete" 
									class="iconfont icon-download g-m-l-10 g-c-blue-mid g-pointer" 
									@click="handleDownload(item)"
								/>
							</div>
							<div class="g-tc g-fs-12 g-c-black4 g-m-t-5">{{ item.size }}</div>
						</div>
					</template>
				</div>
			</i-checkbox-group>
		</oa-scroll>
		<div class="g-tc g-lh-30 _count">
			共{{ totalCount }}项
		</div>
	</div>
</template>
<script>
import { Input, Button, Checkbox, CheckboxGroup, Tooltip } from 'iview';
import downloadFile from '@utils/download';
import { debounce } from 'lodash';
import FileIcon from '@common/file-icon/file-icon';
import Scroll from '@common/scroll/scroll';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import Loading from '@common/loading/loading';

export default {
	name: 'oa-toolkit-list',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-tooltip': Tooltip,
		'oa-file-icon': FileIcon,
		'oa-loading': Loading,
		'oa-scroll': Scroll,
		'oa-auto-tooltip': AutoTooltip
	},
	props: {
		directoryId: [Number, String], // 当前类目id或文件夹id
		// data: Array, 
		loadData: Function, // 加载数据的函数
		beforeDownload: Function, // 下载前的回调，返回Promise 为false则不下载
		formater: Function, // data处理函数
		mark: Function, // 收藏
		materialType: [Number, String], // // 3 素材库 ， 4 工具包  下载记录和下载预警要用
		needDownloadWarning: Boolean, // 是否有下载预警
		recordDownload: Boolean, // 是否添加下载记录
		showStar: Boolean, // 是否展示收藏,
		canDownload: {
			type: Boolean,
			default: true
		},
		canSearch: {
			type: Boolean,
			default: true
		},
		showBack: Boolean,
		disableScroll: Boolean
	},
	data() {
		return {
			search: '',
			isAll: false,
			checkList: [],
			inSearch: false,
			scrollLoading: false,
			data: [],
			page: 0,
			pageSize: 20,
			totalCount: 0,
			activeFileIndex: ''
		};
	},
	watch: { 
		directoryId(newVal) {
			this.search = '';
			this.handleSearch();
		},
		data() {
			this.$emit('data-change', this.data);
		}
	},
	mounted() {
		this.directoryId && this.handleSearch();
	},
	methods: {
		handleSearch() {
			this.inSearch = true;
			this.data = [];
			this.page = 0;
			this.checkList = [];
			this.isAll = false;
			this.loadData({
				search: this.search, 
				page: this.page + 1, 
				pageSize: this.pageSize, 
				category_id: this.search ? '' : this.directoryId
			}).then((res) => {
				if (this.formater) {
					res.data = this.formater(res.data);
				}
				this.data = res.data.list;
				this.page = res.data.currentPage;
				this.totalCount = res.data.total_count || res.data.totalCount;
				this.handleClickFile(res.data.list[0] ? { autoFocus: true, ...res.data.list[0] } : { is_empty: true, autoFocus: true }, 0);
			}).catch(err => {
				console.error(err);
				err && this.$Message.error(err.msg);
			}).finally(() => this.inSearch = false);
		},
		handelReachBottom() {
			if (this.disableScroll) return;
			this.scrollLoading = true;
			this.loadData({ 
				search: this.search, 
				page: this.page + 1, 
				pageSize: this.pageSize, 
				category_id: this.directoryId
			}).then(res => {
				if (this.formater) {
					res.data = this.formater(res.data);
				}
				if (res.data.list.length) {
					this.data.push(...res.data.list);
					this.page = res.data.currentPage;
					this.totalCount = res.data.total_count || res.data.totalCount;
				}
			}).finally(() => this.scrollLoading = false);
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleBack() {
			this.search = "";
			this.$emit('back');
		},
		handleClickFile(item, index) {
			this.activeFileIndex = index;
			this.$emit('click-file', item);
		},
		handleCheckListChange(list) {
			this.isAll = list.length == this.data.length;
		},
		handleIsAll(bool) {
			if (bool) {
				this.checkList = this.data.filter(it => it.type === 1).map(it => it.id);
			} else {
				this.checkList = [];
			}
		},
		handleDownload: debounce(async function (items) {
			if (!Array.isArray(items)) items = [items];
			if (this.beforeDownload) {
				const ok = await this.beforeDownload(items);
				if (!ok) return;
			}
			if (this.needDownloadWarning) {
				const ok = await this.downloadWarning(items.length);
				if (!ok) return;
			}
			items.forEach(item => {
				let downRecordParams;
				if (this.recordDownload) {
					downRecordParams = { type: this.materialType, material_ids: [item.material_id] };
				}
				downloadFile({
					fileName: item.url,
					downRecordParams
				});
			});
		}, 200),
		handleDownloadSelected() {
			if (!this.data.length) return this.$Message.warning('没有可下载的文件');
			if (!this.checkList.length) return this.$Message.warning('请选择要下载的文件');
			const items = this.checkList.map(id => this.data.find(item => {
				return item.id == id && !item.is_delete && item.type === 1;
			})).filter(Boolean);
			this.handleDownload(items);
		},
		handleDownloadActiveFile() {
			const file = this.data[this.activeFileIndex];
			file && this.handleDownload(file);
		},
		downloadWarning(download_num) {
			return this.$request({
				url: 'TOOLKIT_DOWNLOAD_WARNING_POST',
				type: 'POST',
				loading: false,
				param: {
					material_type: this.materialType,
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
		handleMark: debounce(function (item) {
			this.mark(item).then(() => item.star = !item.star).catch(err => err && this.$Message.error(err.msg));
		}, 200)
	}
};
</script>
<style lang="scss">
.c-dir-preview-list {
	width:280px;
	background-color: #fff;
	._download {
		padding: 2px 10px;
		border: 1px solid #2397f9;
		border-radius: 3px;
		color: #2397f9;
		&:hover {
			background-color: #2397f9;
			color: #fff;
		}
	}
	._list-item {
		border-bottom: 1px solid #f5f5f6;
		padding-left: 15px;
		height: 64px;
		padding-top: 8px;
		&._item-active {
			color: #2397f9;
			background: rgba(35, 151, 249,0.1); ;
		}
		&:hover {
			color: #2397f9;
		}
	}
	._count {
		border-top: 1px solid #f5f5f6;
		border-bottom: 1px solid #f5f5f6;
	}
}
</style>