<template>
	<div class="g-m-t-20 js-filter">
		<div>
			<i-input
				v-model="search.search"
				placeholder="请输入学校名称" 
				style="width: 300px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button 
				type="primary"
				class="g-m-l-10"
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
			<div v-if="$auth[1727]" class="g-fr _right-text">
				<span
					class="g-red-btn-line g-m-r-5" 
					@click="handleToSchool"
				>
					新增学校
				</span>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-select
					v-model="search.school_type"
					class="g-m-r-5"
					style="width: 220px;"
					clearable
					transfer
					placeholder="请选择学校性质"
					@on-change="handleSearch"
				><i-option
					v-for="(v, index) in schoolData"
					:key="index"
					:value="v.value"
				>{{ v.label }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { SchoolModal } from './popup/school-modal';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				search: query.search || '',
				school_type: +query.school_type || null
			},
			name: String(query.name || ''),
			show: false,
			schoolData: [
				{
					label: '公办专科学校',
					value: 0,
				},
				{
					label: '公办本科学校',
					value: 1,
				},
				{
					label: '民办专科学校',
					value: 2,
				},
				{
					label: '民办本科学校',
					value: 3,
				}
			]
		};
	},
	methods: {
		handleToSchool() {
			SchoolModal.popup({

			}).then(res => {
				this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_LIST_INIT');
			}).catch(err => err && console.error(err));
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/jobfair/school', 
				{ 
					...this.$route.query, 
					...this.search,
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
