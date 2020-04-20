<template>
	<div class="g-flex-ac g-jc-sb js-filter">
		<div>
			<i-input
				v-model="search" 
				placeholder="请输入姓名/手机/工号" 
				style="width: 220px" 
				clearable
				class="g-m-r-5"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-cascader
				:data="departAll"
				v-model="depart_id"
				:change-on-select="true"
				placeholder="请选择部门"
				trigger="click"
				clearable
				transfer
				style="width: 220px;display:inline-block"
				class="g-m-r-5"
				@on-change="handleDepartChange"
			/>
			<i-button 
				type="primary"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div v-if="!isEmptyRule">
			<div 
				v-if="$auth['918']"
				class="g-red-btn-line g-m-r-5" 
				@click="handleAddMentor"
			>
				添加师傅
			</div>
			<div 
				v-if="$auth['919']"
				class="g-red-btn-line" 
				@click="handleExport"
			>
				导出列表
			</div>
			<div 
				v-if="$global.staff.is_charge===1"
				class="g-red-btn-line" 
				@click="handleInputFile"
			>
				导入列表
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Cascader } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { services, staffByMutiTerm } from "@stores/services/hr";
import API_ROOT from '@stores/apis/root';
import { AddModal } from "./popup/audit";
import { inputPModal } from './popup/input.vue';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
	},
	mixins: [services.departAll()],
	props: {
		isEmptyRule: Boolean
	},
	data() {
		const { query = {} } = this.$route;
		return {
			depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : [],
			search: String(query.search || ''),
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrEmployeeMentorRelation.tabs || [];
		},
	},
	methods: {
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/employee/mentor/relation', 
				{ 
					...this.$route.query, 
					search: this.search,
					depart_id: this.depart_id
				}
			));
			this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
		}, 300),
		handleInputChange(e) {
			if (!e.target.value) {
				this.search = e.target.value;
				this.handleSearch();
			}
		},
		handleDepartChange(value, selected) {
			this.depart_id = value;
			this.handleSearch();
		},
		handleAddMentor() {
			AddModal.popup({
				type: 1,
				first_depart_id: this.$route.query.first_depart_id || (this.tabs.length && String(this.tabs[0].first_depart_id))
			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
			});
		},
		handleInputFile() {
			inputPModal.popup({
				type: this.$route.query.type || "1"
			}).then(res => {}).catch(err => {});
		},
		handleExport() {
			const query = {
				...this.$route.query,
				is_export: 1,
				first_depart_id: this.$route.query.first_depart_id || (this.tabs.length && this.tabs[0].first_depart_id)
			};
			window.open(getHashUrl(API_ROOT.HR_EMPLOYEE_MENTOR_RELATION_LIST_GET, {
				...this.$route.query,
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};

</script>

