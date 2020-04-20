<template>
	<div class="v-collage-check-statistic-check-detail js-filter">
		<div>
			<i-input
				v-model="query.company_info"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称或客户姓名" 
				style="width: 300px;height:32px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
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
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-date-picker
					v-model="query.quality_date"
					clearable
					transfer
					type="daterange"
					split-panels
					placeholder="请选择质检日期"
					style="width: 220px;"
					class="g-m-r-10"
					formate="yyyy-MM-dd"
					@on-change="handleSearch"
				/>

				<div class="g-inline-block g-m-r-5">
					<i-select
						v-model="query.role_type"
						clearable
						transfer
						style="width:143px;"
						placeholder="请选择筛选分数"
						class="g-m-r-5"
						@on-change="handleSearch"
						@on-clear="handleClear"
					>
						<i-option
							v-for="item in scores"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-input-number
						v-model="query.min_score"
						:min="0"
						:max="10"
						style="width:32px"
						class="g-m-r-5"
					/>
					<i-input-number
						v-model="query.max_score"
						:min="0"
						:max="10"
						style="width:32px"
						class="g-m-r-5"
					/>
				</div>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option, InputNumber } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
	},
	props: {
		value: Object
	},
	data() {
		return {
			query: { ...this.value },
			show: false,
			roles: [
				{
					value: "1",
					label: "讲师"
				},
				{
					value: "2",
					label: "主持人"
				},
				{
					value: "3",
					label: "流程对接人"
				}
			],
			scores: [
				{
					value: "99",
					label: "套系评分"
				},
				{
					value: "4",
					label: "讲师评分"
				},
				{
					value: "3",
					label: "主持人评分"
				},
				{
					value: "1",
					label: "流程对接人评分"
				}
			]
		};
	},
	watch: {
		value(val) {
			this.query = { ...val };
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
	},
	methods: {
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch() {
			this.$emit('search', this.query);
		},
		handleClear() {
			this.query.min_score = null;
			this.query.max_score = null;
		}
	}
};
</script>

<style lang="scss">
.v-collage-check-statistic-check-detail{
	.ivu-input-number-handler-wrap {
        display: none !important;
	}
}
</style>