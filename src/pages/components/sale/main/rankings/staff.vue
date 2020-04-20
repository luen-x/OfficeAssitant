
<template>
	<div class="v-sale-main-rankings-staff" style="height: 100%;">
		<div class="g-flex g-jc-sb _title">
			<span style="visibility: hidden;">编辑目标|2018-10</span>
			<div class="g-tc g-c-black1">业绩排行</div>
			<span class="g-operation g-fs-14">
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
		<div v-if="show" class="g-tc">
			<img :src="OSS_EMPTY" >
			<div>暂无业绩</div>
		</div>
		<div v-else class="g-flex _heard">
			<div class="__img">
				<div>第{{ performance.sort }}名</div>
			</div>
			<div class="__text">
				<div class="__name g-c-black2">
					<span class="font-size:18px">{{ performance.staff_name }}</span>
					<span class="g-m-l-20 g-c-black4">
						排名
						<span class="g-c-red-light">{{ performance.sort }}</span>
					</span>
				</div>
				<br>
				<div
					class="g-c-red-light __mark"
					style="font-size:18px"
				>&yen;{{ performance.current_money }}</div>
				<div class="g-flex __detail">
					<div>
						<div>距第一名</div>
						<div>￥{{ performance.distance_first }}</div>
					</div>
					<div>
						<div>距上一名</div>
						<div>￥{{ performance.distance_less }}</div>
					</div>
					<div v-if="performance.sort<20">
						<div>多下一名</div>
						<div>￥{{ performance.distance_more }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="_heard">
			<div>
				<span>前20名员工</span>
				<span class="g-operation" @click="handleMore">更多</span>
			</div>
		</div>
		<div class="_body">
			<div class="g-flex __heard">
				<div class="g-col">排名</div>
				<div class="g-col">员工</div>
				<div class="g-col">部门</div>
				<div class="g-col">业绩</div>
			</div>
			<div v-for="(item,i) in staff_list" v-if="i<5" :key="i" class="g-flex __table g-c-black1">
				<div class="g-col">{{ item.sort }}</div>
				<div class="g-col">{{ item.staff_name }}</div>
				<div class="g-col">{{ item.depart_name }}</div>
				<div class="g-col">{{ item.current_money }}</div>
			</div>
			<oa-loading v-if="loading"/>
			<div v-if="staff_list.length==0" style="height:158px" class="g-flex-cc g-m-t-40">
				<img :src="OSS_SEARCH_EMPTY" >
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { DatePicker, Table } from 'iview';
import { OSS_EMPTY, OSS_SEARCH_EMPTY } from "@constants/constants";
import API from '@stores/apis/root';
import moment from 'moment';
import { ModalRank } from './popup/rank';

export default {
	components: {
		"i-date-picker": DatePicker,
		"i-table": Table,
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			OSS_EMPTY,
			open: false,
			show: true,
			value3: '',
			loading: false,
			staff_list: [],
		};
	},
	mounted() {
		let i = moment().format('YYYY-MM');
		this.value3 = i;
		this.getData();
	},
	methods: {
		handleOpenChange(v) {
			this.open = v;
		},
		getData() {
			this.$request({
				url: API._SALE_MAIN_DATA_ACHIEVEMENT_GET,
				type: "get",
				param: {
					month: this.value3
				}
			}).then(res => {
				this.performance = res.data.performance;
				this.show = Array.isArray(this.performance);
				this.staff_list = res.data.top20_list;
			}).catch(error => {
				console.error(error);
			});
		},
		// 选择月份
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			this.open = false;
			this.getData();
		},
		handleClear() {
			this.open = false;
		},
		handleOk() {
			this.open = false;
		},
		handleMore() {
			ModalRank.popup({
			});
		}
	},

};
</script>

<style scoped lang="scss">
    .v-sale-main-rankings-staff {
        display: inline-block;
        width: 100%;
        height: 570px;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
        .iconfont {
            font-size: 40px;
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
            padding-bottom: 20px;
            .__img {
                margin: 20px;
                width: 98px;
                height: 98px;
                background: url("https://wya-oa.oss-cn-hangzhou.aliyuncs.com/common/energy-ball.png")
                    no-repeat;
                background-size: 100% 100%;
                position: relative;
                div {
                    position: absolute;
                    top: 20px;
                    left: 28px;
                }
            }
            .__text {
                margin-top: 20px;
                .__name {
                    display: inline-block;
                }
                .__mark {
                    display: inline-block;
                    padding: 5px 0;
                    border-bottom: 1px solid #edeef1;
                }
                .__detail {
                    div {
                        margin: 5px 40px 5px 0;
                    }
                    & > div {
                        border-right: 1px solid #edeef1;
                    }
                    div:last-child {
                        border: none;
                    }
                }
            }
        }
        ._body {
            position: relative;
            padding: 0 20px;
            min-height: 150px;
            .__heard {
                height: 40px;
                padding-left: 60px;
                line-height: 40px;
                background: #f0f4fc;
                & > div {
                    text-align: left;
                }
            }
            .__table {
                border-bottom: 1px solid #edeef1;
                padding-left: 60px;
                height: 40px;
                line-height: 40px;
                & > div {
                    text-align: left;
                }
            }
        }
    }
</style>

