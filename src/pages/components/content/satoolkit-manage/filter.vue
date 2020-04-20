<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="keyword"
				clearable
				placeholder="请输入素材名称或者发布人姓名进行查询"
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 btn-red"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
			<oa-upload v-if="this.$auth[624]" @uploadInfo="handleUpload"/>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AddMaterial } from './popup/add-material';
import UploadPlan from '../_common/tookit-manage/upload-plan';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'oa-upload': UploadPlan,
	},
	props: {
		classList: Array
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false,
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/config/satoolkit/manage',
				{
					...this.$route.query,
					keyword: this.keyword,
					name: this.name
				}
			));
			this.$store.commit('CONTENT_SATOOLKIT_MANAGE_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		convertKey(arr, key) {
			let newArr = [];
			arr.forEach((item, index) => {
				let newObj = {};
				for (let i = 0; i < key.length; i++) {
					newObj[key[i]] = item[Object.keys(item)[i]];
				}
				newArr.push(newObj);
			});
			return newArr;
		},
		handleUpload(res) {
			AddMaterial.popup({
				fileInfo: res,
				classList: this.classList,
				store: this.$store
			}).then(() => {
			}).catch(() => {
			});
		}
	}
};

</script>

<style lang="scss" scoped>
.btn-red{
	background: #e74854;
	color: #fff !important;
}
</style>
