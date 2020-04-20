
<template>
	<div class="v-sale-main-achieve">
		<div class="g-m-t-30">
			<div class="g-flex g-jc-sb _title">
				<div class="g-flex-ac g-m-l-20">
					<span class="g-m-r-10" style="width:2px;height:14px;background:#E74854;"/>
					<span class="g-m-r-10 g-fs-14 g-c-black3">
						{{ targetName[timeType-1] }}业绩目标
					</span>
					<span
						v-if="$global.staff.is_charge==1||$global.staff.first_depart_sn=='sale'"
						class="g-operation "
						style="font-size:14px"
						@click="handleClick"
					>
						{{ type==2&&!showQuarter?'':'编辑目标' }}
					</span>
				</div>
			</div>
			<template v-if="(type==2&&!showQuarter)">
				<div style=" height: 285px;flex-direction: column;" class="g-flex-cc g-flex-ac">
					<img :src="OSS_SEARCH_EMPTY" style="max-height:100px">
					<div class="g-tc">{{ config_list.length?'当前月份没有设置季度哦~':"超管暂时还未设置季度信息哦~" }}</div>
				</div>
			</template>
			<div v-else class="g-flex g-jc-sb">
				<div style="flex: 1" class="g-tc">
					<div class="g-m-t-20 g-c-black1">保底目标</div>
					<div class="g-m-t-20 g-m-b-20 _num g-c-red-dark">{{ propor.min_target||'--' }}万</div>
					<i-circle :percent="num.min" :stroke-width="10" :trail-width="10" :size="116">
						<i-poptip :content="realMoney" :offset-y="-100" trigger="hover" placement="bottom">
							<i class="iconfont icon-saleroom" style="font-size: 32px;"/>
						</i-poptip>
					</i-circle>
					<div class="g-m-t-20 g-c-black4">已完成{{ propor.min_proportion }}</div>
				</div>
				<div class="g-tc " style="flex: 1">
					<div class="g-m-t-20 g-c-black1">平衡目标</div>
					<div class="g-m-t-20 g-m-b-20 _num g-c-red-dark">{{ propor.target||'--' }}万</div>
					<i-circle
						:percent="num.pro"
						:stroke-width="10"
						:trail-width="10"
						:size="116"
						stroke-color="#5dca4d">
						<i-poptip :content="realMoney" trigger="hover" placement="bottom">
							<i class="iconfont icon-balance" style="font-size: 36px;"/>
						</i-poptip>
					</i-circle>
					<div class="g-m-t-20 g-c-black4">已完成{{ propor.proportion }}</div>
				</div>
				<div class="g-tc" style="flex: 1">
					<div class="g-m-t-20 g-c-black1">冲刺目标</div>
					<div class="g-m-t-20 g-m-b-20 _num g-c-red-dark">{{ propor.max_target||'--' }}万</div>
					<i-circle
						:percent="num.max"
						:stroke-width="10"
						:trail-width="10"
						:size="116"
						stroke-color="#ec505b"
					>
						<i-poptip :content="realMoney" trigger="hover" placement="bottom">
							<i class="iconfont icon-rocket" style="font-size: 32px;"/>
						</i-poptip>
					</i-circle>
					<div class="g-m-t-20 g-c-black4">已完成{{ propor.max_proportion }}</div>
				</div>
			</div>
		</div>
		<div v-if="level" class="g-operation g-tc" style="font-size:14px;margin-top:62px" @click="handleMoreDetail">
			{{ type==2&&!showQuarter?'':'查看更多' }}
		</div>
		<div v-else style="height:85px"/>
		<oa-msg-modal
			v-for="(item, index) in list.filter(item=>(notice_list.length==0||notice_list[index]!=2))"
			:key="index"
			:length="list.length"
			:mask="index"
			:hierarchy="index"
			:info="item"
			@close="handleClose"
		/>
	</div>
</template>

<script type="text/ecmascript-6">
import { Circle, DatePicker, Poptip, Modal, Divider, Tabs, TabPane } from 'iview';
import API from "@stores/apis/root";
import moment from 'moment';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { editTarget } from './popup/edit-target';
import MsgModal from './popup/msg';
import { targetDetail } from './popup/target-detail';


