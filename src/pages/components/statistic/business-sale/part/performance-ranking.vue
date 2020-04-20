<template>
	<div class="v-statistic-sale-performance-ranking">
		<oa-panel
			:tabs="dateLabel"
			title="业绩排名"
			more-label="进入看板"
			@tab-change="handleTabChange"
			@more="handleGoRank"
		>
			<div class="_contents">
				<div class="g-flex">
					<i-radio-group 
						v-model="amountType"
						type="button"
						@on-change="handleChange"
					>
						<i-radio label="1">
							成交金额
						</i-radio>
						<i-radio label="2">
							实际业绩
						</i-radio>
					</i-radio-group>

					<oa-mix-picker
						v-model="time"
						:type="currentTab"
						:season-tree="seasonTree"
						class="g-m-l-20"
						@change="handleDateChange"
					/>
				</div>

				<div class="g-m-t-20 g-flex">
					<div 
						v-for="(item,index) in dataSource"
						:key="`index_${index}`"
						:class="index != dataSource.length - 1 ? 'g-m-r-10' : ''"
						style="flex: 1;"
					>
						<div class="g-m-b-5">
							<span class="g-c-black g-fs-16">
								{{ item.name }}
							</span>
							<span v-if="item.is_top" style="color: #999999;">
								(Top20)
							</span>
						</div>

						<div class="g-pd-r-20 __list">
							<div
								v-for="(element,i) in item.list"
								:key="`i_${i}`"
								class="g-bb g-pd-t-10 g-pointer"
								@click="goSaleRank(element,index)"
							>
								<div class="g-flex g-jc-sb">
									<div class="g-flex">
										<div 
											:class="i < 3 ?'_rank-' + i:''"
											class="g-inline-block g-tc g-rank-index __block"
										>
											{{ i + 1 }}
										</div>
										<div class="g-m-l-5">
											<span class="g-fs-14 g-c-333">
												{{ index === 2 ? element.staff_name : element.depart_name }}
												({{ index === 2 ? element.depart_name : element.manage_name }})
											</span>
											<div 
												v-if="element.target_name != '--'" 
												class="g-flex g-m-tb-5"
											>
												<span class="g-inline-block g-m-r-10">
													{{ element.target_name }}
												</span>
												<i-process
													:percent="+element.target_rate.split('%')[0]"
													:stroke-width="5"
													status="wrong"
													style="width: 170px;"
												>
													{{ element.target_rate }}
												</i-process>
											</div>
											<div 
												v-else 
												class="g-flex g-m-tb-5"
											>
												--
											</div>
										</div>
									</div>

									<div class=" g-tl" style="width: 130px;">
										<div>
											<span class="g-fs-14 g-m-r-10">
												{{ +amountType === 1 ? '成交金额' : '实际金额' }}
											</span>
											<!-- <i-tooltip
												content="筛选周期内分单后业绩总和，不减退款金额，若当月进账当月退款的直接不计入"
												max-width="300"
											>
												<i 
													class="iconfont icon-icon-question g-fs-14" 
													style="color: #D4D7DB;"
												/>
											</i-tooltip> -->
										</div>
										<div class="g-fs-14">
											<oa-auto-tooltip
												:content="element.performance"
												theme="dark"
												placement="bottom"
												label-class=" "
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</oa-panel>
	</div>
</template>

<script>
import { DatePicker, Circle, Progress, Tooltip, RadioGroup, Radio } from 'iview';
import moment from 'moment';
import { services } from '@stores/services/sale';
import { getFormatNum } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import Panel from '../../_common/panel';
import MixPicker, { getInitTime, getTargetSeasonTree } from '../../_common/mix-picker';

export default {
	components: {
		'i-date-picker': DatePicker,
		'i-circle': Circle,
		'i-process': Progress,
		'i-tooltip': Tooltip,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-panel': Panel,
		'oa-mix-picker': MixPicker,
		'oa-auto-tooltip': AutoTooltip
	},
	mixins: [services.targetSeason()],
	data() {
		return {
			dateLabel: [
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
			currentTab: 2,
			amountType: '1', // 金额类型 1成交金额 2实际业绩
			year: moment().format("YYYY"),
			configId: '',
			month: '',
			seasonTree: [],
			dataSource: [
				{
					name: '战区',
					is_top: false,
					list: []
				},
				{
					name: '部门',
					is_top: true,
					list: []
				},
				{
					name: '员工',
					is_top: true,
					list: []  
				}
			]
		};
	},
	async created() {
		await this.loadTargetSeasonPromise;
		const season = getTargetSeasonTree(this.targetSeason);
		this.seasonTree = season.tree;
		this.time = { ...this.time, season: season.value };

		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_RANKING_GET',
				type: "GET",
				param: {
					amount_type: this.amountType,
					time_type: this.currentTab,
					year: this.year,
					config_id: this.configId,
					month: this.month
				},
				loading: false
			}).then(res => {
				res.data.zone_list.forEach(item => item.performance = getFormatNum(item.performance, 2, '￥'));
				res.data.depart_list.forEach(item => item.performance = getFormatNum(item.performance, 2, '￥'));
				res.data.staff_list.forEach(item => item.performance = getFormatNum(item.performance, 2, '￥'));

				this.dataSource[0].list = res.data.zone_list;
				this.dataSource[1].list = res.data.depart_list;
				this.dataSource[2].list = res.data.staff_list;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleGoRank(v) {
			if (!this.$auth[1780]) {
				this.$Message.warning('暂无权限查看');
				return; 
			}
			this.$router.push({
				path: '/statistic/business/sale/rank',
				query: {
					whose: 1,
					time_type: this.currentTab,
					...this.time,
					season: this.time.season.join(','),
					amount_type: this.amountType
				}
			});
		},
		handleTabChange(tab) {
			this.currentTab = tab.value;
			this.handleData();
		},
		handleChange() {
			this.loadData();
		},
		handleDateChange(time) {
			this.handleData(time);
		},
		handleData(time) {
			this.year = '';
			this.configId = '';
			this.month = '';

			if (this.currentTab === 2) {
				this.year = time ? time.year : this.time.year;
			} else if (this.currentTab === 3) {
				this.configId = time ? time.season[1] : this.time.season[1];
			} else {
				this.month = moment(time ? time.month : this.time.month).format('YYYY-MM');
			}

			this.loadData();
		},
		goSaleRank(element, index) {
			if (!this.$auth[1780]) {
				this.$Message.warning('暂无权限查看');
				return; 
			}
			this.$router.push({
				path: '/statistic/business/sale/rank',
				query: {
					whose: index + 2,
					time_type: this.currentTab,
					depart_id: element.depart_id,
					staff_id: element.staff_id,
					...this.time,
					season: this.time.season.join(','),
					amount_type: this.amountType
				}
			});
		}
	}
};
</script>

<style lang="scss">
.v-statistic-sale-performance-ranking {
    .ivu-radio-wrapper:first-child{
		margin-right: 0px;
	}

	.ivu-radio-group-button {
		.ivu-radio-wrapper {
			padding: 0px 20px;
			height: 36px;
			line-height: 36px;
		}
	}

    ._contents {
        .__block {
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 3px;
        }

        .__list {
			overflow-y: auto;
			overflow-y: overlay;
            max-height: 350px;
			border-right: 1px solid #f8f8f8;
        }
    }
}
</style>