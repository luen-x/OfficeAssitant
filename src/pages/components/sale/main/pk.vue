
<template>
	<div class="v-sale-main-PK g-relative">
		<div class="g-flex g-jc-sb _title">
			<span style="visibility: hidden;">2018-10</span>
			<div class="g-tc g-c-black1">PK简报</div>
			<span class="g-operation" >
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
					<span style="color: #2296f9" class="g-fs-14 g-m-r-20" @click.prevent.stop="handleOpen">
						{{ value3 === '' ? 'Select date' : value3 }}
					</span>
				</i-date-picker>
			</span>
		</div>

		<div v-if="loading">
			<div >
				<div v-if="type==1&&pkList.length>0" class="g-flex _item">
					<div style="min-width:120px">
						<span v-if="level==1" class="g-fs-14 g-c-black1 ">{{ personal.staff_name }}</span>
						<span class="g-fs-12 g-c-black4" >{{ personal.depart_name }}</span>
					</div>
					<i-Progress :percent="personal.percentage" :stroke-width="16" hide-info />
					<div class="g-fs-14" style="min-width: 100px;margin-left: 10px;">&yen; {{ personal.performance }}</div>
				</div>
				<div v-if="type==1&&pkList.length>0" class="g-flex _ranking">
					<div style="flex:1">
						<div style="font-size:16px;visibility: hidden;">1</div>
						<div class="_border"/>
					</div>
					<div style="margin:5px 10px">
						<img :src="OSS_PK" alt>
					</div>
					<div style="flex:1">
						<div style="min-width:100px" class="g-fr  g-m-r-20  __num _rank-num ">
							<span class="g-c-red-light">{{ personal.victory }}</span>
							<span class="g-c-red-light">胜</span>
							<span class="g-c-green-light">{{ personal.defeat }}</span>
							<span class="g-c-green-light">负</span>
							<span class="g-c-blue-light">{{ personal.draw }}</span>
							<span class="g-c-blue-light">平</span>
						</div>
						<div class="g-clearfix _border"/>
					</div>
				</div>
				<template v-for="(item,i) in pkList">
					<div v-if="type==1&&i<3" :key="i" class="g-m-b-20 g-flex _item _list">
						<div style="min-width:120px">
							<span v-if="level==1">{{ item.staff_name }}</span>
							<span>{{ item.depart_name }}</span>
						</div>
						<i-Progress :percent="item.percentage" :stroke-width="16" hide-info status="wrong"/>
						<div class="g-fs-14" style="min-width:100px;margin-left: 10px"> &yen;{{ item.performance }}</div>
					</div>
				</template>
			</div>
			<div v-if="type==2" class="g-m-t-20">
				<template v-for="(item,i) in pkList">
					<div v-if="i<5" :key="i" class=" g-tc g-m-b-10 g-flex _rank">
						<div style="min-width:120px">
							<span>{{ item.depart_name }}</span>
						</div>
						<i-Progress
							:percent="item.percentage"
							:stroke-width="16"
							clsss="g-col"
							hide-info
							status="active"/>
						<div style="min-width:200px" class="_rank-num">
							<span style="font-size:13px">&yen;{{ item.performance }}</span>
							<span class="g-c-red-light">{{ item.victory }}</span>
							<span class="g-c-red-light">胜</span>
							<span class="g-c-green-light" >{{ item.defeat }}</span>
							<span class="g-c-green-light">负</span>
							<span class="g-c-blue-light">{{ item.draw }}</span>
							<span class="g-c-blue-light">平</span>
						</div>
					</div>
				</template>
			</div>
			<div v-if="pkList.length==0" class="g-tc g-m-t-40">
				<img :src="OSS_PIC_PK" class="g-m-t-10" alt>
				<div>本月未参加Pk</div>
			</div>
			<div
				v-if="$auth['368']"
				class="_bottom  g-operation  g-fs-14 g-absolute"
				style="font-size:14px"
				@click="handleMore"
			>查看更多</div>
		</div>
		<oa-loading v-else/>
	</div>
</template>

