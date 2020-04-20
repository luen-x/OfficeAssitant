<template>
	<div class="v-sale-service-application-filter g-m-t-15 js-filter">
		<i-input
			v-model.trim="keywords.company"
			:maxlength="50"
			clearable
			placeholder="请输入公司名称/客户姓名/手机号搜索"
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
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-date-picker
					v-model="keywords.apply_time"
					format="yyyy-MM-dd"
					type="daterange"
					clearable
					split-panels
					placeholder="请选择申请时间开始/结束"
					class="g-m-r-5"
					@on-change="handleDateChange"
				/>
				<i-cascader
					v-if="departAll.length > 0"
					v-model="keywords.depart_ids"
					:data="departAll"
					clearable
					transfer
					change-on-select
					placeholder="请选择服务人部门"
					class="g-m-r-5"
					style="width:220px"
					@on-change="handleSearch"
				/>
				<i-select
					v-model="keywords.apply_type"
					clearable
					transfer
					placeholder="请选择申请类型"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="1">服务暂停服务</i-option>
					<i-option value="2">关闭服务项</i-option>
					<i-option value="3">服务提成申诉</i-option>
				</i-select>
				<i-select
					v-model="keywords.status"
					clearable
					transfer
					placeholder="请选择审核结果"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="2">审核通过</i-option>
					<i-option value="3">审核驳回</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker, Cascader } from 'iview';
import { debounce } from 'lodash';
import { Expand } from 'wya-vc';
import { services } from '@stores/services/sale';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-service-application-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
	},
	mixins: [services.departAll()],
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			keywords: {
				company: '', // 公司名称/客户姓名/手机号
				staff: '', // 申请人姓名/电话
				start_time: '', // 申请时间开始
				end_time: '', // 申请时间结束
				depart_id: '',
				apply_type: '', // 申请类型
				status: '', // 审核结果
				...query,
				apply_time: [query.start_time, query.start_time],
				depart_ids: (query.depart_ids ? query.depart_ids.split(',').map(item => +item) : []),
			},
		};
	},
	watch: {
		'keywords.depart_ids': function (val) {
			this.keywords.depart_id = val[val.length - 1];
		}
	},
	mounted() {
		this.$vc.on('query-change', () => {
			let { query = {} } = getParseUrl();
			this.keywords = {
				company: '', // 公司名称/客户姓名/手机号
				staff: '', // 申请人姓名/电话
				start_time: '', // 申请时间开始
				end_time: '', // 申请时间结束
				depart_id: '',
				apply_type: '', // 申请类型
				status: '', // 审核结果
				...query,
				apply_time: [query.start_time, query.start_time],
				depart_ids: (query.depart_ids ? query.depart_ids.split(',').map(item => +item) : []),
			};
		});
	},
	beforeDestroy() {
		this.$vc.off('query-change');
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
		 * 监听申请时间开始/结束的on-change事件
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
				'/sale/service/customer/application',
				{
					...this.keywords,
					fixPosition: true,
					apply_time: undefined,
					depart_ids: this.keywords.depart_ids.length ? this.keywords.depart_ids : undefined
				}
			));
			this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInfo() {
			ServiceInfo.popup().catch(error => {
				error && console.error(error);
			});
		},
		handleStop() {
			ServiceStop.popup().catch(error => {
				error && console.error(error);
			});
		},
		handleClose() {
			ServiceClose.popup().catch(error => {
				error && console.error(error);
			});
		},
		handleComplain() {
			ServiceComplain.popup().catch(error => {
				error && console.error(error);
			});
		}
	}
};

</script>

<style lang="scss">
.v-sale-service-application-filter {
	.ivu-input-wrapper {
		width: 220px;
	}
	.ivu-select {
		width: 220px;
	}
}
</style>
