<template>
	<div class="v-sale-satoolkit g-flex g-pd-20" style="min-width:1200px;height: inherit;">
		<oa-dir
			ref="dir"
			v-model="activeMenuId"
			:data="dirData"
			title-key="category_name"
			value-key="category_id"
			style="min-width: 250px;"
			@click-node="handleClickNode"
		>
			<template
				slot="top"
				slot-scope="{activeValue}" >
				<div
					v-for="(menu,index) in topMenu"
					:key="index"
					:class="{'_top-menu g-pointer':true,'_active-menu':menu.id===activeValue}"
					@click="handleClickMenu(menu)"
				>
					<i :class="menu.icon" class="g-m-l-10"/>
					<span>{{ menu.name }}</span>
				</div>
			</template>
		</oa-dir>
		<div class="_line"/>
		<oa-list
			ref="list"
			:load-data="loadList"
			:load-category="loadCategory"
			:directory-id="activeMenuId"
			:formater="listFormater"
			:material-type="4"
			:before-download="beforeDownload"
			:need-download-warning="true"
			:record-download="true"
			:show-back="!!(currentFolder || (currentCategory && currentCategory.pid) && activeMenuId !== 'recent')"
			:disable-scroll="!!currentFolder"
			:can-search="!!!currentFolder"
			@click-file="handleClickFile"
			@data-change="handleListChange"
			@click-node="handleClickNode"
			@back="handleBack"
		/>
		<div class="_line"/>
		<oa-view
			ref="view"
			:data="file"
			:formater="fileFormater"
			:img-list="imgList"
			class="g-col"
			style="height: inherit;overflow: auto;"
			@download="handleDownloadFile"
		/>
	</div>
</template>

<script>
import Dir from '@common/dir-preview/directory';
import List from '@common/dir-preview/list';
import View, { imgTypes } from '@common/dir-preview/view';

