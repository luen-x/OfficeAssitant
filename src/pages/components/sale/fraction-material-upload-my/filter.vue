<template>
	<div class="v-sale-material-upload-my-filter g-m-t-15 js-filter">
		<div>
			<i-input
				v-model.trim="keywords.material_name" 
				clearable
				placeholder="请输入素材名称" 
				style="width:220px;height:32px;" 
				class="g-m-r-5"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-select
				v-model="keywords.range"
				clearable
				transfer
				placeholder="请选择素材范围"
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option value="1">我提供的</i-option>
				<i-option value="2">我分享的</i-option>
				<i-option value="3">我上传的</i-option>
			</i-select>
			<i-button
				type="primary"
				class="g-m-r-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import { Button, Input, Select, Option } from 'iview';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-material-upload-my-filter',
	components: {
		'i-button': Button,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			keywords: {
				material_name: '', // 素材名称
				range: '', // 素材范围
				...query
			}
		};
	},
	methods: {
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
			this.$router.replace(getHashUrl(
				'/sale/fraction/material/upload/my', 
				this.keywords
			));
			this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_MY_LIST_INIT');
		}, 300),
		/**
		 * 新建申请
		 */
		handleAdd() {
			FractionCreditApplicationAdd.popup();
		}
	}
};

</script>

<style lang="scss">
.v-sale-material-upload-my-filter {
	.ivu-input-wrapper {
		width: 220px;
	}
	.ivu-select {
		width: 220px;
	}
}
</style>
