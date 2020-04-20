<template>
	<div class="v-sale-relation-filter js-filter">
		<div>
			<i-input
				v-model.trim="keywords.company_keyword"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称或姓名或电话搜索"
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
				style="padding-top:3px;padding-bottom:7px;"
			>
				<i-input
					v-model.trim="keywords.invite_staff"
					clearable
					placeholder="请输入邀约人姓名或手机号搜索"
					class="g-m-r-5"
					style="width:220px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model.trim="keywords.link_keyword"
					clearable
					placeholder="请输入关联公司名称或客户姓名或电话搜索"
					class="g-m-r-5"
					style="width:220px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-select
					v-if="$auth[451]"
					v-model="keywords.is_own"
					clearable
					transfer
					placeholder="我的客户"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option v-if="$auth[470]" value="1">我的客户</i-option>
					<i-option v-if="$auth[451]" value="2">全部客户</i-option>
				</i-select>
				<i-date-picker
					v-model="keywords.apply_time_start"
					type="date"
					placeholder="申请时间（起始）"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
				<i-date-picker
					v-model="keywords.apply_time_end"
					type="date"
					placeholder="申请时间（结束）"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
				<i-date-picker
					v-if="$route.query.type && $route.query.type !== '1'"
					v-model="keywords.audit_time_start"
					type="date"
					placeholder="审核时间（起始）"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
				<i-date-picker
					v-if="$route.query.type && $route.query.type !== '1'"
					v-model="keywords.audit_time_end"
					type="date"
					placeholder="审核时间（结束）"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-relation-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			keywords: {
				company_keyword: '',
				invite_staff: '',
				link_keyword: '',
				is_own: this.$auth[451] ? '2' : '1',
				apply_time_start: '',
				apply_time_end: '',
				audit_time_start: '',
				audit_time_end: '',
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
				'/sale/customer/deal/relation',
				{
					...this.formatQuery()
				}
			));
			this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_LIST_INIT');
		}, 300),
		formatQuery() {
			const query = { ...this.keywords };

			Object.keys(query).forEach(key => {
				if (query[key] instanceof Date) {
					query[key] = query[key].toLocaleString().split(' ')[0].replace(/\//g, '-');
				}
			});
			return query;
		},
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