export default {
	name: 'oa-satoolkit',
	components: {
		'oa-dir': Dir,
		'oa-list': List,
		'oa-view': View
	},
	data() {
		return {
			dirData: [],
			data2: [],
			activeMenuId: 'recent',
			file: undefined,
			imgList: [],
			topMenu: [
				{
					id: 'recent',
					name: '最近浏览',
					icon: 'iconfont icon-browse g-fs-18 g-c-green-mid'
				}
			],
			currentCategory: {},
			currentFolder: undefined, // pid -- parent_folder_id
		};
	},
	created() {
		this.loadDir();
	},
	methods: {
		loadDir() {
			this.$request({
				url: "_TOOLKIT_KIT_CATEGORY_ALL_GET",
				type: "GET",
				param: {
					need_top: 1,
					is_power: 1
				},
				loading: false,
			}).then(res => {
				this.dirData = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadList(param) {
			let url = "_TOOLKIT_KIT_MATERIAL_FILE_LIST_GET";

			if (param.category_id == 'recent') {
				url = "_TOOLKIT_KIT_BROWSE_LIST_GET";
			}
			return this.$request({
				url,
				type: "GET",
				param,
				loading: false,
			}).then(res1 => {
				if (param.category_id != 'recent' && param.page == 1) {
					res1.data.list = [...res1.data.category_data.map(i => ({ ...i, is_category: true })), ...res1.data.list];
				}
				return res1;

			});
		},
		loadCategory(param) {
			return this.$request({
				url: '_SALE_KITLIBRARY_CATEGORY_LIST_GET',
				type: "GET",
				param,
				loading: false,
			});
		},
		loadFolder(item) {
			this.$request({
				url: "_CMS_TOOLKIT_KIT_FOLDER_CONTENT_GET",
				type: "GET",
				param: {
					material_id: item.material_id,
					folder_id: item.folder_id
				},
				loading: false,
			}).then(res => {
				this.currentFolder = res.data;
				this.$refs.list.data = this.currentFolder.children.map(it => ({
					...it,
					id: it.folder_id,
					name: it.folder_name,
					size: it.file_size,
					time: it.create_time || it.create_date,
					star: false,
					url: it.path,
					is_folder: it.type == 2
				}));
				this.$refs.list.activeFileIndex = 0;
				this.$refs.list.totalCount = res.data.total_count;
				const file = this.$refs.list.data[0];
				this.file = file ? { ...file, file_name: file.folder_name, file_url: file.path } : { is_empty: 1 };
				this.handleClickFile(file ? { autoFocus: true, ...file, is_folder: true } : { is_empty: true, autoFocus: true, is_folder: true });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadFile(id) {
			this.$refs.view.loading = true;
			this.$request({
				url: "_TOOLKIT_KIT_MATERIAL_DETAIL_GET",
				type: "GET",
				param: {
					material_id: id
				},
				loading: false,
			}).then(res => {
				this.file = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			}).finally(() => {
				this.$refs.view.loading = false;
			});
		},
		listFormater(data) {
			data.list = data.list.map(item => ({
				...item,
				id: item.material_id,
				name: item.material_name || item.category_name,
				size: item.file_size,
				time: item.create_time || item.create_date,
				star: false,
				url: item.file_url,
				is_folder: item.type == 2
			}));
			return data;
		},
		fileFormater(file) {
			return {
				...file,
				file_url: file.file_url || file.path,
				file_name: file.material_name || file.folder_name || file.category_name,
				is_folder: file.type == 2
			};
		},
		handleClickMenu(item) {
			this.$refs.dir.activeNodeValue = item.id;
			this.$refs.list.search = '';
			if (this.activeMenuId === item.id) {
				this.$refs.list.handleSearch();
			} else {
				this.activeMenuId = item.id;

			}
			this.currentFolder = undefined;
			this.currentCategory = {};

		},
		handleClickNode({ data }) {
			this.currentFolder = undefined;
			this.currentCategory = data;
			this.activeMenuId = data.value;
			if (this.activeMenuId !== data.value) this.$refs.list.search = '';
		},
		handleClickFile(item) {
			this.file = {};
			if (item.is_empty) return this.file = item;
			if (item.autoFocus) {
				if (item.is_category) {
					this.file = item;
				} else if (this.currentFolder) {
					this.file = item;
				} else {
					this.loadFile(item.id);
				}
			} else if (item.is_folder) {
				this.loadFolder(item);
			} else if (item.is_category) {
				this.activeMenuId = item.category_id;
				this.handleClickNode({ data: { ...item, value: item.category_id } });
			} else if (this.currentFolder) {
				this.file = item;
			} else {
				this.loadFile(item.id);
			}
			if (!item.autoFocus && item.category_id) {
				this.$refs.dir.expand({ value: item.category_id });
			}

			if (!item.autoFocus && item.material_id) this.recordView(item.material_id);
		},
		recordView(id) {
			this.$request({
				url: "_TOOLKIT_KIT_BROWSE_BROWSE_CREATE_POST",
				type: "GET",
				param: { material_id: id },
				loading: false,
			}).then(res => {}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleDownloadFile() {
			this.$refs.list.handleDownloadActiveFile();
		},
		beforeDownload(file) {
			return Promise.resolve(1);
		},
		handleListChange(data) {
			this.imgList = data.filter(it => {
				const strs = (it.url || '').split('.');
				const suffix = strs[strs.length - 1].toLowerCase();
				return imgTypes.includes(suffix);
			}).map(it => it.url);
		},
		handleBack() {
			if (this.currentFolder) {
				if (this.currentFolder.pid) { // 如果不是顶级目录
					this.loadFolder({ material_id: this.currentFolder.material_id, folder_id: this.currentFolder.pid });
				} else {
					this.$refs.list.handleSearch();
					this.currentFolder = undefined;
				}
			} else if (this.currentCategory && this.currentCategory.pid) {
				this.$refs.dir.goParent();
			} else {
				this.currentFolder = undefined;
				this.$refs.list.handleSearch();
			}
		}
	},
};
</script>

<style lang="scss" >
.v-sale-satoolkit {
	background-color: #fafafa;
	._top-menu {
		line-height: 40px;
		font-size: 14px;
		&:hover {
			color: #2397f9
		}
		&._active-menu {
			color: rgb(35, 151, 249);
			background: rgba(35, 151, 249,0.1)

		}
	}
	._line {
		width: 2px;
		height: calc(100% - 10px);
		margin-top: 10px;
		background-color: #f5f5f6;
	}
}
</style>
