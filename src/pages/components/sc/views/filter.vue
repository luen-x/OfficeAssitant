<template>
	<div>
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search" 
					size="large" 
					placeholder="请输入反馈人姓名" 
					style="width: 300px" 
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-10 g-red-btn-small"
					style="width: 60px;height:32px"
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
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>

			<div>
				<div v-if="$auth[1242]" class="g-inline-block">
					<vc-debounce-click
						class="g-red-btn-line g-m-r-5"
						@click="handleOriginator"
					>
						发起反馈建议
					</vc-debounce-click>
				</div>

				<div v-if="$auth[1243]" class="g-inline-block">
					<vc-debounce-click
						class="g-red-btn-line g-m-r-5"
						@click="handleAnswer"
					>
						去回复问题
					</vc-debounce-click>
				</div>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-bg-gray-mid g-pd-10">
				<i-input
					v-model="staff_search" 
					clearable 
					placeholder="请输入回复人名称" 
					style="width: 220px" 
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-date-picker
					v-model="create_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择反馈开始/结束时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="reply_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择回复开始/结束时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="stop_solve_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择解决开始/结束时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from "moment";
import { OriginatorModal } from "./modal/originator";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: String(query.search || ''), // 反馈人名称、手机号或职位
			staff_search: String(query.staff_search || ''), // 回复人名称
			create_time: String(query.create_time || ''), // 反馈时间
			create_time_start: "", // 反馈开始时间
			create_time_end: "", // 反馈结束时间
			reply_time: String(query.reply_time || ''), // 回复时间
			reply_time_start: "", // 回复开始时间
			reply_time_end: "", // 回复结束时间
			stop_solve_time: String(query.stop_solve_time || ''), // 回复时间
			stop_solve_time_start: "", // 解决开始时间
			stop_solve_time_end: "", // 解决结束时间
			show: false
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	methods: {
		handleSearch(event) {
			this.create_time_start = this.create_time[0]
			    && moment(this.create_time[0]).format("YYYY-MM-DD HH:mm:ss");
			this.create_time_end = this.create_time[1]
			    && moment(this.create_time[1]).format("YYYY-MM-DD HH:mm:ss");
			this.reply_time_start = this.reply_time[0]
			    && moment(this.reply_time[0]).format("YYYY-MM-DD HH:mm:ss");
			this.reply_time_end = this.reply_time[1]
				&& moment(this.reply_time[1]).format("YYYY-MM-DD HH:mm:ss");
			this.stop_solve_time_start = this.stop_solve_time[0]
			    && moment(this.stop_solve_time[0]).format("YYYY-MM-DD HH:mm:ss");
			this.stop_solve_time_end = this.stop_solve_time[1]
				&& moment(this.stop_solve_time[1]).format("YYYY-MM-DD HH:mm:ss");

			this.$router.replace(getHashUrl(
				'/sc/views', 
				{ 
					...this.$route.query, 
					search: this.search,
					staff_search: this.staff_search,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end,
					reply_time_start: this.reply_time_start,
					reply_time_end: this.reply_time_end,
					stop_solve_time_start: this.stop_solve_time_start,
					stop_solve_time_end: this.stop_solve_time_end,
					issue_id: ""

				}
			));
			this.$store.commit('SC_VIEWS_LIST_INIT');
		},

		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleAnswer() {
			this.$router.push({
				path: "/sc/reply/answer",
				query: {
					from: "avatar"
				}
			});
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		// 发起反馈
		handleOriginator() {
			OriginatorModal.popup().then(res => {
				res && this.$store.commit('SC_VIEWS_LIST_RESET', { type: this.type });
			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
