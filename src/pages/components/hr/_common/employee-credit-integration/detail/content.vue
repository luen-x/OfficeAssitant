<template>
	<div class="v-hr-credit-integration-detail">
		<div class="_head">
			<div>
				<span style="fontSize: 18px; color: #4b4f57">{{ info.staff_name }}</span>
				<span class="g-m-l-10 g-c-black4">{{ info.position_name }}</span>
			</div>
			<div>
				<div class="_head-item">
					<span>
						<span>手机号码：</span>
						<span>{{ info.mobile }}</span>
					</span>
					<span>
						<span>部门：</span>
						<span>{{ info.depart_name }}</span>
					</span>
					<span>
						<span>入职时间：</span>
						<span>{{ info.create_time }}</span>
					</span>
					<span>
						<span>工龄：</span>
						<span>{{ info.standing }}</span>
					</span>
				</div>
				<div class="_head-item">
					<span>
						<span>毕业院校：</span>
						<span>{{ info.college }}</span>
					</span>
					<span>
						<span>学历：</span>
						<span>{{ info.education }}</span>
					</span>
					<span>
						<span>本月业绩：</span>
						<span>{{ info.performance }}</span>
					</span>
					<span>
						<span>微一案师傅：</span>
						<span>{{ info.is_master ? '是' : '否' }}</span>
					</span>
				</div>
				<div class="_head-item">
					<span>
						<span>管理：</span>
						<span>{{ info.is_charge ? '是' : '否' }}</span>
					</span>
					<span>
						<span>徒弟：</span>
						<span>{{ info.apprentice }}</span>
					</span>
				</div>
			</div>
		</div>
		
		<div class="_tab g-m-t-30" style="fontSize: 14px">
			<span :class="{_dot: tab}" @click="handleTab">{{ name }}概览</span>
			<span :class="{ _dot: !tab}" style="marginLeft: 50px" @click="handleTab">年度{{ name }}</span>
		</div>
		<div class="_tab-content g-m-t-20 g-flex g-ai-c">
			<div 
				v-for="(item, index) of tabData"
				:key="index"
			>
				<div style="color: #818794; font-size: 14px">{{ item.label }}</div>
				<div class="g-m-t-5" style="font-size: 24px; color: #333">{{ item.value }}</div>
			</div>
		</div>
		<div class="_title g-flex g-ai-c g-m-t-30">
			<span />
			<span class="g-m-l-10">年度{{ name }}</span>
		</div>
		<div class="_year g-flex g-jc-sb g-m-t-20">
			<span>{{ name }}详情</span>
			<span class="g-operation" @click="handleToggle">{{ !toggle ? '展开' : '收起' }}</span>
		</div>
		<transition name="fade">
			<div v-if="toggle" class="_year-content">
				<i-table :columns="columns" :data="detail" />
			</div>
		</transition>
		<div class="_title g-flex g-ai-c g-jc-sb g-m-t-30 g-m-b-10">
			<div class="_title">
				<span />
				<span class="g-m-l-10">得分详情</span>
				<i-datepicker
					v-model="formdata.month" 
					type="month"
					class="g-m-l-20"
					placeholder="请选择月份" 
					style="width: 220px"
					transfer
					@on-change="handleSearch"
				/>
			</div>
			<span 
				v-if="query.cate === '1' ? $auth[870] : $auth[884]"
				class="g-red-btn-line g-m-l-20"
				@click="handleAdd">新增{{ name }}记录</span>
		</div>
		<div v-if="goalDetailArr.length==0" class="g-flex g-flex-cc g-flex-ac">
			<div class="_empty">
				<img :src="nodataUrl" class="_img g-m-b-20" alt >
				<div>暂无数据</div>
			</div>
		</div>
		<oa-item
			v-for="(item, index) of goalDetailArr"
			v-else
			:key="index"
			:data-info="item"
			:handle-search="handleSearch"
			class="g-m-t-10" />
	</div>
</template>

<script>
import { Button, DatePicker, Card, Table } from 'iview';
import moment from 'moment';
import { OSS_EMPTY } from '@constants/constants';
import Item from './item';
import { AddModal } from './credit-popup/add';
import columns from './columns';

