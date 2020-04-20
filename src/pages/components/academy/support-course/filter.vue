<template>
	<div class="g-flex g-fd-r g-jc-sb g-ai-c js-filter">
		<div>
			<i-input
				v-model="course_name" 
				:maxlength="50"
				placeholder="请输入课程名称进行搜索" 
				style="width: 300px" 
				clearable
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
		</div>
		<div class="g-flex">
			<vc-debounce-click
				v-if="$auth[1632]"
				class="g-red-btn-line g-m-r-10"
				@click="handleAdd"
			>
				新建课程
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AddModal } from '@components/academy/_common/course-add/add-modal';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			course_name: query.course_name || '',
			show: false
		};
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/support/course', 
				{ 
					...this.$route.query,
					course_name: this.course_name
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_COURSE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAdd() {
			AddModal.popup({
			}).then(res => {
			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
