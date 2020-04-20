<template>
	<div class="v-sale-material-application-filter js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="keywords.search"
					clearable
					placeholder="请输入申请人姓名/手机" 
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
			<i-select
				v-if="level !== 4"
				v-model="keywords.tab"
				clearable
				transfer
				placeholder="请选择类型"
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option value="0">我的申请</i-option>
				<i-option value="1">我的审核</i-option>
			</i-select>
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
					v-model="keywords.material_name" 
					clearable
					placeholder="请输入素材名称" 
					class="g-m-r-5"
					style="width: 220px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-date-picker
					v-model="keywords.upload_time"
					format="yyyy-MM-dd"
					type="daterange"
					split-panels
					clearable
					placeholder="请选择上传日期"
					class="g-m-r-5"
					@on-change="handleDateChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getLevel } from '@components/sale/_common/util';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-material-application-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'vc-expand': Expand,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			keywords: {
				type: query.type || '1',
				tab: query.tab || '0', // 我的类别
				search: '', // 申请人姓名/手机
				material_name: '', // 素材名称
				create_time_start: '', // 申请开始日期
				create_time_end: '', // 申请开始日期
				...query,
				upload_time: [query.create_time_start, query.create_time_end]
			}
		};
	},
	computed: {
		level() {
			return getLevel();
		}
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
			this.keywords.create_time_start = arr[0];
			this.keywords.create_time_end = arr[1];
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/fraction/material/application',
				{
					...this.keywords,
					fixPosition: true,
					upload_time: undefined
				}
			));
			this.$store.commit('SALE_FRACTION_MATERIAL_APPLICATION_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
	}
};

</script>

<style lang="scss">
.v-sale-material-application-filter {
	.ivu-input-wrapper {
		width: 220px;
	}
	.ivu-select {
		width: 220px;
	}
}
</style>
