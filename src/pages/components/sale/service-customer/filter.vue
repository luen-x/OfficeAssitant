<template>
	<div class="v-sale-service-filter">
		<div class="g-flex _head">
			<div>
				<i-input
					v-model.trim="keywords.company"
					:maxlength="50"
					clearable
					placeholder="请输入公司名称进行搜索"
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
			<div>
				<i-button
					v-if="$auth[482]"
					class="__btn g-m-l-5"
					@click="handleApplication"
				>
					服务申请
					<span v-if="listInfo.applyNum">{{ listInfo.applyNum }}</span>
				</i-button>
				<i-button 
					v-if="$auth[485]"
					class="__btn g-m-l-5" 
					@click="handleRecord"
				>
					服务记录
				</i-button>
			</div>
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
					placeholder="请输入服务人姓名/电话"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model.trim="keywords.product_name"
					clearable
					placeholder="请输入产品名称"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-select
					v-model="keywords.is_complaint"
					clearable
					transfer
					placeholder="是否被投诉"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="0">未投诉</i-option>
					<i-option value="1">已投诉</i-option>
				</i-select>
				<i-select
					v-model="keywords.is_service_amount"
					clearable
					transfer
					placeholder="是否有服务提成"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="0">无服务提成</i-option>
					<i-option value="1">有服务提成</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from "@utils/utils";
import { ServiceRecord } from "../_common/service/record";

export default {
	name: 'oa-service-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
	},
	data() {
		const { query = {} } = this.$route;
		let customer_type = [];
		
		return {
			show: false,
			keywords: {
				company: '', // 公司名称
				staff: '', // 服务人姓名/电话
				product_name: '', // 产品名称
				is_complaint: '', // 是否被投诉
				service_amount_type: '', // 是否有服务提成
				...query,
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleServiceCustomer.listInfo;
		}
	},
	mounted() {
		this.$vc.on('query-change', () => {
			let { query = {} } = getParseUrl();
			this.keywords = {
				company: '', // 公司名称
				staff: '', // 服务人姓名/电话
				product_name: '', // 产品名称
				is_complaint: '', // 是否被投诉
				service_amount_type: '', // 是否有服务提成
				...query,
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
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/service/customer',
				{
					...this.keywords,
					fixPosition: true
				}
			));
			this.$store.commit('SALE_SERVICE_CUSTOMER_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
		/**
		 * 点击服务记录
		 */
		handleRecord() {
			ServiceRecord.popup().catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 服务申请
		 */
		handleApplication() {
			this.$router.push({
				name: 'sale-service-customer-application'
			});
		}
	}
};

</script>

<style lang="scss">
.v-sale-service-filter {
	._head {
		justify-content: space-between;
		.__btn {
			border-color: #e84854;
			color: #e84854;
			&:hover {
				background-color: #e84854!important;
				color: #fff!important;
			}
		}
	}
	._btn {
		width: 60px;
	}
	.ivu-input-wrapper {
		width: 220px;
	}
	.ivu-select {
		width: 220px;
	}
}
</style>
