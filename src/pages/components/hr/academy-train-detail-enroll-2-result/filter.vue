<template>
	<div>
		<div>
			<i-input
				v-model="param.staff_search" 
				placeholder="请输入姓名、手机号码进行搜索" 
				style="width: 320px" 
				clearable
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
				@click="handleLinkToAudit">
				审核报名课程
			</vc-debounce-click>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
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

				<i-input
					v-model="param.referee_name" 
					clearable
					placeholder="请输入推荐人姓名" 
					style="width: 220px" 
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/hr'; // 从人事部门接口获取部门级联
import { ModalTip } from '../academy-train-detail/_common/popup/model-tips';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-cascader': Cascader
	},
	mixins: [services.departAll()],
	data() {
		const { query = {} } = this.$route;
		return {
			param: {
				staff_search: String(query.staff_search || ''),
				referee_name: String(query.referee_name || ''),
				department: query.department ? query.department.split(',').map(Number) : [],
			},
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/enroll/2/result', 
				{ 
					...this.$route.query, 
					...this.param,
					fixPosition: true,
					depart_id: this.param.department.length
						? this.param.department[this.param.department.length - 1]
						: ''
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDepartSearch(department) {
			this.param.department = department;
			this.handleSearch();
		},
		handleLinkToAudit() {
			ModalTip.popup({
				title: '提示',
				content: "确定跳转到课程审核页面？"
			}).then(() => {
				this.$router.push('/hr/academy/train/schedule/add');
			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
