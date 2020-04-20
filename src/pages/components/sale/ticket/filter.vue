<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="keyword"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称、姓名或电话进行搜索"
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5"
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
			<div v-if="$auth[538]" class="g-red-btn-line g-fr" @click="handleOpen">
				申请开票
			</div>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="invoice_type"
					class="g-m-r-5"
					clearable
					placeholder="发票类型"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option key="1" value="1">增值税专用发票</i-option>
					<i-option key="2" value="2">增值税普通发票</i-option>
				</i-select>
				<i-date-picker
					v-model="month"
					style="width: 220px"
					type="date"
					transfer
					placeholder="请选择申请时间"
					@on-change="handleMonth"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { debounce } from 'lodash';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'vc-expand': Expand,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false,
			invoice_type: String(query.invoice_type || ''),
			month: String(query.create_time || ''),
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	methods: {
		handleSearch: debounce(function (value) {
			let params = {
				...this.$route.query,
				keyword: this.keyword,
				invoice_type: this.invoice_type,
				create_time: this.month,
				name: this.name
			};
			if (value) {
				params = {
					...params,
					...value,
					fixPosition: true,
				};
			}
			this.$router.replace(getHashUrl(
				'/sale/ticket',
				params
			));
			this.$store.commit('SALE_TICKET_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleOpen() {
			this.$router.push({ name: "sale-ticket-apply" });
		},
		handleMonth(v) {
			this.month = v;
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>
</style>
