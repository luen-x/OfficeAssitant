<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="param.company"
					:maxlength="50"
					placeholder="请输入公司名称、客户姓名或电话" 
					style="width: 320px" 
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button 
					type="primary"
					class="g-m-l-5 g-red-btn-small"
					@click="handleSearch"
				>
					搜索
				</i-button>

				<!-- <span 
				type="primary"
				class="g-m-l-10 g-m-t-5 g-red-btn-line g-fr"
				@click="handleSelectTitle"
			>
				选择表头
			</span> -->
				
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
			<i-dropdown class="g-fr g-m-l-10 g-m-t-5">
				<div @mouseenter="flag = false" @mouseleave="flag = true">
					<i-button class="_btn ">
						更多功能
						<i v-if="flag" class="iconfont icon-down g-fs-12"/>
						<i v-else class="iconfont icon-up g-fs-12"/>
					</i-button>
				</div>
				<i-dropdown-menu slot="list">
					<i-dropdown-item>
						<span @click="handleSelectTitle">选择表头</span>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
			
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px; padding-bottom: 7px">
				<i-input
					v-model="param.process_staff"
					clearable
					placeholder="请输入流程对接人姓名"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="param.lecture_staff"
					clearable
					placeholder="请输入讲师姓名"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="param.contract_num"
					clearable
					placeholder="请输入合同编号"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="param.product_name"
					clearable
					
					placeholder="请输入下单产品"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="param.invitor_staff"
					clearable
					placeholder="请输入邀约人姓名"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-date-picker
					v-model="param.order_time"
					clearable
					transfer
					type="daterange"
					placeholder="请选择下单时间"
					style="width: 220px;"
					separator=" 至 "
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="param.assign_time"
					clearable
					transfer
					placeholder="请选择分配时间"
					style="width: 220px;"
					type="daterange"
					separator=" 至 "
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-select
					v-if="isCharge"
					v-model="param.self_contract"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择合同类型"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option :value="0">全部合同</i-option>
					<i-option :value="1">我的合同</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import { TableTitle } from "../../_common/table-title/table-title";

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"vc-expand": Expand,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			flag: true,
			param: {
				company: String(query.company || ''),
				process_staff: String(query.process_staff || ''),
				lecture_staff: String(query.lecture_staff || ''),
				contract_num: String(query.contract_num || ''),
				product_name: String(query.product_name || ''),
				order_time: [String(query.order_start_time || ''), String(query.order_end_time || '')],
				assign_time: [String(query.assign_start_time || ''), String(query.assign_end_time || '')],
				self_contract: String(query.self_contract || ''),
				invitor_staff: String(query.invitor_staff || '')
			}
		};
	},
	computed: {
		isCharge() {
			return this.$global.staff.is_charge;
		}
	},
	methods: {
		handleSearch() {
			const { 
				param, 
				param: { 
					order_time: [order_start_time, order_end_time],
					assign_time: [assign_start_time, assign_end_time],
					...rest
				}
			} = this;
			this.$router.replace(getHashUrl(
				'/collage/record/online', 
				{ 
					...this.$route.query,
					fixPosition: true,
					...rest,
					order_start_time: order_start_time && moment(order_start_time).format("YYYY-MM-DD"),
					order_end_time: order_end_time && moment(order_end_time).format("YYYY-MM-DD"),
					assign_start_time: assign_start_time && moment(assign_start_time).format("YYYY-MM-DD"),
					assign_end_time: assign_end_time && moment(assign_end_time).format("YYYY-MM-DD"),
				}
			));
			this.$store.commit('COLLAGE_RECORD_ONLINE_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.collageRecordOnline.title[this.$route.query.type || "1"];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: "_COLLAGE_BUSINESS_TABLE_SAVE_POST",
				mutation: "COLLAGE_RECORD_ONLINE_TITLE_CHANGE",
				type: this.$route.query.type || "1",
				scenario: 3
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit("collage-record-online-title-change", { type: this.$route.query.type || "1" });
				this.$store.commit("COLLAGE_RECORD_ONLINE_LIST_INIT", {
					type: this.$route.query.type || "1"
				});
			}).catch(err => {
			});
		}
	}
};
</script>

<style lang="scss" scoped>
._btn {
		border-color: #e84854;
		color: #e84854;
		height: 32px;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
</style>