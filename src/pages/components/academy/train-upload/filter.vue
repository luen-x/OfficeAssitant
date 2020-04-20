<template>
	<div class="v-academy-train-upload js-filter">
		<div>
			<i-input
				v-model="search.staff_name"
				:maxlength="50"
				clearable 
				placeholder="请输入学员姓名搜索" 
				style="width: 300px;"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px;"
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
				<div class="g-inline-block g-m-r-5">
					<i-input-number
						v-model="search.workage_start" 
						:min="0"
						:precision="0"
						placeholder="请输入工龄最小月"
						clearable
						style="width: 220px;"
						@on-blur="handleBlur"
					/>
				</div>

				<div class="g-inline-block g-m-r-5">
					<i-input-number
						v-model="search.workage_stop"
						:min="0"
						:precision="0"
						placeholder="请输入工龄最大月"
						clearable
						class="g-m-r-10"
						style="width: 220px;"
						@on-blur="handleBlur"
					/>
				</div>

				<i-cascader
					v-model="depart_id"
					:data="departAll"
					:change-on-select="true"
					clearable
					transfer
					filterable
					trigger="click"
					placeholder="请选择部门"
					style="width: 220px;"
					@on-change="handleDepartChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, InputNumber } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from "@stores/services/hr";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
		"i-input-number": InputNumber,
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
				staff_name: String(query.staff_name || ''),
				workage_start: query.workage_start === undefined ? null : Number(query.workage_start),
				workage_stop: query.workage_stop === undefined ? null : Number(query.workage_stop)
			},
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [],
			show: false
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.loadDepartAll();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/train/upload', 
				{ 
					...this.$route.query, 
					...this.search,
					depart_id: this.depart_id.length 
						? this.depart_id : null
				}
			));
			this.$store.commit('ACADEMY_TRAIN_UPLOAD_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDepartChange(selection) {
			this.depart_id = selection;
			this.handleSearch();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleBlur() {
			this.handleSearch();
		}
	}
};
</script>

<style lang="scss">
.v-academy-train-upload{
	.ivu-input-number-handler-wrap {
        display: none !important;
	}
}
</style>