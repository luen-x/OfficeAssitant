<template>
	<div style="margin-top: -10px">
		<div>
			<i-input
				v-model="params.search" 
				placeholder="请输入投票主题进行搜索" 
				style="width: 320px" 
				@on-change="handleChange"
				@on-enter="handleSearch"
			/>
			<i-button 
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span 
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle" 
			>
				更多搜索条件
				<i 
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
			<vc-debounce-click
				class="g-red-btn-line g-m-r-5 g-fr"
				@click="handleNewVote">
				新建投票
			</vc-debounce-click>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-select
					v-model="params.vote_method"
					clearable
					style="width:220px"
					class="g-m-r-5"
					placeholder="请选择投票方式"
					@on-change="handleSearch"
				>
					<i-option :value="2">记名投票</i-option>
					<i-option :value="1">匿名投票</i-option>
				</i-select>

				<i-data-picker 
					v-model="params.start_time" 
					style="width: 220px"
					class="g-m-r-5" 
					type="date" 
					transfer
					clearable
					placeholder="请选择投票时间"
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import moment from 'moment';
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { PModalRetatedMatter } from '../academy-train-detail/_common/popup/related-matter';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			params: {
				search: String(query.search || ''),
				vote_method: Number(query.vote_method),
				start_time: query.start_time || '',
			},
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/vote/0/manage', 
				{ 
					...this.$route.query, 
					...this.params,
					start_time: this.params.start_time && moment(this.params.start_time).format("YYYY-MM-DD")
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_VOTE_0_MANAGE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange() {
			if (!this.params.search) {
				this.handleSearch();
			}
		},
		handleNewVote() {
			PModalRetatedMatter.popup({ type: 'vote' }).then(res => {

				this.$router.push(getHashUrl(
					'/hr/academy/train/detail/vote/1/add', 
					{ 
						relation_type: res.relation_type,
						label: res.label,
						relation_id: res.relation_id,
						project_id: res.project_id,
					}
				));
			}).catch(res => console.error);
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
