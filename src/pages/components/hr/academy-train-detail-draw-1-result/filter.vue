<template>
	<div>
		<div>
			<i-input
				v-model="param.search" 
				clearable
				placeholder="请输入姓名进行搜索" 
				style="width: 220px;" 
				@on-change="handleChange"
				@on-enter="handleSearch"
			/>
			<i-select
				v-model="param.status"
				clearable
				style="width:220px"
				class="g-m-l-5"
				placeholder="请选择状态"
				@on-change="handleSearch"
			>
				<i-option :value="1">未颁发</i-option>
				<i-option :value="2">已颁发</i-option>
				<i-option :value="3">已失效</i-option>
			</i-select>

			<i-select
				v-model="param.reward_id"
				clearable
				style="width:220px"
				class="g-m-l-5"
				placeholder="请选择奖项"
				@on-change="handleSearch"
			>
				<i-option 
					v-for="reward in rewardList"
					:key="reward.reward_id"
					:value="Number(reward.reward_id)">{{ reward.reward_name }}</i-option>
			</i-select>
			<i-button 
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import oaTitle from '@components/hr/academy-train-detail/_common/title';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'oa-title': oaTitle,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;
		return {
			param: {
				search: String(query.search || ''),
				status: Number(query.status) || '',
				reward_id: Number(query.reward_id) || '',
				sort_create_time: 2
			},
			rewardList: []
		};
	},
	created() {
		this.handleLotteryReward();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/draw/1/result', 
				{ 
					...this.$route.query, 
					...this.param,
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_LIST_INIT');
		},
		handleChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleLotteryReward() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_DETAIL_GET,
				param: { lottery_id: this.$route.query.lottery_id },
				type: "GET"
			}).then(({ data }) => {
				this.rewardList = data.lottery_reward;
			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
