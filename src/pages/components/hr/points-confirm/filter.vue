<template>
	<div class="js-filter">
		<div class="v-hr-points-confirm-filter">
			<i-input
				v-model="search" 
				:maxlength="30"
				placeholder="请输入公司名称、客户姓名" 
				clearable
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10"
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
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-input
					v-model="service_staff_name" 
					placeholder="请输入服务人姓名" 
					clearable
					transfer
					class="g-m-r-5"
					style="width: 220px" 
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model="check_staff_name" 
					placeholder="请输入负责人姓名" 
					clearable
					transfer
					class="g-m-r-5"
					style="width: 220px" 
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-select
					v-if="$auth[261]"
					v-model="check_confirm" 
					transfer
					class="g-m-r-5"
					style="width: 220px" 
					@on-change="handleSearch"
				>
					<i-option v-for="item in isMycheckList" :value="item.id" :key="item.id">{{ item.label }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: String(query.search || ''),
			service_staff_name: String(query.service_staff_name || ''),
			check_staff_name: String(query.check_staff_name || ''),
			check_confirm: String(query.check_confirm || '2'),
			show: false,
			isMycheckList: [
				{
					id: '1',
					label: '我的确认'
				},
				{
					id: '2',
					label: '全部确认'
				}
			]
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/points/confirm', 
				{ 
					...this.$route.query, 
					search: this.search,
					service_staff_name: this.service_staff_name,
					check_staff_name: this.check_staff_name,
					check_confirm: this.check_confirm,
				}
			));
			this.$store.commit('HR_POINTS_CONFIRM_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>
.v-hr-points-confirm-filter {
	position: relative;
	._vidio-text {
		position: absolute;
		height: 36px;
		line-height: 36px;
		top: 55px;
		z-index: 1000;
		right: 0;
	}
}
</style>