<script type="text/ecmascript-6">
import { Circle, DatePicker, Progress } from 'iview';
import { OSS_PIC_PK, OSS_PK } from "@constants/constants";
import moment from 'moment';
import API from '@stores/apis/root';

export const getNowMonth = () => {
	const date = new Date();
	const year = date.getFullYear();
	let month = date.getMonth() + 1;
	month = month < 10 ? '0' + month : month;
	return year + '-' + month;
};

export default {
	components: {
		"i-circle": Circle,
		"i-date-picker": DatePicker,
		"i-Progress": Progress
	},
	data() {
		return {
			open: false,
			OSS_PK,
			OSS_PIC_PK,
			value3: '',
			list: '',
			personal: '',
			pkList: '',
			level: '', // 等级：1员工级2经理级3部门级
			type: '', // 类型：1自身 2下级
			loading: false,
		};
	},
	mounted() {
		let i = moment().format('YYYY-MM');
		this.value3 = i;
		this.loadingList();
	},
	methods: {
		// 选择月份
		handleOpenChange(v) {
			this.open = v;
		},
		loadingList() {
			this.$request({
				url: API._SALE_MAIN_PK_DETA_GET,
				type: "get",
				loading: false,
				param: {
					staff_id: this.$global.staff.staff_id,
					month: this.value3,
				}
			}).then(res => {
				this.loading = true;
				this.type = res.data.type;
				this.level = res.data.level;
				this.personal = res.data.personal;
				this.pkList = res.data.pk_list;
			}).catch(error => {
				console.error(error);
			});
		},
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			this.loadingList();
			this.open = false;
		},
		handleClear() {
			this.open = false;
		},
		handleOk() {
			this.open = false;
		},
		async handleRouteByRole() {
			const { data } = await this.$request({
				url: API._SALE_MAIN_PK_STAFF_IDENTIFY_GET,
				type: "GET",
				param: {
					staff_id: this.$global.staff.staff_id
				}
			});
			return data[0];
			// return '超级管理员';
		},
		async handleMore() {
			let query = {
				page: 1,
				pageSize: 10,
				month: getNowMonth(),
				staff_type: 0,
			};
			let path = '/sale/main/pk/staff';
			const role = await this.handleRouteByRole();
			if (role == '员工') {
				query.staff_type = 0;
			} else if (role == '经理' || role == '总监') {
				query.staff_type = 1;
				path = '/sale/main/pk/department';
			} else if (role == '超级管理员') {
				query.guard_is_victory = 2;
			}
			this.$store.commit('SALE_MAIN_PK_NOW_INDEX', { nowIndex: 0 });
			this.$router.push({ path, query });
		}
	},

};
</script>
<style scoped lang="scss">
    .v-sale-main-PK {
        // display: inline-block;
        // width: 100%;
        height: 370px;
		background-color: rgba(0, 0, 0, 0);
		box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
        ._rank {
			padding: 10px 0;
			margin-left: 20px;
			margin-right: 20px;
			background: #f8f8f8;
            ._rank-num {
				text-align:right;
				padding-right: 5px;
                span:nth-child(2n) {
                    font-size: 16px;
                }
                span:nth-child(2n+1) {
                    font-size: 14px;
                }
            }
		}
		._name{
			font-size: 14px;
		}
        .g-clearfix {
            clear: both;
        }
        ._border {
            height: 1px;
            background: #ebeef1;
        }
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
        ._item {
            height: 52px;
            margin: 20px 20px 0px 20px;
            padding: 20px;
            background: #f8f8f8;
            > div {
                span:first-child {
                    font-size: 14px;
                }
            }
            span {
                margin-right: 10px;
            }
        }
        ._ranking {
            padding: 0 20px;
            .__num {
                span {
                    font-size: 16px;
                }
            }
        }
        ._list {
            height: 30px;
            padding-top: 5px;
            background: none;
        }
        ._bottom {
            clear: both;
			width: 100%;
            padding-top: 20px;
            text-align: center;
			bottom: 20px;
        }
    }
</style>
