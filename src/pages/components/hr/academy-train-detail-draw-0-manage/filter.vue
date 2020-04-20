<template>
	<div style="margin-top: -10px">
		<div>
			<i-input
				v-model="param.search" 
				clearable
				placeholder="请输入抽奖名称进行搜索" 
				style="width: 220px;" 
				@on-change="handleChange"
				@on-enter="handleSearch"
			/>

			<i-data-picker 
				v-model="param.start_time" 
				style="width: 220px"
				class="g-m-l-5" 
				type="date" 
				split-panels
				transfer
				clearable
				placeholder="请选择创建时间"
				@on-change="handleSearch"
			/>

			<i-button 
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<vc-debounce-click
				class="g-red-btn-line g-m-r-5 g-fr"
				@click="handleNewDraw">
				新建抽奖
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import { Input, Button, DatePicker } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { PModalRetatedMatter } from '../academy-train-detail/_common/popup/related-matter';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-data-picker': DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			param: {
				search: String(query.search || ''),
				start_time: query.start_time || ''
			},
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/draw/0/manage', 
				{ 
					...this.$route.query, 
					...this.param, 
					start_time: this.param.start_time && moment(this.param.start_time).format("YYYY-MM-DD")
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_0_MANAGE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleNewDraw() {
			PModalRetatedMatter.popup({ type: 'draw' }).then(res => {
				this.$router.push(getHashUrl(
					'/hr/academy/train/detail/draw/1/edit', 
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
