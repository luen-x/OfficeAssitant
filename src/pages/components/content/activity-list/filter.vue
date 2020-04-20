<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="activity_name"
				clearable 
				placeholder="请输入活动名称" 
				style="width: 300px"
				@on-change="handleNameChange"	
				@on-enter="handleSearch"/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-red-btn-small"
				style="margin-left: 6px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
			<span 
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle" 
			>
				更多搜索条件
				<i 
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
					class="iconfont g-fs-12 g-c-black-dark"/>
			</span>
			<vc-debounce-click 
				v-if="$auth['69']"
				class="g-fr  g-red-btn-line" 
				@click="handleNewActivity"
			>
				新增活动
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
					v-model="selectedCategory"
					clearable
					placeholder="请选择活动类型" 
					class="v-content-list_filter"
					@on-change="handleSearch"	
				>
					<i-option v-for="(item, i) in activityCategory" :value="item.category_id" :key="i">
						{{ item.category_name }}
					</i-option>
				</i-select>

				<i-data-picker 
					v-model="applyStartTime" 
					type="date"
					clearable
					placeholder="请选择报名开始日期"
					format="yyyy-MM-dd"
					class="v-content-list_filter"
					@on-change="handleSearch"
				/>

				<i-data-picker 
					v-model="applyEndTime"
					type="date"
					clearable
					placeholder="请选择报名结束日期"
					format="yyyy-MM-dd"
					class="v-content-list_filter"
					@on-change="handleSearch"	
				/>

				<i-data-picker 
					v-model="startTime"
					type="date"
					clearable
					placeholder="请选择活动开始日期"
					format="yyyy-MM-dd"
					class="v-content-list_filter"
					@on-change="handleSearch"	
				/>

				<i-data-picker 
					v-model="endTime"
					type="date"
					clearable
					placeholder="请选择活动结束日期"
					format="yyyy-MM-dd"
					class="v-content-list_filter"
					@on-change="handleSearch"	
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, formatDate } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { PModal } from './popup/add-new';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker
	},
	data() {
		const { query = {} } = this.$route;
		return {
			activity_name: String(query.activity_name || ''),
			name: String(query.name || ''),
			show: false,
			activityCategory: [],
			selectedCategory: query.category_id,
			applyStartTime: query.apply_start_time,
			applyEndTime: query.apply_end_time,
			startTime: query.start_time,
			endTime: query.end_time
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	async created() {
		const activityCategory = await this.$request({
			url: API_ROOT._CONTENT_ACTIVITY_CATEGORY_GET,
			type: 'GET'
		});
		this.activityCategory = await activityCategory.data;
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/activity/list', 
				{ 
					...this.$route.query, 
					fixPosition: true,
					activity_name: this.activity_name,
					category_id: this.selectedCategory,
					apply_start_time: this.applyStartTime && formatDate(this.applyStartTime),
					apply_end_time: this.applyEndTime && formatDate(this.applyEndTime),
					start_time: this.startTime && formatDate(this.startTime),
					end_time: this.endTime && formatDate(this.endTime)
				}
			));
			this.$store.commit('CONTENT_ACTIVITY_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleNewActivity() {
			PModal.popup().then((res) => {
			}).catch((res) => {
			});
		},
		handleNameChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};

</script>

<style lang="scss" scoped>
.v-content-list_filter {
	width: 220px;
	margin: 0 5px 0 0;
}
</style>
