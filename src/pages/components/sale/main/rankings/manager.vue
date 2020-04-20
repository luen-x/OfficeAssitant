
<template>
	<div class="v-sale-main-rankings-manager" style="height: 100%;">
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
		<div class="g-m-10 _border">
			<span>我的部门排行</span>
			<span class="g-m-l-10 g-operation" @click="handleAlldepart">更多</span>
		</div>
		<div class="g-flex _heard">
			<div v-if="show" style="width:100%" class="g-flex-cc g-flex-ac g-fd-c">
				<img :src="OSS_EMPTY" style="height:130px" >
				<div>暂无业绩</div>
			</div>
			<div v-else class="g-col g-flex">
				<div class="__img">
					<div>第{{ performance.sort }}名</div>
					<!-- <img src="../../../../assets/sale/energy-ball.png" alt=""> -->
				</div>
				<div class="__text">
					<div class="__name g-c-black2">
						<span class="font-size:18px">{{ performance.depart_name }}</span>
						<span class="g-m-l-20 g-c-black4">
							排名
							<span class="g-c-red-light">{{ performance.sort }}</span>/
							<span>{{ performance.count }}</span>
						</span>
					</div>
					<br>
					<div
						class="g-c-red-light __mark"
						style="font-size:18px"
					>&yen; {{ performance.current_money }}</div>
				</div>
			</div>
			<div v-if="depart_list.length>0" class="g-flex __detail">
				<div class="g-flex-ac g-fd-cr" style="width:100px">
					<div class="g-col1 _bottom g-bg-blue-light">亚军</div>
					<div class="g-m-10 g-fs-16">{{ depart_list[1].depart_name }}</div>
					<div class="g-fs-16 g-c-blue-light">&yen;{{ depart_list[1].current_money }}</div>
				</div>
				<div class="g-flex-ac g-fd-cr" style="width:120px">
					<div style="height:80px;width:120px" class="_bottom g-bg-red-light">冠军</div>
					<div class="g-m-10 g-fs-16">{{ depart_list[0].depart_name }}</div>
					<div class="g-fs-16 g-c-red-light">&yen;{{ depart_list[0].current_money }}</div>
				</div>
				<div class="g-flex-ac g-fd-cr" style="width:100px">
					<div style="height:40px" class="_bottom g-bg-green-light">季军</div>
					<div class="g-m-10 g-fs-16">{{ depart_list[2].depart_name }}</div>
					<div class="g-fs-16 g-c-green-light">&yen;{{ depart_list[2].current_money }}</div>
				</div>
			</div>
		</div>

		<div class="g-m-10 _border">
			<span>下级员工排行</span>
		</div>
		<div class="g-flex">
			<div class="g-col">
				<div class="_heard">
					<div>
						<span>本部门员工</span>
						<span class="g-operation" @click="handleOwnDetail">更多</span>
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
						v-for="(item,i) in staff_list"
						:key="i"
						class="g-flex __table g-c-black1"
					>
						<div class="g-col">{{ item.sort }}</div>
						<div class="g-col">{{ item.staff_name }}</div>
						<div class="g-col">{{ item.depart_name }}</div>
						<div class="g-col">{{ item.current_money }}</div>
					</div>
					<div v-if="staff_list.length==0" style="height:158px" class="g-flex-cc">
						<img
							:src="OSS_SEARCH_EMPTY"
							style="height:120px"
						>
					</div>
					<oa-loading v-if="loading"/>
				</div>
			</div>
			<div class="g-col">
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
					<div
						v-for="(item,i) in top_list"
						:key="i"
						class="g-flex __table g-c-black1"
					>
						<div class="g-col">{{ item.sort_count }}</div>
						<div class="g-col">{{ item.staff_name }}</div>
						<div class="g-col">{{ item.depart_name }}</div>
						<div class="g-col">{{ item.current_money }}</div>
					</div>
					<div v-if="top_list.length==0" style="height:158px" class="g-flex-cc">
						<img
							:src="OSS_SEARCH_EMPTY"
							style="height:120px"
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
import { OSS_EMPTY, OSS_SEARCH_EMPTY } from "@constants/constants";
import API from '@stores/apis/root';
import moment from 'moment';
import { ModalRank } from './popup/rank';
import { AllDepart } from './popup/all-depart';
import { ownDetail } from './popup/own-detail';

export default {
	components: {
		"i-date-picker": DatePicker,
		"i-table": Table,
	},
	data() {
		return {
			open: false,
			value3: '',
			OSS_SEARCH_EMPTY,
			OSS_EMPTY,
			show: true,
			loading: false,
			performance: {
				depart_name: "",
			},
			depart_list: [],
			staff_list: [],
			top_list: [],
		};
	},
	mounted() {
		let i = moment().format('YYYY-MM');
		this.value3 = i;
		this.getData();
	},
	methods: {
		// 选择月份
		handleOpenChange(v) {
			this.open = v;
		},
		getData() {
			this.loading = false;
			this.$request({
				url: API._SALE_MAIN_DATA_ACHIEVEMENT_GET,
				type: "get",
				param: {
					month: this.value3
				}
			}).then(res => {
				this.loading = false;
				this.performance = res.data.performance;
				this.show = Array.isArray(this.performance);
				this.depart_list = res.data.brothers_depart_list;
				this.staff_list = res.data.lowest_staff_list;
				this.top_list = res.data.top20_list;
			}).catch(error => {
				console.error(error);
			});
		},
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			this.getData();
			this.open = false;
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
		handleAlldepart() {
			AllDepart.popup({
				data: { type: 2 }
			});
		},
		handleOwnDetail() {
			ownDetail.popup({
				data: { type: 2 }
			});
		}
	},

};
</script>

<style  scoped lang="scss">
    .v-sale-main-rankings-manager{
        display: inline-block;
        width: 100%;
        height: 570px;
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
        ._border {
            padding-left: 10px;
            border-left: 2px solid red;
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
            }
        }
        ._body {
            position: relative;
            padding: 0 20px;
            min-height: 150px;
            .__heard {
                height: 40px;
                line-height: 40px;
                padding-left: 10%;
                background: #f0f4fc;
				 & > div {
                    text-align: left;
                }
            }
            .__table {
                border-bottom: 1px solid #edeef1;
                height: 40px;
                padding-left: 10%;
                line-height: 40px;
                & > div {
                    text-align: left;
                }
            }
        }
    }
</style>