export default {
	components: {
		"i-circle": Circle,
		"i-date-picker": DatePicker,
		"i-poptip": Poptip,
		"i-divider": Divider,
		"oa-msg-modal": MsgModal,
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
	},
	props: {
		timeType: {
			type: [String, Number],
			default: 1
		},
		showQuarter: {
			type: Boolean,
			default: true
		},
		month: [String, Number],
		year: [String, Number],
		config_id: [String, Number],
		level: [String, Number],
		config_list: [Array],

	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			targetName: ['月度', '季度', '年度'],
			type: 1,
			show: false, // 获取消息提醒
			is_open: '', // 编辑开启
			open: false,
			set: true,
			dateValue: this.month || moment().format('YYYY-MM'),
			list: [],
			notice_list: [],
			modalCount: 0,
			propor: {
				max_proportion: "",
				min_proportion: "",
				proportion: "",
			},
			num: {
			},
			realMoney: '',
		};
	},
	computed: {
		power() {
			if (this.$global.staff.is_charge == 1) {
				return true; // 超管
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 1) {
				return true; // 经理
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 0) {
				return true; // 总监
			} else if (this.$global.staff.depart_is_charge == 0) {
				return false; // 员工
			}
		}
	},
	watch: {
		timeType(v) {
			this.type = v;
			this.getProportion();
		},
		month() {
			this.getProportion();
		},
		year() {
			this.getProportion();
		},
		config_id(v) {
			this.getProportion();
		}
	},
	mounted() {
		this.getProportion();
		// this.getIsopen();
		this.notice_list = JSON.parse(sessionStorage.getItem('notice')) || [];
		if (this.notice_list.length > 0) {
			const	x = this.notice_list.find(res => {
			  return res != 2;
			});
			if (x) {
				this.getMassage();
			}
		} else {
			this.getMassage();
		}
	},
	methods: {
		handleOpenChange(v) {
			this.open = v;
		},

		handleClick() {
			editTarget.popup({
				data: { month: this.dateValue },
				date: this.timeType == 1 ? this.month : this.year,
				type: this.timeType,
				config_id: this.timeType == 2 ? this.config_id : '',

			}).then((res) => {
				this.getProportion();
			}).catch((res) => {
				console.error(res);
			});
		},
		handleMoreDetail() {
			targetDetail.popup({
				data: { month: this.dateValue },
				date: this.timeType == 1 ? this.month : this.year,
				type: this.timeType,
				config_id: this.timeType == 2 ? this.config_id : '',
			});
		},
		// 选择月份
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.dateValue = date;
			this.getProportion();
			this.open = false;
		},
		handleClear() {
			this.open = false;
		},
		handleOk() {
			this.open = false;
		},
		// 业绩kaiqi
		handleOpenSet(v) {
			this.$request({
				url: API._SALE_MAIN_TARGET_SET_POST,
				type: "post",
				param: {
					status: this.set ? 1 : 2,
				}
			}).then(res => {
				this.set = !this.set;
			}).catch(error => {
				console.error(error);
			});
		},
		// 业绩是否可编辑
		getIsopen() {
			this.$request({
				url: API._SALE_MAIN_TARGET_IS_OPEN_GET,
				type: "get",
			}).then(res => {
				this.is_open = res.data.status;
				if (this.is_open == 1) {
					this.set = false;
				}
			}).catch(error => {
				console.error(error);
			});
		},
		// 查看业绩设置

		handleClose({ index }) {
			this.modalCount--;
			if (this.modalCount <= 0) {
				this.$nextTick(() => {
					this.list = [];
				});
			}
		},
		getMassage() {
			this.$request({
				url: API._SALE_MAIN_SEND_NOTICE_GET,
				type: "get",
				param: {
				}
			}).then(res => {
				this.list = res.data || [];
				this.modalCount = this.list.length;
				let notice = [];
				this.list.forEach(ele => {
					notice.push(ele.notice_id);
				});
				this.notice_list = JSON.parse(sessionStorage.getItem('notice')) || [];
				if (!sessionStorage.getItem('notice')) {
					sessionStorage.setItem("notice", JSON.stringify(notice));
				}
			}).catch(error => {
				console.error(error);
			});
		},
		// 获取业绩百分比
		getProportion() {
			this.$request({
				url: API._SALE_MAIN_TARGET_PROPORTION_GET,
				type: "get",
				param: {
					month: this.month || moment().format('YYYY-MM'),
					year: this.year,
					config_id: this.config_id,
					type: this.type
				}
			}).then(res => {
				this.propor = { ...res.data };
				this.realMoney = res.data.real_money;
				this.num.max = this.propor.max_proportion ? parseInt(
					(this.propor.max_proportion.split('%'))[0], 10
				) : 0;
				this.num.max = this.num.max > 100 ? 100 : this.num.max;
				this.num.min = parseInt(
					(res.data.min_proportion.split('%'))[0], 10
				);
				this.num.min = this.num.min > 100 ? 100 : this.num.min;
				this.num.pro = parseInt(
					(this.propor.proportion.split('%'))[0], 10
				);
				this.num.pro = this.num.pro > 100 ? 100 : this.num.pro;
			})
				.catch(error => {
					console.error(error);
				});
		},
	},
};
</script>

<style scoped lang="scss">
.v-sale-main-achieve {
	user-select: none !important;
	border-top: 1px solid #e8e8e8;
	.iconfont {
		font-size: 40px;
	}
	._num {
		font-size: 18px;
	}
	._tabs {
		/deep/ .ivu-tabs-nav {
			float: none !important;
		}
		/deep/.ivu-tabs-bar{
			margin-bottom: 0 !important;
		}
		/deep/ .ivu-tabs-ink-bar {
			background: none !important;
		}
		/deep/ .ivu-tabs-tab-active {
			border-bottom: 3px solid #d9444f !important;
		}
	}
	._more{
		padding-top:15px;
		border-top:1px solid #ebeef1;
	}
	.icon-saleroom:hover{
		color: rgb(45, 140, 240);
	}
	.icon-balance:hover{
		color: rgb(93, 202, 77);
	}
	.icon-rocket:hover{
		color: rgb(236, 80, 91);
	}
}
</style>
