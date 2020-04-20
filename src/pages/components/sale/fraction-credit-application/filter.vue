<template>
	<div class="v-sale-credit-application-filter g-m-t-15 g-flex g-jc-sb js-filter">
		<div>
			<i-date-picker
				v-model="keywords.create_time"
				format="yyyy-MM-dd"
				type="date"
				clearable
				placeholder="请选择申请日期" 
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleDateChange"
			/>
			<i-button
				type="primary"
				class="g-m-r-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div>
			<i-button class="_btn" @click="handleAdd">新建申请</i-button>
		</div>
	</div>
</template>

<script>
import { Button, DatePicker } from 'iview';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { FractionCreditApplicationEdit } from './popup/edit';

export default {
	name: 'oa-credit-application-edit',
	components: {
		'i-button': Button,
		'i-date-picker': DatePicker
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			keywords: {
				create_time: '', // 加入时间
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
		 * 监听时间选择器的on-change事件
		 */
		handleDateChange(val) {
			this.keywords.create_time = val;
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/fraction/credit/application', 
				{
					...this.keywords,
					fixPosition: true
				}
			));
			this.$store.commit('SALE_FRACTION_CREDIT_APPLICATION_LIST_INIT');
		}, 300),
		/**
		 * 新建申请
		 */
		handleAdd() {
			FractionCreditApplicationEdit.popup({
				title: '新增申请'
			}).then(() => {
				this.$store.commit('SALE_FRACTION_CREDIT_APPLICATION_LIST_INIT');
			}).catch((error) => {
				error && console.error(error);
			});
		}
	}
};

</script>

<style lang="scss">
.v-sale-credit-application-filter {
	._btn {
		border-color: #e84854;
		color: #e84854;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
}
</style>