export default {
	name: 'hr-detail',
	components: {
		'i-button': Button,
		'i-datepicker': DatePicker,
		'i-card': Card,
		'oa-item': Item,
		'i-table': Table
	},
	mixins: [columns],
	data() {
		const { query = {} } = this.$route;
		return {
			query,
			formdata: {},
			tab: true,
			tabData: [],
			toggle: false,
			goalDetailArr: [],
			month: [],
			year: [],
			detail: [],
			info: {},
			nodataUrl: OSS_EMPTY
		};
	},
	computed: {
		name() {
			const { query = {} } = this.$route;
			return query.cate === '1' ? '积分' : '学分';
		}
	},
	mounted() {
		this.loadGoal();
		this.loadGoalDetail();
		this.loadInfo();
	},
	methods: {
		handleTab() {
			this.tab = !this.tab;
			this.tabData = this.tab ? this.month : this.year;
		},
		handleToggle() {
			this.toggle = !this.toggle;
		},
		handleAdd() {
			AddModal.popup({
				query: this.query
			}).then(res => {

			}).catch(err => {

			});
		},
		handleSearch() {
			this.loadGoal();
			this.loadGoalDetail();
		},
		loadInfo() {
			const { query = {} } = this.$route;
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_CREDITINTE_INFO_GET',
				type: 'GET',
				param: {
					...query,
				},
				loading: false
			}).then(res => {
				this.info = res.data;
			}).catch(err => {

			});
		},
		loadGoal() {
			const { query = {} } = this.$route;
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_CREDITINTE_GOAL_GET',
				type: 'GET',
				param: {
					...query,
					month: this.formdata.month && moment(this.formdata.month).format('YYYY-MM'),
				},
				loading: false
			}).then(res => {
				let { month = {}, year = {}, detail } = res.data;
				this.detail = detail;
				this.month = this.handleMonth(month);
				this.year = this.handleYear(year);
				this.tabData = this.tab ? this.month : this.year;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.tabData = [];
				this.year = [];
				this.month = [];
			});
		},
		handleMonth(month) {
			let handlemonth = [];
			(month.detail || []).forEach(item => {
				handlemonth.push({
					label: item.type_name,
					value: item.point
				});
			});
			handlemonth.push({
				label: '合计总分',
				value: month.sum
			});
			return handlemonth;
		},
		handleYear(year) {
			let handleyear = [];
			(year.detail || []).forEach(item => {
				handleyear.push({
					label: item.month,
					value: item.point
				});
			});
			handleyear.push({
				label: '合计总分',
				value: year.sum
			});
			handleyear.push({
				label: `可用晋升${this.name}`,
				value: year.usable_sum
			});
			return handleyear;
		},
		loadGoalDetail() {
			const { query = {} } = this.$route;
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_CREDITINTE_GOAL_DETAIL_GET',
				type: 'GET',
				param: {
					...query,
					month: this.formdata.month && moment(this.formdata.month).format('YYYY-MM'),
				},
				loading: false
			}).then(res => {
				this.goalDetailArr = res.data.length ? res.data : [];
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>
<style lang="scss">
.v-hr-credit-integration-detail {
	margin-top: 15px;

	._head {
		background: #F5F5F6;
		padding: 20px 20px;

		._head-item {
			margin-top: 10px;

			& > span {
				display: inline-block;
				min-width: 180px;
				& > span:first-child {
					color: #818794
				}
				& > span:last-child {
					color: #333;
				}
			}
		}
	}

	._tab {
		& > span {
			display: inline-block;
			padding-bottom: 5px;
			cursor: pointer;
		}
	}

	._tab-content {
		background: #F5F5F6;
		padding: 10px 0;
		height: 120px;

		& > div {
			flex: 1;
			text-align: center;
			border-right: 1px solid #D4D7DB;
		}
		& > div:last-child {
			border-right: none;
		}
	}

	._dot {
		color: #E84C57;
		border-bottom: 2px solid #E84C57;
	}

	._title {
		font-size: 14px;

		& > span:first-child {
			display: inline-block;
			background: #E74854;
			width: 2px;
			height: 14px;
		}
	}

	._year {
		padding: 10px 15px;
		background: #F0F4FC;
	}
	._year-content {
		padding-bottom: 0;

		.ivu-table-wrapper > .ivu-table th {
			background: #fff !important;
		}
	}
	.fade-enter-active, .fade-leave-active {
		transition: height .5s;
	}
	.fade-enter, .fade-leave-to {
		height: 0;
	}
	._empty {
		margin-top: 40px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
</style>


