<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="company"
					:maxlength="50"
					clearable
					placeholder="请输入公司名称、客户姓名"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button
					type="primary"
					class="g-m-l-10"
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
					v-if="$auth[1741]"
					class="g-red-btn-line"
					@click="()=>{this.$router.push('/hr/employee/score/integration/audit')}"
				>
					员工服务
				</vc-debounce-click>
				<vc-debounce-click
					class=" g-m-r-l-10 g-red-btn-line"
					@click="handleExport"
				>
					导出
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
					v-model="staff"
					clearable
					placeholder="请输入服务人姓名"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-cascader
					v-model="depart_id"
					:data="date"
					:change-on-select="true"
					clearable
					transfer
					trigger="click"
					placeholder="请选择服务人部门"
					style="width: 220px;"
					class="g-m-r-10"
					@on-change="handleDepartChange"
				/>

				<!-- <i-input
					v-model="quality_staff"
					clearable
					placeholder="请输入审核人姓名"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/> -->

				<i-input
					v-model="start_score"
					clearable
					placeholder="请输入质检评分最小值"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="end_score"
					clearable
					placeholder="请输入质检评分最大值"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="start_return_amount"
					clearable
					placeholder="请输入回款金额最小值(万元)"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="end_return_amount"
					clearable
					placeholder="请输入回款金额最大值(万元)"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { services } from "@stores/services/sc";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
		'vc-expand': Expand
	},
	mixins: [services.departAll({ autoLoad: false })],
	data() {
		const { query = {} } = this.$route;
		return {
			company: String(query.company || ''), // 公司名称
			staff: String(query.staff || ''), // 服务人
			quality_staff: String(query.quality_staff || ''), // 负责人
			start_score: String(query.start_score || ''), // 起始评分
			end_score: String(query.end_score || ''), // 起始评分
			start_return_amount: String(query.start_return_amount || ''), // 起始回款金额
			end_return_amount: String(query.end_return_amount || ''), // 结束回款金额
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [], // 部门
			show: false
		};
	},
	computed: {
		date() {
			if (this.departAll == undefined) {
				return [];
			}

			return this.departAll;
		}
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
				'/hr/employee/score/service/examine',
				{
					...this.$route.query,
					fixPosition: true,
					company: this.company,
					staff: this.staff,
					quality_staff: this.quality_staff,
					start_score: this.start_score,
					end_score: this.end_score,
					start_return_amount: this.start_return_amount,
					end_return_amount: this.end_return_amount,
					depart_id: this.depart_id
				}
			));
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_LIST_INIT');
		},

		handleToggle() {
			this.$refs.expand.toggle();
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
		handleExport() {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "1"
			};

			window.open(getHashUrl(API_ROOT._HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_SERVICE_RECORD_AUDIT_GET, {
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}
	}
};
</script>

<style lang="scss" scoped>
</style>