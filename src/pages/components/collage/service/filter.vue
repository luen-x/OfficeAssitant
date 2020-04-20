<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.search"
					:maxlength="50"
					clearable
					placeholder="请输入公司名称、客户姓名或电话" 
					style="width: 300px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button 
					type="primary"
					
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
			<div>
				<vc-debounce-click
					class="g-red-btn-line g-m-r-10"
					@click="handleSelectTitle"
				>
					选择表头
				</vc-debounce-click>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="search.role_staff_name"
					clearable
					placeholder="请输入流程对接人、讲师姓名"
					class="g-m-r-5"
					style="width: 220px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="search.contract_num"
					clearable
					placeholder="请输入合同编号"
					class="g-m-r-5"
					style="width: 220px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="search.product_name"
					clearable
					placeholder="请输入下单产品"
					class="g-m-r-5"
					style="width: 220px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="search.staff_search"
					clearable
					placeholder="请输入邀约人姓名"
					class="g-m-r-5"
					style="width: 220px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-date-picker
					v-model="search.start_time"
					clearable
					transfer
					placeholder="选择下单时间(起始)"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="search.end_time"
					clearable
					transfer
					placeholder="选择下单时间(结束)"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="search.start_assign_time"
					clearable
					transfer
					placeholder="选择分配时间（起始）"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="search.end_assign_time"
					clearable
					transfer
					placeholder="选择分配时间（结束）"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-select
					v-if="$auth[1312]"
					v-model="search.own_contract_type"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择合同类型"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in contract_types"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="search.invalid_status"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择是否失效"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in invalidStatus"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from "moment";
import { TableTitle } from '../../_common/table-title/table-title';

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"vc-expand": Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				search: String(query.search || ""), // 客户公司、姓名、手机号
				role_staff_name: String(query.role_staff_name || ""), // 请输入流程对接人、讲师姓名
				contract_num: String(query.contract_num || ""), // 合同编号
				product_name: String(query.product_name || ""), // 产品名
				staff_search: String(query.staff_search || ""), // 邀约人姓名、手机号
				start_time: String(query.start_time || ""), // 下单开始时间
				end_time: String(query.end_time || ""), // 下单结束时间
				start_assign_time: String(query.start_assign_time || ""), // 分配开始时间
				end_assign_time: String(query.end_assign_time || ""), // 分配结束时间
				own_contract_type: String(query.own_contract_type || ""), // 分配结束时间
				invalid_status: String(query.invalid_status || "") // 是否失效
			},
			contract_types: [
				{
					value: "1",
					label: "全部合同"
				},
				{
					value: "2",
					label: "我的合同"
				}
			],
			invalidStatus: [
				{
					value: "0",
					label: "未失效"
				},
				{
					value: "1",
					label: "已失效"
				}
			],
			show: false
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/collage/service', 
				{ 
					...this.$route.query, 
					...this.search,
					fixPosition: true,
					start_time: this.search.start_time && moment(this.search.start_time).format("YYYY-MM-DD"),
					end_time: this.search.end_time && moment(this.search.end_time).format("YYYY-MM-DD"),
					start_assign_time: this.search.start_assign_time && moment(this.search.start_assign_time).format("YYYY-MM-DD"),
					end_assign_time: this.search.end_assign_time && moment(this.search.end_assign_time).format("YYYY-MM-DD")
				}
			));
			this.$store.commit('COLLAGE_SERVICE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.collageService.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: "_COLLAGE_BUSINESS_TABLE_SAVE_POST",
				mutation: "COLLAGE_SERVICE_TITLE_CHANGE",
				type: this.$route.query.type || "1",
				scenario: 2
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit("collage-service-title-change", { type: this.$route.query.type || "1" });
				this.$store.commit("COLLAGE_SERVICE_LIST_INIT", {
					type: this.$route.query.type || "1"
				});
			}).catch(err => {
			});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>