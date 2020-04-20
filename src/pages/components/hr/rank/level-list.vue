<template>
	<div>
		<div 
			v-for="item in info.list" 
			:key="item.rank_system_id"
			class="hr-rank-item g-box-shadow"
		>
			<div class="_tip"/>
			<div class="_head g-flex-ac g-jc-sb g-bb">
				<div>
					<span>{{ item.system_name }}-{{ item.type == 1 ? '晋级' : '称号' }}体系</span>
					<!-- eslint-disable -->
					<router-link 
						v-if="$auth[282] && item.type == 1 || $auth[283] && item.type == 2"
						:to="`/hr/rank/setting?depart_id=${depart_id}&depart_name=${depart_name}&rank_system_id=${item.rank_system_id}&name=${item.system_name}&type=${item.type}`"
						class="g-c-blue-mid g-pointer g-m-l-15"
					>
						{{ item.type == 1 ? '晋级' : '称号' }}设置
					</router-link>
					<!-- eslint-enable -->
				</div>
				<div class="g-flex-ac">
					<router-link 
						v-if="$auth[281]"
						:to="`/hr/rank/info?depart_id=${depart_id}&depart_name=${depart_name}&rank_system_id=${item.rank_system_id}`"
						class="g-c-blue-mid g-pointer"
					>
						修改
					</router-link>
					<span v-if="$auth[280] && $auth[281]" style="padding: 0 3px"><i-divider type="vertical" /></span>
					<span v-if="$auth[280]" class="g-c-blue-mid g-pointer" @click="handleDel(item.rank_system_id)">删除</span>
				</div>
			</div>
			<div 
				v-for="(level, index) in item.period || []" 
				:key="index"
				class="g-pd-tb-15"
			>
				<div class="_level-container">
					<p class="g-fs-16 g-c-red-dark g-flex-ac">
						<span class="__line g-bg-red-dark g-m-r-10"/>
						{{ level.period_num }}
					</p>
					<div class="g-m-t-20 g-flex">
						<div class="g-tc g-m-t-15 g-c-black4 g-fs-14" style="width: 130px">级称名称</div>
						<div class="g-flex-ac g-fw-w g-col">
							<oa-item 
								v-for="(rank) in level.ranks || []"
								:key="rank.rank_id"
								:type="item.type"
								:info="rank"
							/>
						</div>
					</div>	
					<div class="g-m-t-20 g-flex">
						<div class="g-tc g-c-black4 g-fs-14" style="width: 130px">级称限制</div>
						<div class="g-col g-fs-14">
							<p class="g-m-b-10">适用范围：{{ level.ranges }}</p>
							<p class="g-m-b-10">评定周期：{{ level.cycle_month }}</p>
							<p class="g-m-b-10">
								固定补贴保留：{{ level.subsidy_keep_month }}
								<span class="g-c-black4 g-m-l-30">(当员工的级称不再为该阶段的级称时，将会为其保留规定时间的当前级称补贴)</span>
							</p>
							<p>
								业绩提成保留：{{ level.commission_keep_month }}
								<span class="g-c-black4 g-m-l-30">(当员工的级称不再为该阶段的级称时，将会为其保留规定时间的当前级称补贴)</span>
							</p>
						</div>
					</div>	
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Message, Divider } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Item from './item';
import { DelTipModal } from '../_common/delete-tip';

export default {
	name: 'oa-hr-rank-item',
	components: {
		'oa-item': Item,
		'i-divider': Divider
	},
	props: {
		depart_id: String | Number,
		depart_name: String,
		show: Boolean,
		info: {
			type: Object,
			default() { 
				return {};
			}
		},
		isFetched: Boolean
	},
	computed: {
		
	},
	watch: {
		show(newVal, oldVal) {
			if (newVal && true) {
				this.loadData();
			}
		},
		isFetched(newVal, oldVal) {
			if (!newVal && oldVal) {
				this.loadData();
			}
		}
	},
	created() {
		this.show && !this.isFetched && this.loadData(); 
	},
	
	methods: {
		loadData() {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RANK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					depart_id: this.depart_id
				},
			}).then((res) => {
			}).catch((error) => {
				// Message.error(error.msg);
				this.$Message.warning(error.msg);
			});
		},
		handleDel(id) {
			DelTipModal.popup({
				title: '删除提示',
				content: '是否确认删除该级称'
			}).then((res) => {
				this.request({
					url: 'HR_RANK_DEL_POST',
					type: 'POST',
					param: {
						rank_system_id: id
					},
				}).then((res) => { // eslint-disable-line
					Message.success(res.msg);
				}).catch((error) => {
					Message.error(error.msg);
				});
			}).catch((res) => {

			});
		}
	}
};
</script>

<style lang="scss">
.hr-rank-item {
	margin: 20px;
	background-color: #ffffff;
	font-size: 14px;
	color: #333333;
	._head {
		height: 54px;
		line-height: 54px;
		padding: 0 20px;
	}
	._level-container {
		padding: 0 0 0 40px;
		.__line {
			width: 2px;
			height: 16px;
			display: inline-block;
		}
	}
}
</style>


