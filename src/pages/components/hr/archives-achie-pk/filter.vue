<template>
	<div class="js-filter">
		<i-date-picker
			v-model="monthData"
			type="month"
			clearable
			transfer
			placeholder="请选择PK月份"
			style="width: 220px;"
			class="g-m-r-5"
			@on-change="handleDateChange" />
		<i-button 
			type="primary"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<div class="g-fr" >
			<div 
				v-if="listInfo[1].data.enable_add===1&&$auth['1122']&&type==='1'" 
				class="g-red-btn-line g-m-l-5" 
				@click="handleAdd"
			>添加</div>
			<div 
				v-if="$auth['1123']"
				class="g-red-btn-line g-m-l-5" 
				@click="handleExport"
			>导出</div>
		</div>	
	</div>
</template>

<script>
import { DatePicker, Button } from 'iview';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { AddModal } from './popup/add';


export default {
	name: 'oa-filter',
	components: {
		'i-button': Button,
		'i-date-picker': DatePicker,
	},
	props: {
		month: String,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			monthData: this.month || query.month,
			show: false,
			type: query.type || '1'
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesAchiePk.listInfo;
		}
	},
	watch: {
		month() {
			this.monthData = this.month;
		},
		$route(to, from) {
			if (to.query.type != from.query.type) {
				const { query = {} } = this.$route;
				this.type = query.type;
			}	
		}
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/archives/achie/pk', 
				{ 
					...this.$route.query, 
					month: this.monthData,
				}
			));
			this.$store.commit('HR_ARCHIVES_ACHIE_PK_LIST_INIT');
		},
		handleAdd() {
			AddModal.popup({
				tittle: '添加战区PK',
				pk_amount: 0,
				guard_depart_ids: [''],
				attack_depart_ids: [''],
			}).then(res => {
				this.$store.commit('HR_ARCHIVES_ACHIE_PK_LIST_INIT');
			});
		},
		handleExport() {
			let date = new Date();
			let year = date.getFullYear(); 
			let month = date.getMonth() + 1;
			month = (month < 10 ? "0" + month : month); 
			let mydate = (year.toString() + '-' + month.toString());
			const query = {
				...this.$route.query,
				month: this.$route.query.month || this.monthData || mydate,
				type: this.$route.query.type || "1",
				
			};
			window.open(getHashUrl(API_ROOT._HR_ARCHIVES_ACHIE_PK_EXPORT_GET, {
				...this.$route.query,
				...query,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleDateChange(val, name) {
			this.monthData = val;
			this.handleSearch();
		},
	}
};

</script>

<style lang="scss" scoped>
</style>
