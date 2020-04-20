<template>
	<div class="v-sale-white-filter g-flex g-jc-sb js-filter">
		<div>
			<i-input
				v-model.trim="keywords.keyword"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称，姓名，电话搜索"
				style="width:220px;height:32px;"
				class="g-m-r-5"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-date-picker
				v-model="create_time"
				format="yyyy-MM-dd"
				type="daterange"
				split-panels
				clearable
				placeholder="加入时间"
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
			<i-button class="_btn" @click="handleAdd">添加客户</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { SeaAddWhite } from "./popup/add-white";

export default {
	name: 'oa-white-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			create_time: [query.start_time, query.end_time] || [], // 加入时间
			keywords: {
				keyword: '', // 公司名称、姓名、电话
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
			this.create_time = val;
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/sea/white', {
					...this.keywords,
					start_time: this.create_time[0],
					end_time: this.create_time[1],
				}

			));
			this.$store.commit('SALE_SEA_WHITE_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
		/**
		 * 点击添加客户
		 */
		handleAdd() {
			SeaAddWhite.popup().then(res => {
				if (res.status == 1) {
					this.$store.commit('SALE_SEA_WHITE_LIST_INIT');
				}
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};

</script>

<style lang="scss">
.v-sale-white-filter {
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
