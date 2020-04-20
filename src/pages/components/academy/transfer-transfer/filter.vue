<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c ">
			<div>
				<i-input
					v-model="search.search" 
					:maxlength="50"
					clearable 
					placeholder="请输入姓名或手机号码" 
					style="width: 300px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-5 g-red-btn-small"
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

			<vc-debounce-click
				v-if="$auth[1564]"
				class="g-red-btn-line g-m-r-10"
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
		</div>
		
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-cascader
					v-model="try_depart_id"
					:data="departAll"
					:change-on-select="true"
					clearable
					transfer
					filterable
					trigger="click"
					placeholder="请选择试岗部门"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>

				<i-select
					v-model="search.position_id"
					transfer
					clearable
					placeholder="请选择应聘职位"
					style="width: 220px;"
					class="g-m-r-5"
					filterable
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in recruitAllPosition"
						:key="item.position_id"
						:value="item.position_id"
					>
						{{ item.position_name }}
					</i-option>
				</i-select>

				<i-date-picker
					v-model="try_start_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择试岗日期"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="train_pass_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择试岗离开日期"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="entry_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择入职日期"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="leave_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择离职日期"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="train_end_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择授课时间"
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
import { Input, Button, Cascader, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from "@stores/services/hr";
import moment from "moment";
import API_ROOT from "@stores/apis/root";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		'vc-expand': Expand
	},
	mixins: [
		services.departAll(),
		services.recruitAllPosition()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				search: String(query.search || ''), // 应聘者姓名或手机号搜索
				position_id: Number(query.position_id) || null // 应聘职位id
			},
			try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : [],
			try_start_time: [query.try_start_time_start, query.try_start_time_end], // 	试岗日期
			train_pass_time: [query.train_pass_time_start, query.train_pass_time_end], // 试岗离开日期
			entry_time: [query.entry_time_start, query.entry_time_end], // 入职日期
			leave_time: [query.leave_time_start, query.leave_time_end], // 离职日期
			train_end_time: [query.train_end_time_start, query.train_end_time_end], // 授课日期
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
			let [try_start_time_start, try_start_time_end] = this.try_start_time;
			let [train_pass_time_start, train_pass_time_end] = this.train_pass_time;
			let [entry_time_start, entry_time_end] = this.entry_time;
			let [leave_time_start, leave_time_end] = this.leave_time;
			let [train_end_time_start, train_end_time_end] = this.train_end_time;
			let query = {
				...this.$route.query, 
				...this.search,
				fixPosition: true,
				try_start_time_start,
				try_start_time_end,
				train_pass_time_start,
				train_pass_time_end,
				entry_time_start,
				entry_time_end,
				leave_time_start,
				leave_time_end,
				train_end_time_start,
				train_end_time_end,
				try_depart_id: this.try_depart_id.length 
					? this.try_depart_id : null
			};

			for (let key in query) {
				if (query[key] instanceof Date) {
					query[key] = moment(query[key]).format("YYYY-MM-DD");
				}
			}
			
			this.$router.replace(getHashUrl(
				'/academy/transfer/transfer',
				query
			));
			
			this.$store.commit('ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleDepartChange(selection) {
			this.try_depart_id = selection;
			this.handleSearch();
		},
		handleExport() {
			let try_depart_id = this.$route.query.try_depart_id ? (this.$route.query.try_depart_id + '').split(",").pop() : null;
				
			const url = getHashUrl(API_ROOT["ACADEMY_TRANSFER_TRANSFER_LIST_GET"], {
				is_export: 1,
				type: this.$route.query.type || "1",
				...this.$route.query,
				try_depart_id,
				"-token": this.$global.token
			});

			window.open(url);
		}
	}
};
</script>

<style lang="scss" scoped>
</style>