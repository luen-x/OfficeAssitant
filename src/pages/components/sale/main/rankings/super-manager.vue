<template>
	<div class=" v-sale-main-rankings-super-manager" >
		<div class="g-flex g-jc-sb _title">
			<span style="visibility: hidden;">编辑目标|2018-10</span>
			<div class="g-tc g-c-black1">业绩排行</div>
			<span class="g-operation">
				<span>
					<i-date-picker
						:open="open"
						:value="value3"
						style="color:#666"
						type="month"
						@on-change="handleChange"
						@on-clear="handleClear"
						@on-ok="handleOk"
						@on-open-change="handleOpenChange"
					>
						<span
							style="color: #2296f9"
							class="g-fs-14 g-m-r-20"
							@click.prevent.stop="handleOpen"
						>{{ value3 === '' ? 'Select date' : value3 }}</span>
					</i-date-picker>
				</span>
			</span>
		</div>

		<div class="g-flex">
			<div class="g-col">
				<div class="_heard">
					<div >
						<span class="g-fs-14">
							<span class="_red-border"/> 战区排行
						</span>
						<span class="g-operation" @click="handleAllZone()">更多</span>
					</div>
				</div>
				<div class="_body">
					<div class="g-flex __heard">
						<div class="g-col">排名</div>
						<div class="g-col">战区</div>
						<div class="g-col">业绩</div>
					</div>
					<div
						v-for="(item,i) in zone_list"
						:key="i"
						class="g-flex __table g-c-black1"
					>
						<div class="g-col">{{ item.sort_count }}</div>
						<div class="g-col">{{ item.depart_name }}</div>
						<div class="g-col">{{ item.current_money }}</div>
					</div>
					<div v-if="zone_list.length==0" class="g-c-black1">
						<img
							:src="OSS_SEARCH_EMPTY"
						>
					</div>
					<oa-loading v-if="loading"/>
				</div>
			</div>
			<div class="g-col">
				<div class="_heard">
					<div >
						<span class="g-fs-14">
							<span class="_red-border"/>部门排行
						</span>
						<span class="g-operation" @click="handleLowerDepart">更多</span>
					</div>
				</div>
				<div class="_body">
					<div class="g-flex __heard">
						<div class="g-col">排名</div>
						<div class="g-col">部门</div>
						<div class="g-col">业绩</div>
					</div>
					<div
						v-for="(item,i) in lowest_depart_list"
						:key="i"
						class="g-flex __table g-c-black1"
					>
						<div class="g-col">{{ item.sort_count }}</div>
						<div class="g-col">{{ item.depart_name }}</div>
						<div class="g-col">{{ item.current_money }}</div>
					</div>
					<div v-if="lowest_depart_list.length==0" class=" g-c-black1">
						<img
							:src="OSS_SEARCH_EMPTY"
						>
					</div>
					<oa-loading v-if="loading"/>
				</div>
			</div>
		</div>
		<div class="g-flex">
			<div class="g-col">
				<div class="_heard">
					<div>
						<span class="g-fs-14">
							<span class="_red-border"/>员工排行
						</span>
						<span class="g-operation" @click="handleOwntarget">更多</span>
					</div>
				</div>
				<div class="_body">
					<div class="g-flex __heard">
						<div class="g-col">排名</div>
						<div class="g-col">员工</div>
						<div class="g-col">部门</div>
						<div class="g-col">业绩</div>
					</div>
					<div
						v-for="(item,i) in lowest_staff_list"
						:key="i"
						class="g-flex __table g-c-black1"
					>
						<div class="g-col">{{ item.sort_count }}</div>
						<div class="g-col">{{ item.staff_name }}</div>
						<div class="g-col">{{ item.depart_name }}</div>
						<div class="g-col">{{ item.current_money }}</div>
					</div>
					<div v-if="lowest_staff_list.length==0" style="height:158px" class="g-flex-cc">
						<img
							:src="OSS_SEARCH_EMPTY"
						>
					</div>
					<oa-loading v-if="loading"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { DatePicker, Table } from 'iview';
import API from '@stores/apis/root';
import { OSS_FLOW, OSS_SEARCH_EMPTY } from "@constants/constants";
import moment from 'moment';
import { ModalRank } from './popup/rank';
import { AllDepart } from './popup/all-depart';
import { OwnTarget } from './popup/own-target';
import { ZoneTarget } from './popup/zone-target';
import { LowerDepart } from './popup/lower-depart';
import { AllZone } from './popup/all-zone';
import { ownDetail } from './popup/own-detail';

export default {
	components: {
		"i-date-picker": DatePicker,
		"i-table": Table,
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			open: false,
			value3: '',
			loading: false,
			performance: {
				depart_name: "",
			},
			zone_list: [], // 战区排行
			lowest_depart_list: [], // 下级部门
			brothers_lower_depart_list: [], // 所有部门
			lowest_staff_list: [], // 下级员工
			staff_list: [],
			top_list: [],
			OSS_FLOW,
		};
	},
	mounted() {
		let i = moment().format('YYYY-MM');
		this.value3 = i;
		this.loadList();

	},
	methods: {
		// 选择月份
		handleOpenChange(v) {
			this.open = v;
		},
		loadList() {
			this.$request({
				url: API._SALE_MAIN_DATA_ACHIEVEMENT_GET,
				type: "get",
				param: {
					month: this.value3
				}
			}).then(res => {
				this.performance = res.data.performance;
				this.brothers_lower_depart_list = res.data.brothers_lower_depart_list || [];
				this.lowest_depart_list = res.data.lowest_depart_list || [];
				this.lowest_staff_list = res.data.lowest_staff_list || [];
				this.zone_list = res.data.zone_list || [];
				this.top_list = res.data.top20_list || [];
			}).catch(error => {
				console.error(error);
			});
		},
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			this.open = false;
			this.loadList();
		},
		handleClear() {
			this.open = false;
		},
		handleOk() {
			this.open = false;
		},
		handleMore() {
			ModalRank.popup({});
		},
		handleAllZone() {
			AllZone.popup({});
		},
		handleOwntarget() {
			ownDetail.popup({
				data: { type: 3 }
			});
		},
		handleZoneTarget() {
			ZoneTarget.popup({});
		},
		handleLowerDepart() {
			AllDepart.popup({
				data: {
					type: 0
				}
			});
		}
	},
};
</script>

<style scoped lang="scss">
    .v-sale-main-rankings-super-manager{
        display: inline-block;
        width: 100%;
        min-height: 500px;
        padding-bottom: 30px;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
        .iconfont {
            font-size: 40px;
        }
        ._bottom {
            width: 100px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            background: rebeccapurple;
        }
       ._title {
            height: 46px;
            line-height: 46px;
            font-size: 14px;
            background: #f8f8f8;
            span {
                margin: 0 10px;
            }
        }
        ._heard {
            margin: 20px;
        }
        ._body {
            position: relative;
            padding: 0 20px;
            min-height: 150px;
            .__heard {
                height: 40px;
                padding-left: 40px;
                line-height: 40px;
                background: #f0f4fc;

                & > div {
                    text-align: left;
                }
            }
            .__table {
                border-bottom: 1px solid #edeef1;
                padding-left: 40px;
                height: 40px;
                line-height: 40px;
                & > div {
                    text-align: left;
                }
            }
        }
        ._red-border {
            display: inline-block;
            width: 2px;
            height: 12px;
            background: #e74854;
            vertical-align: baseline;
            margin-right: 10px;
            margin-top: 2px;
        }
    }
</style>

