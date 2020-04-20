<template>
	<i 
		:class="findIcon(fileType)"
		class="iconfont g-fs-20" 
	/>
</template>

<script>
export default {
	name: 'oa-file-icon',
	props: {
		type: [String, Number],
		fileType: [String, Number]
	},
	data() {
		return {
			iconArr: [ // 文件icon列表
				{ file_type: 2, icon: 'icon-word' },
				{ file_type: 3, icon: 'icon-tupian-copy' },
				{ file_type: 4, icon: 'icon-avi' },
				{ file_type: 5, icon: 'icon-yinpin' },
				{ file_type: 6, icon: 'icon-pdf' }
			]
		};
	},
	methods: {
		/**
		 * 文件icon
		 */
		findIcon(file_type) {
			const result = this.iconArr.find(item => {
				return item.file_type == file_type && this.type !== 2;
			});
			if (result) {
				return result.icon;
			} else if (this.type === 2) {
				return 'icon-folder';
			} else {
				return 'icon-question';
			}
		},
	}
};

export const FileIcon = module.exports.default;
</script>

<style lang="scss">

</style>
