<template>
	<div class="js-filter">
		<div class="v-finance-complain-filter">
			<i-input
				v-model.trim="keywords.company"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称、姓名或手机号"
				style="width:300px;height:32px;"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle"
			>
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model.trim="keywords.staff"
					clearable
					placeholder="请输入申请人姓名/电话"
					class="g-m-r-5"
					style="width:220px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-date-picker
					v-model="keywords.apply_time"
					format="yyyy-MM-dd"
					type="daterange"
					split-panels
					clearable
					placeholder="请选择申请时间开始/结束"
					class="g-m-r-5"
					style="width:220px;height:32px;"
					@on-change="handleDateChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
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
			keywords: {
				company: '', // 公司名
				staff: '', // 申请人姓名/电话
				start_time: '', // 申请开始时间
				end_time: '', // 申请结束时间
				...query,
				apply_time: [query.start_time, query.end_time]
			},
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
		 * 监听申请时间（时间段）的on-change事件
		 */
		handleDateChange(arr) {
			this.keywords.start_time = arr[0];
			this.keywords.end_time = arr[1];
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/finance/services/complain',
				{
					...this.keywords,
					fixPosition: true,
					apply_time: undefined
				}
			));
			this.$store.commit('FINANCE_CUSTOMER_COMPLAIN_LIST_INIT');
		}, 300),
		/**
		 * 展开
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss">

</style>
