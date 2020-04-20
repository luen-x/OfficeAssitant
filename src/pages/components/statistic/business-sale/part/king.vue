<template>
	<div class="g-flex g-jc-sb">
		<div
			v-for="(item,index) in king"
			:key="index"
			class="g-b"
			style="width: 48%"
		>
			<div class="g-flex g-jc-sb g-pd-20" style="background: #FAFAFA;">
				<div>{{ item.name }}</div>
				<div>
					<span 
						v-if="$auth[1786]"
						class="g-operation"
						@click="handleStart(index + 1)"
					>
						开启新一届
					</span>
					<span v-if="$auth[1786] && $auth[1787]" class="g-m-lr-10 g-operation">|</span>
					<span 
						v-if="$auth[1787]"
						:class="((index === 0 && item.monthList.length > 0) || (index === 1 && item.yearList.length > 0)) ? 'g-operation' : ''"
						@click="handleClose(index + 1)"
					>
						关闭
					</span>
				</div>
			</div>

			<div class="g-pd-20">
				<div v-if="index === 0">
					<i-select
						v-if="item.monthList.length > 0"
						v-model="monthCycleId"
						transfer
						style="width:220px;"
						class="g-m-r-10"
						placeholder="请选择月度范围"
						@on-change="handleSearch(1)"
					>
						<i-option
							v-for="item in item.monthList"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</div>
				<div v-else>
					<i-select
						v-if="item.yearList.length > 0"
						v-model="yearCycleId"
						transfer
						style="width:220px;"
						class="g-m-r-10"
						placeholder="请选择年度范围"
						@on-change="handleSearch(2)"
					>
						<i-option
							v-for="item in item.yearList"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</div>

				<div class="g-m-t-20">
					<div v-if="item.list.length > 0">
						<div
							v-for="(element,i) in item.list"
							:key="`i_${i}`"
							class="g-flex g-flex-ac g-jc-sb g-b g-m-b-20 g-pd-lr-20"
							style="background: #FBFBFB;height: 48px;line-height: 48px;"
						>
							<div style="width: 200px;">
								<span class="g-c-333 g-fs-14">
									{{ i != 2 ? element.depart_name : element.staff_name }}
								</span>
								<span style="color: #818794;">
									（{{ i != 2 ? element.manage_name : element.depart_name }}）
								</span>
							</div>
							<div>
								<span style="color: #818794;">业绩：</span>
								<span style="color: #4B4F57;">{{ element.performance }}</span>
							</div>
							<div>
								<span style="color: #818794;">成交客户：</span>
								<span style="color: #4B4F57;">{{ element.customer_num }}个</span>
							</div>
						</div>
					</div>

					<div v-else class="g-tc">
						<img :src="OSS_SEARCH_EMPTY">
						<div>暂无数据</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Select, Option, Tooltip } from 'iview';
import { getFormatNum } from '@utils/utils';
import { Confirm } from "@components/_common/confirm/confirm";
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { KingModal } from '../modal/king-modal';

export default {
	components: {
		'i-select': Select,
		'i-option': Option,
		'i-tooltip': Tooltip
	},
	data() {
		return {
			king: [
				{
					name: '月度王中王',
					monthList: [],
					list: []
				},
				{
					name: '年度王中王',
					yearList: [],
					list: []
				}
			],
			OSS_SEARCH_EMPTY,
			monthCycleId: '',
			yearCycleId: ''
		};
	},
	created() {
		this.loadCycleData(1);
		this.loadCycleData(2);
	},
	methods: {
		loadCycleData(type) {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_CYCLE_GET',
				type: "GET",
				param: {
					type
				},
				loading: false
			}).then(res => {
				this.king[type - 1][type === 1 ? 'monthList' : 'yearList'] = [];

				res.data.forEach(item => {
					this.king[type - 1][type === 1 ? 'monthList' : 'yearList'].push({
						...item,
						label: `${item.start_time}~${item.end_time}`,
						value: String(item.cycle_id)
					});	
				});

				type === 1 && this.king[0].monthList.length > 0 && this.loadKingData(this.king[0].monthList[0].cycle_id, 1);
				type === 2 && this.king[1].yearList.length > 0 && this.loadKingData(this.king[1].yearList[0].cycle_id, 2);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadKingData(cycle_id, type) {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_KING_GET',
				type: "GET",
				param: {
					cycle_id
				},
				loading: false
			}).then(res => {
				this.king[type - 1].list = [];
				this[type === 1 ? 'monthCycleId' : 'yearCycleId'] = String(cycle_id);
			
				res.data.zone.depart_id && this.king[type - 1].list.push({
					...res.data.zone,
					performance: getFormatNum(res.data.zone.performance, 2, '￥')
				});
				res.data.depart.depart_id && this.king[type - 1].list.push({
					...res.data.depart,
					performance: getFormatNum(res.data.depart.performance, 2, '￥')
				});
				res.data.staff.depart_id && this.king[type - 1].list.push({
					...res.data.staff,
					performance: getFormatNum(res.data.staff.performance, 2, '￥')
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleSearch(type) {
			this.loadKingData(type === 1 ? this.monthCycleId : this.yearCycleId, type);
		},
		handleStart(type) {
			KingModal.popup({
				type
			}).then(res => {
				res && this.loadCycleData(type);
			});
		},
		handleClose(type) {
			if ((type === 1 && this.king[0].monthList.length === 0) || (type === 2 && this.king[1].yearList.length === 0)) {
				return;
			}
			
			let cycleId = this[type === 1 ? 'monthCycleId' : 'yearCycleId'];
			if (!cycleId) {
				return;
			}

			let value = this.king[type - 1][type === 1 ? 'monthList' : 'yearList'].find(item => {
				 return item.value === cycleId;
			});
			let msg = type === 1 ? value.label : value.label.split("~")[0] + '-' + value.label.split("~")[1];

			Confirm.popup({
				title: '提示',
				msg: `是否要关闭“${msg}”的王中王的评选`,
				showIcon: true
			}).then(res => {
				this.$request({
					url: '_STATISTIC_BUSINESS_SALE_KING_DELETE_POST',
					type: "GET",
					param: {
						cycle_id: cycleId
					},
					loading: false
				}).then((re) => {
					this.$Message.success(re.msg);
					this.loadCycleData(type);
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			});
		}
	}
};
</script>