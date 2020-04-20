<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search" 
				:maxlength="11"
				placeholder="请输入公司名称、客户姓名" 
				clearable
				style="width: 300px" 
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				class="g-m-l-10"
				type="primary"
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
			<!-- <div class="g-fr _right-text">
				<vc-debounce-click 
					v-if="$auth[266]" 
					class="g-red-btn-line" 
					@click="handleAddComplaint"
				>
					添加投诉
				</vc-debounce-click>
			</div> -->
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-input
					v-model="complain_name" 
					placeholder="请输入对象姓名" 
					clearable
					transfer
					style="width: 220px" 
					class="g-m-l-5"
					@on-change="handleInputChange"
					@on-enter="handleSearch"
				/>
				<i-input
					v-model="complain_prove_name" 
					placeholder="请输入证明人姓名" 
					clearable
					transfer
					style="width: 220px" 
					class="g-m-l-5"
					@on-change="handleInputChange"
					@on-enter="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AddComplaintModal } from '../points-confirm/popup/add-complaint.vue';

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
			search: String(query.search || ''),
			complain_name: String(query.complain_name || ''),
			complain_prove_name: String(query.complain_prove_name || ''),
			show: false
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/points/complaint', 
				{ 
					...this.$route.query, 
					search: this.search,
					complain_name: this.complain_name,
					complain_prove_name: this.complain_prove_name,
				}
			));
			this.$store.commit('HR_POINTS_COMPLAINT_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAddComplaint() {
			AddComplaintModal.popup({}).then(res => {
				this.$store.commit('HR_POINTS_COMPLAINT_LIST_INIT');
			});
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
