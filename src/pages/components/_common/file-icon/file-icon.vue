<template>
	<i
		:class="findIcon(fileUrl)"
		class="iconfont g-fs-20"
	/>
</template>

<script>
export default {
	name: 'oa-file-icon',
	props: {
		fileUrl: String
	},
	data() {
		return {
			iconArr: [ // 文件icon列表
				{ file: '.doc', icon: 'icon-word' },
				{ file: '.docx', icon: 'icon-word' },
				{ file: '.txt', icon: 'icon-word' },
				{ file: '.ppt', icon: 'icon-ppt' },
				{ file: '.xls', icon: 'icon-xls' },
				{ file: '.avi', icon: 'icon-avi' },
				{ file: '.mp4', icon: 'icon-mp4' },
				{ file: '.mp3', icon: 'icon-yinpin' },
				{ file: '.pdf', icon: 'icon-pdf' },
				{ file: '.png', icon: 'icon-tupian-copy' },
				{ file: '.jpg', icon: 'icon-tupian-copy' },
				{ file: '.jpeg', icon: 'icon-tupian-copy' },
				{ file: '.gif', icon: 'icon-tupian-copy' },
				{ file: '.PNG', icon: 'icon-tupian-copy' },
				{ file: '.JPG', icon: 'icon-tupian-copy' },
				{ file: '.JPEG', icon: 'icon-tupian-copy' },
				{ file: '.GIF', icon: 'icon-tupian-copy' },
				{ file: '.zip', icon: 'icon-zip' },
				{ file: '.rar', icon: 'icon-zip' }
			]
		};
	},
	methods: {
		/**
		 * 文件icon
		 */
		findIcon(url) {
			const result = this.iconArr.find(item => {
				return url.indexOf(item.file) > -1;
			});
			if (result) {
				return result.icon;
			} else {
				return 'icon-question';
			}
		},
	}
};

export const FileIcon = module.exports.default;
</script>

<style lang="scss" scoped>

</style>
