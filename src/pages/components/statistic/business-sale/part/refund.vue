<template>
	<div>
		<oa-panel
			:tabs="dateLabel"
			title="退款统计"
			more-label="进入看板"
			@tab-change="handleTabChange"
			@more="handleGoRank"
		>
			<oa-mix-picker
				v-model="time"
				:type="currentTab"
				class="g-m-b-20"
				@change="handleChange"
			/>

			<div class="g-fs-16">
				<span>退款总额 {{ typeData.total_refund_amount }}</span>
				<span style="margin-left: 24px;margin-right: 24px;">余额退款 {{ typeData.pocket_total_refund_amount }}</span>
				<span>产品退款 {{ typeData.contract_total_refund_amount }}</span>
			</div>

			<div>
				<div class="g-flex g-bb g-pd-b-20" style="margin-left: 50px;margin-right: 20px;">
					<div style="margin-top: 50px;width: 50%;">
						<div 
							class="g-c-black g-fs-16"
							style="margin-left: 15%;"
						>
							按退款原因
						</div>
						<oa-refund-echars
							:key="1"
							:data-source="reasonList"
						/>
					</div>
					<div class="g-m-t-20" style="width: 50%;">
						<i-select
							v-model="reasonCategoryId"
							clearable
							transfer
							style="width:220px;margin-left: 35%;"
							placeholder="所有"
							@on-change="loadReasonStatistics"
						>
							<i-option
								v-for="item in treeList"
								:value="item.value"
								:key="item.value"
							>
								{{ item.label }}
							</i-option>
						</i-select>

						<oa-refund-echars
							:key="2"
							:data-source="statisticsList"
						/>
					</div>
				</div>
				
				<div>
					<div class="g-flex g-bb g-pd-b-20" style="margin-left: 50px;margin-right: 20px;">
						<div style="margin-top: 50px;width: 50%;">
							<div 
								class="g-c-black g-fs-16"
								style="margin-left: 15%;"
							>
								按产品类型
							</div>
							<oa-refund-echars
								:key="3"
								:data-source="categoryList"
							/>
						</div>
						<div class="g-m-t-20" style="width: 50%;">
							<i-select
								v-model="categoryId"
								clearable
								transfer
								style="width:220px;margin-left: 35%;"
								placeholder="所有"
								@on-change="laodProduct"
							>
								<i-option
									v-for="(item,index) in list"
									:key="index"
									:value="String(item.category_id)"
								> 
									{{ item.category_name }} 
								</i-option>
							</i-select>

							<oa-refund-echars
								:key="4"
								:data-source="productList"
							/>
						</div>
					</div>
				</div>
			</div>
		</oa-panel>
	</div>
</template>

<script>
import { Select, Option } from 'iview';
import { getFormatNum } from '@utils/utils';
import Panel from '../../_common/panel';
import MixPicker, { getInitTime } from '../../_common/mix-picker';
import RefundEchars from './refund-echars';

export default {
	components: {
		'i-select': Select,
		'i-option': Option,
		'oa-panel': Panel,
		'oa-mix-picker': MixPicker,
		'oa-refund-echars': RefundEchars
	},
	data() {
		return {
			dateLabel: [
				{
					label: '累计',
					value: 1
				},
				{
					label: '年度',
					value: 2
				},
				{
					label: '季度',
					value: 3
				},
				{
					label: '月度',
					value: 4
				}
			],
			time: getInitTime(),
			currentTab: 1,
			typeData: {},
			reasonList: [],
			treeList: [],
			statisticsList: [],
			reasonCategoryId: '',
			categoryList: [],
			list: [],
			categoryId: '',
			productList: []
		};
	},
	created() {
		this.loadRefundStatistics();
		this.loadRefundReason();
		this.loadTree();
		this.loadReasonStatistics();
		this.loadCategory();
		this.loadClass();
		this.laodProduct();
	},
	methods: {
		loadRefundStatistics() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_REFUND_TYPE_GET',
				type: "GET",
				param: {
					type: this.currentTab,
					year: +this.currentTab === 2 ? this.time.year : '',
					season: +this.currentTab === 3 ? this.time.season[1] : '',
					month: +this.currentTab === 4 ? this.time.month : ''
				},
				loading: false
			}).then(res => {
				this.typeData = {
					pocket_total_refund_amount: getFormatNum(res.data.pocket_total_refund_amount, 2, '￥'),
					contract_total_refund_amount: getFormatNum(res.data.contract_total_refund_amount, 2, '￥'),
					total_refund_amount: getFormatNum(res.data.total_refund_amount, 2, '￥')
				};
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadRefundReason() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_REFUND_REASON_GET',
				type: "GET",
				param: {
					type: this.currentTab,
					year: +this.currentTab === 2 ? this.time.year : '',
					season: +this.currentTab === 3 ? this.time.season[1] : '',
					month: +this.currentTab === 4 ? this.time.month : ''
				},
				loading: false
			}).then(res => {
				this.reasonList = res.data.map(item => {
					return {
						...item,
						name: item.reason_category_name
					};
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadReasonStatistics() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_REFUND_STATISTICS_GET',
				type: "GET",
				param: {
					type: this.currentTab,
					year: +this.currentTab === 2 ? this.time.year : '',
					season: +this.currentTab === 3 ? this.time.season[1] : '',
					month: +this.currentTab === 4 ? this.time.month : '',
					reason_category_id: this.reasonCategoryId
				},
				loading: false
			}).then(res => {
				this.statisticsList = res.data.map(item => {
					return {
						...item,
						name: item.reason_name
					};
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadCategory() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_REFUND_CATEGORY_GET',
				type: "GET",
				param: {
					type: this.currentTab,
					year: +this.currentTab === 2 ? this.time.year : '',
					season: +this.currentTab === 3 ? this.time.season[1] : '',
					month: +this.currentTab === 4 ? this.time.month : ''
				},
				loading: false
			}).then(res => {
				this.categoryList = res.data.map(item => {
					return {
						...item,
						name: item.product_category_name
					};
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadTree() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_REFUND_TREE_GET',
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.treeList = res.data.map(item => {
					return {
						label: item.reason_category_name,
						value: String(item.reason_category_id)
					};
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadClass() {
			this.$request({
				url: "_CONTENT_PRODUCT_CATEGORY_GET",
				type: "GET",
				loading: false
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		laodProduct() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_REFUND_PRODUCT_GET',
				type: "GET",
				param: {
					type: this.currentTab,
					year: +this.currentTab === 2 ? this.time.year : '',
					season: +this.currentTab === 3 ? this.time.season[1] : '',
					month: +this.currentTab === 4 ? this.time.month : '',
					category_id: this.categoryId
				},
				loading: false
			}).then(res => {
				this.productList = res.data.map(item => {
					return {
						...item,
						name: item.product_name
					};
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleGoRank() {
			if (!this.$auth[1785]) return this.$Message.warning('暂无权限查看');
			this.$router.push({
				path: '/statistic/business/sale/refund',
				query: {
					...this.time,
					season: this.time.season[1],
					current_tab: this.currentTab
				}
			});
		},
		handleTabChange(tab) {
			this.currentTab = tab.value;
			this.loadRefundStatistics();
			this.loadRefundReason();
			this.loadReasonStatistics();
			this.laodProduct();
		},
		handleChange() {
			this.loadRefundStatistics();
			this.loadRefundReason();
			this.loadReasonStatistics();
			this.laodProduct();
		}
	}
};
</script>