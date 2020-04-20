<template>
	<div>
		<div>
			<i-input
				v-model="search.search"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称、姓名或手机号搜索" 
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange" 
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px"
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
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid g-flex g-fw-w g-flex-ac"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<div>
					<i-input
						v-model="search.contract_num"
						clearable
						placeholder="请输入合同编号"
						style="width: 220px;margin-right: 8px;"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>

					<i-date-picker
						v-model="start_end"
						clearable
						transfer
						type="daterange" 
						split-panels
						placeholder="请选择下单时间"
						style="width: 220px;margin-right: 8px;"
						formate="yyyy-MM-dd"
						@on-change="handleSearch"
					/>

					<i-date-picker
						v-model="upload_time"
						clearable
						transfer
						type="daterange" 
						split-panels
						placeholder="请选择上传时间"
						style="width: 220px;margin-right: 8px;"
						formate="yyyy-MM-dd"
						@on-change="handleSearch"
					/>

					<i-select
						v-model="search.product_id"
						clearable
						transfer
						style="width: 220px;margin-right: 8px;"
						placeholder="请选择下单产品"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in qualityRecords"
							:value="item.product_id"
							:key="item.product_id"
						>
							{{ item.product_name }}
						</i-option>
					</i-select>
				</div>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				search: String(query.search || ""),
				contract_num: String(query.contract_num || ""),
				product_id: String(query.product_id || "")
			},
			start_end: [query.start_time, query.end_time],
			upload_time: [query.upload_start_time, query.upload_end_time],
			show: false,
			qualityRecords: []
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.loadProductData();
	},
	methods: {
		loadProductData() {
			this.$request({
				url: '_SC_CUSTOMER_HANDOVER_PRODUCT_GET',
				type: 'GET',
				param: {}
			}).then((res) => {
				this.qualityRecords = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sc/customer/handover', 
				{ 
					...this.$route.query,
					...this.search,
					fixPosition: true,
					start_time: this.start_end[0] && moment(this.start_end[0]).format("YYYY-MM-DD"),
					end_time: this.start_end[1] && moment(this.start_end[1]).format("YYYY-MM-DD"),
					upload_start_time: this.upload_time[0] && moment(this.upload_time[0]).format("YYYY-MM-DD"),
					upload_end_time: this.upload_time[1] && moment(this.upload_time[1]).format("YYYY-MM-DD")
				}
			));
			this.$store.commit('SC_CUSTOMER_HANDOVER_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>