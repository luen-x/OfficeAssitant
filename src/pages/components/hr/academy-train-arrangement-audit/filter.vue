<template>
	<div style="margin-top: 15px" class="js-filter">
		<div>
			<i-input
				v-model="param.search" 
				placeholder="请输入姓名、手机号码搜索" 
				style="width: 320px" 
				clearable
				@on-change="handleTextChange"
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
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-input
					v-model="param.course_name" 
					placeholder="请输入课程名称" 
					clearable
					style="width: 220px" 
					class="g-m-r-5"
					@on-change="handleTextChange"
					@on-enter="handleSearch"
				/>

				<i-input
					v-model="param.witness_name" 
					clearable
					placeholder="请输入证明人的姓名" 
					style="width: 220px" 
					class="g-m-r-5"
					@on-change="handleTextChange"
					@on-enter="handleSearch"
				/>

				<i-cascader
					:data="departAll"
					v-model="param.department"
					style="display: inline-block; width: 220px"
					clearable
					transfer
					trigger="click"
					change-on-select
					placeholder="请选择部门"
					class="g-m-r-5"
					@on-change="handleDepartSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { services } from '@stores/services/hr'; // 从人事部门接口获取部门级联
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [services.departAll()],
	data() {
		this.activeType = [
			{ name: '必修课', value: 1 },
			{ name: '选修课', value: 2 },
			{ name: '内训课', value: 3 }
		];
		this.examType = [
			'按梯队选', '按组织选', '线上报名', '链接报名', '手机签到', '素材库自选'
		];
		const { query = {} } = this.$route;
		return {
			param: {
				search: String(query.search || ''),
				witness_name: String(query.witness_name || ''),
				course_name: String(query.course_name || ''),
				department: query.department ? query.department.split(',').map(Number) : [],
				fixPosition: true,
			},
			
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/arrangement/audit', 
				{ 
					...this.$route.query, 
					...this.param,
					depart_id: this.param.department.length
						? this.param.department[this.param.department.length - 1]
						: ''
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleTextChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDepartSearch(department) {
			this.param.department = department;
			this.handleSearch();
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
