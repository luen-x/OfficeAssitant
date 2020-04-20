<template>
	<div class="v-hr-recruit-paper-filter js-filter">
		<div class="g-flex _head">
			<div>
				<i-input
					v-model.trim="keywords.paper_theme"
					clearable
					placeholder="请输入笔试主题"
					style="width:300px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
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
			</div>
			<div>
				<i-button
					class="__btn"
					@click="handleAdd"
				>
					新建
				</i-button>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="keywords.written_type"
					clearable
					transfer
					placeholder="请选择笔试类型"
					class="g-m-r-5"
					style="width: 220px;height:32px;"
					@on-change="handleSearch"
				>
					<i-option value="1">积分单选</i-option>
					<i-option value="2">跳题单选</i-option>
				</i-select>
				<i-input
					v-model.trim="keywords.add_person"
					clearable
					placeholder="请输入创建人姓名"
					class="g-m-r-5"
					style="width: 220px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model.trim="keywords.update_person"
					clearable
					placeholder="请输入修改人姓名"
					class="g-m-r-5"
					style="width: 220px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-date-picker
					v-model="keywords.create_time"
					format="yyyy-MM-dd HH:mm"
					type="datetimerange"
					clearable
					split-panels
					placeholder="请选择创建时间"
					style="width:220px;"
					class="g-m-r-5"
					@on-change="handleCreateTimeChange"
					@on-ok="handleSearch"
				/>
				<i-date-picker
					v-model="keywords.update_time"
					format="yyyy-MM-dd HH:mm"
					type="datetimerange"
					clearable
					split-panels
					placeholder="请选择修改时间"
					style="width:220px;"
					class="g-m-r-5"
					@on-change="handleUpdateTimeChange"
					@on-ok="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-recruit-paper-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			keywords: {
				paper_theme: '',
				written_type: '',
				add_person: '',
				update_person: '',
				create_time_start: '',
				create_time_end: '',
				update_time_start: '',
				update_time_end: '',
				...query,
				create_time: [query.create_time_start, query.create_time_end],
				update_time: [query.update_time_start, query.update_time_end],
			}
		};
	},
	methods: {
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 监听时间选择器的on-change事件
		 */
		handleCreateTimeChange(arr) {
			this.keywords.create_time_start = arr[0];
			this.keywords.create_time_end = arr[1];
			if (!this.keywords.create_time_start && !this.keywords.create_time_end) {
				this.handleSearch();
			}
		},
		handleUpdateTimeChange(arr) {
			this.keywords.update_time_start = arr[0];
			this.keywords.update_time_end = arr[1];
			if (!this.keywords.update_time_start && !this.keywords.update_time_end) {
				this.handleSearch();
			}
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/paper',
				{
					...this.keywords,
					create_time: undefined,
					update_time: undefined
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_PAPER_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAdd() {
			this.$router.push({
				name: 'hr-recruit-school-paper-edit',
				query: {
					action: "add"
				}

			});
		}
	}
};

</script>

<style lang="scss">
.v-hr-recruit-paper-filter {
	._head {
		justify-content: space-between;
		.__btn {
			border-color: #e84854;
			color: #e84854;
			&:hover {
				background-color: #e84854!important;
				color: #fff!important;
			}
		}
	}
}
</style>
