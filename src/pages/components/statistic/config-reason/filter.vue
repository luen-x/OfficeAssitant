<template>
	<div class="g-flex g-jc-sb">
		<div>
			<i-input
				v-model="search.reason_name" 
				:maxlength="50"
				clearable
				placeholder="请输入退款具体原因" 
				style="width: 220px"
				class="g-m-r-10"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<i-select
				v-model="search.category_id"
				clearable
				transfer
				style="width:220px;"
				class="g-m-r-10"
				placeholder="请选择原因大类"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,index) in category"
					:value="item.value"
					:key="index"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</div>

		<div>
			<vc-debounce-click
				v-if="$auth[1806]"
				class="g-red-btn-line g-m-r-10"
				@click="handleAddCategory"
			>
				原因大类
			</vc-debounce-click>

			<vc-debounce-click
				v-if="$auth[1807]"
				class="g-red-btn-line g-m-r-10"
				@click="handleAddReson"
			>
				添加具体原因
			</vc-debounce-click>

			<vc-debounce-click
				v-if="$auth[1808]"
				class="g-red-btn-line"
				@click="handleGoRecycle"
			>
				回收站（{{ deleteNum }}）
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Select, Option, Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { ReasonModal } from './modal/reason';
import { SpecificReason } from './modal/specific-reason';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;

		return {
			search: {
				reason_name: String(query.reason_name || ''),
				category_id: String(query.category_id || '')
			},
			category: []
		};
	},
	computed: {
		deleteNum() {
			return this.$store.state.statisticConfigReason.deleteNum;
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	created() {
		this.loadReasonData();
	},
	methods: {
		loadReasonData() {
			this.$request({
				url: '_STATISTIC_CONFIG_REASON_CATEGORY_LIST_GET',
				type: "GET",
				param: {}
			}).then(res => {
				this.category = [];
				res.data.forEach(item => {
					this.category.push({
						label: item.category_name,
						value: String(item.category_id)
					});
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/statistic/config/reason', 
				{ 
					...this.$route.query, 
					...this.search
				}
			));
			this.$store.commit('STATISTIC_CONFIG_REASON_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleAddCategory() {
			ReasonModal.popup({
				category: this.category
			}).then(res => {
				this.$store.commit('STATISTIC_CONFIG_REASON_LIST_INIT');
				this.loadReasonData();
			});
		},
		handleAddReson() {
			SpecificReason.popup({
				category: this.category
			}).then(res => {
				this.$store.commit('STATISTIC_CONFIG_REASON_LIST_INIT');
			});
		},
		handleGoRecycle() {
			this.$router.push({
				path: '/statistic/config/reason/recycle'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>