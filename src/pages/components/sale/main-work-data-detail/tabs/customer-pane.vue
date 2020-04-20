<template>
	<i-tab-pane 		
		:label="label+' '+(listInfo.total ||0)" 
		:name="name"
	>
		<div class="g-pd-b-20">
			<i-input
				slot="prefix"
				v-model="query.keyword"
				:maxlength="50"
				placeholder="请输入客户公司、姓名或手机号"
				style="width: 220px"
				class="g-m-r-5"
				clearable
				@on-enter="handleSearch"
				@on-change="handleClear"
			/>
			<i-date-picker
				v-model="query.dateRange"
				:clearable="false"
				:options="datePickerOption"
				type="daterange"
				placeholder="请选择时间范围"
				class="g-m-r-5"
				style="width: 220px"
				split-panels
				transfer
				@on-change="handleTimeChange"
			/>
			<i-button type="primary" @click="handleSearch">搜索</i-button>
		</div>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:show="show" 
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="false"
			:load-data="loadData"
			class=""
			mode="table"
			@page-size-change="handleSearch"
		/>
	</i-tab-pane>
	
</template>
<script>
import { Input, Button, TabPane, DatePicker } from 'iview';
import { Paging } from 'wya-vc';
import { debounce } from 'lodash';
import { initPage } from '@utils/utils';
import moment from 'moment';
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { CustomerDetail } from "@components/sale/_common/customer/popup";
import { SeaCompanyDetail } from "@components/sale/sea-archive/popup/company-detail";
import { BlackCompanyDetail } from "@components/sale/sea-black/popup/company-detail";
import { WhiteCompanyDetail } from "@components/sale/sea-white/popup/company-detail";
import CusAudio from '../../_common/audio/audio'; 
import timeSearchMixin from '../../main-work-data/_common/timeSearchMixin';


export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-tab-pane': TabPane,
		'i-date-picker': DatePicker,
		'vc-paging': Paging
	},
	mixins: [timeSearchMixin],
	props: {
		label: String,
		name: String,
		initDateRange: Array,
		url: String,
		show: Boolean

	},
	data() {
		return {
			query: {
				keyword: "",
				dateRange: [...this.initDateRange],
				staff_id: this.$route.query.staff_id
			},
			listInfo: {
				...initPage
			},
			columns: [
				{
					title: '公司名称',
					key: 'company_name',
					width: 250,
					fixed: 'left',
					render: (h, { row }) => {
						return <AutoTooltip 
							content={row.company_name}
							theme="dark"
							placement="bottom"
							labelClass={this.canSeeDetail(row) ? 'g-operation' : ' '}
							onClick-label={() => this.handleOpenDrawer(row)} 
						/>;
					}
				},
				{
					title: '客户姓名',
					key: 'customer_name',
					minWidth: 100,
				},
				{
					title: '行业',
					key: 'industry_name',
					minWidth: 100,
				
				},
				{
					title: '注册资金',
					key: 'capital',
					minWidth: 130,
				
				},
				{
					title: '客户状态',
					key: 'status_str',
					minWidth: 100,
				
				},
				{
					title: '当前负责人',
					key: 'staff_name',
					minWidth: 100,
				
				},

				{
					title: '创建人',
					key: 'creator_name',
					minWidth: 100,
				
				},
				{
					title: '添加时间',
					key: 'create_time',
					minWidth: 150,
				
				}
			],
			curModal: {
				type: undefined,
				vm: undefined
			}
			


		};
	},
	methods: {
		handleSearch() {
			this.listInfo = { initPage };

		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		loadData(page, pageSize) {
			const param = {
				keyword: this.query.keyword,
				staff_id: this.query.staff_id,
				start_time: moment(this.query.dateRange[0]).format("YYYY-MM-DD"),
				end_time: moment(this.query.dateRange[1]).format("YYYY-MM-DD"),
				page,
				pageSize

			};
			return this.$request({
				url: this.url,
				type: "GET",
				param,
				loading: false,
			}).then(({ data }) => {
				this.listInfo = {
					...this.listInfo,
					total: data.totalCount,
					data: {
						...this.listInfo.data,
						[page]: data.list
					}
				};
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		/**
		 *  is_delete	// 状态 0 未删除 1 已删除 2 黑名单 3 白名单
			status 		// 状态 0 在公海 1 被领取 2 已成交
			deal_status	// 客户状态 null 公海 0 未成交 1 到账待审核 2 已成交 3 关联中 4 已关联
			is_own		// 1 是自己权限范围内的数据 0 不是自己权限范围内的数据
			注： 先看is_delete，1 已删除  3 白名单时直接返回false, 2 黑名单 直接返回true
				再看status, 0 在公海直接返回true，否则看is_own，如果is_own==1则返回rtue
		 */
		canSeeDetail(row) {
			if (row.is_delete === 3 || row.is_delete === 1) return false;
			if (row.is_delete === 2) return true;
			if (row.status === 0 // 公海
			|| ((row.status === 1 || row.status === 2) && row.is_own)
			) return true;
			return false;
		},
		getDrawer(row) {
			if (row.is_delete == 2) return { drawer: BlackCompanyDetail, type: 'black' }; // 黑名单
			if (row.status == 0) return { drawer: SeaCompanyDetail, type: 'sea' }; // 公海
			if (row.status > 0) return { drawer: CustomerDetail, type: 'common' }; // 意向客户
			// if (row.deal_status == 2) return { drawer: CustomerDetail, type: 'common' }; // 成交客户
			// if (row.deal_status == 3) return { drawer: CustomerDetail, type: 'common' }; // 关联中客户
			// if (row.deal_status == 4) return { drawer: CustomerDetail, type: 'common' }; // 关联客户
			return {};
		},
		handleOpenDrawer(row) {
			
			if (!this.canSeeDetail(row)) return;
			const result = this.getDrawer(row);
			if (result.type !== this.curModal.type) {
				this.curModal.vm && this.curModal.vm.$emit('close');
				this.curModal.vm = null;
			}
			this.curModal.type = result.type;
			result.drawer && result.drawer.popup({
				data: {
					...row,
					readOnly: true,
					is_own: false,
					isPrivate: true
					// // 成交客户的合同公司已经成交了不需要指派也没有删除等操作，只能录入到账
					// hideOption: true,
				},
				showBtn: false,
				type: 3,
				status: 1,
				customerId: row.customer_id,
				showContacts: false,
				readOnly: true,
				getInstance: v => this.curModal.vm = v
			}).catch(err => {
				err && console.error(err);
			}).finally(() => {
				if (this.curModal.type == row.detail_type) {
					this.curModal.vm = undefined;
				}
			});
		},

	}
};
</script>
<style lang="scss">
</style>