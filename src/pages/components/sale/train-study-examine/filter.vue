<template>
	<div>
		<div class="g-m-t-10" @keyup.enter="handleSearch">
			<i-input
				v-model="course_name"
				clearable
				placeholder="请输入课程名称搜索"
				style="width: 300px"
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
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="project_topic"
					clearable
					placeholder="请输入项目主题"
					style="width: 220px"
					class="g-m-r-5"
				/>
				<i-select
					v-model="project_type"
					style="width: 220px"
					clearable
					placeholder="请选择项目类型"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option v-for="(item,index) in project" :key="index" :value="index+1">{{ item }}</i-option>
				</i-select>
				<i-select
					v-model="user_source"
					style="width: 220px"
					clearable
					placeholder="请选择课程来源"
					class="g-m-r-5"
					@on-change="handleSearch" >
					<i-option v-for="(item,index) in source" :key="index" :value="index+1">{{ item }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/sale";
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		'vc-expand': Expand
	},
	mixins: [
		services.departMy()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			project_topic: String(query.project_topic || ''),
			course_name: String(query.course_name || ''),
			project_type: String(query.project_type || ''),
			user_source: String(query.user_source || ''),
			project: ['岗前培训', '人才计划', '其他'],
			source: ['按梯队选', '按组织选', '线上报名', '链接报名', '手机签到', '素材库自选'],
			show: false,
		};
	},

	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/train/study/examine',
				{
					...this.$route.query,
					project_topic: this.project_topic,
					course_name: this.course_name,
					project_type: this.project_type,
					user_source: this.user_source,
					fixPosition: true,

				}
			));
			this.$store.commit('SALE_TRAIN_STUDY_EXAMINE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>
<style lang="scss" scoped>

</style>
