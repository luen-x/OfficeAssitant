<template>
	<div class="v-material g-flex g-pd-20" style="min-width:1200px;height: inherit;">
		<oa-dir
			ref="dir"
			v-model="activeMenuId"
			:data="dirData" 
			title-key="category_name"
			value-key="category_id"
			style="min-width: 250px;"
			@click-node="handleClickNode"
		/>
		<div class="_line"/>
		<oa-list 
			ref="list" 
			:load-data="loadList" 
			:directory-id="activeMenuId"
			:formater="listFormater"
			:show-back="!!(currentCategory && currentCategory.pid)"
			:can-download="false"
			:need-download-warning="false"
			:record-download="false"
			@click-file="handleClickFile"
			@back="handleBack"
		/>
		<div class="_line"/>
		<oa-view 
			ref="view"
			:data="file"
			:formater="fileFormater" 
			class="g-col"
			style="height: inherit;overflow: auto;"
		/>
		<i 
			class="iconfont icon-close g-pointer g-absolute" 
			style="top:25px;right:30px" 
			@click="goBack"
		/>
	</div>
</template>

<script>
import { getItem, goBack } from '@utils/utils';
import Dir from '@common/dir-preview/directory';
import List from '@common/dir-preview/list';
import View from './view';

export default {
	name: 'oa-material',
	components: {
		'oa-dir': Dir,
		'oa-list': List,
		'oa-view': View
	},
	data() {
		return {
			dirData: [],
			data2: [],
			activeMenuId: '',
			file: undefined,
			currentCategory: {}
		};
	},
	created() {
		this.loadDir();
	},
	methods: {
		loadDir() {
			this.$request({
				url: "_MATERIAL_CATEGORY_GET",
				type: "GET",
				param: {
					need_top: 1
				},
				loading: false,
			}).then(res => {
				this.dirData = res.data;
				const exist = this.findCategory(res.data);
				exist && this.$refs.dir.handleClickNode({ data: { ...exist, value: exist.category_id } });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		findCategory(arr) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].means_count > 0) {
					return arr[i];
				}
				if (arr[i].children && arr[i].children.length) {
					const exist = this.findCategory(arr[i].children);
					if (exist) return exist;
				}
			}
		},
		loadList(param) {
			return this.$request({
				url: '_MATERIAL_LIST_GET',
				type: "GET",
				param,
				loading: false,
			});
		},
		loadFile(id) {
			this.$refs.view.loading = true;
			this.$request({
				url: "_MATERIAL_DETAIL_GET",
				type: "GET",
				param: {
					means_id: id
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
				id: item.means_id,
				name: item.title,
				time: item.update_time
			}));
			return data;
		},
		fileFormater(file) {
			return { ...file, id: file.means_id, title: file.title, update_time: file.update_time };
		},
		handleClickNode({ data }) {
			this.currentCategory = data;
			if (this.currentCategory.value !== data.value) this.$refs.list.search = '';
		},
		handleClickFile(item) {
			this.file = {};
			if (item.is_empty) return this.file = item;
			this.loadFile(item.id);
		},
		handleBack() {
			this.$refs.dir.goParent();
		},
		goBack() {
			const closePath = getItem('closePath_' + _global.version);
			goBack(closePath);
		}
	},
};
</script>

<style lang="scss" >
.v-material {
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
		height: calc(100% - 8px);
		margin-top: 8px;
		background-color: #f5f5f6;
	}
}
</style>
