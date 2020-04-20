<template>
	<div class="v-hr-archives-achie-trend-staff">
		<div class="_count">
			<div class="_count-title g-flex g-ai-c g-pd-l-15 g-bg-gray-mid">
				<h3 class="g-m-r-20">
					员工排名
				</h3>
				<i-select
					v-model="staff_id"
					:remote-method="loadStaffNew"
					:loading="staffLoading"
					:placeholder="'请输入姓名'"
					style="width: 220px"
					filterable
					remote
					clearable
					transfer
					@on-change="handleStaffChange"
				>
					<i-option
						v-for="(item) in staffData"
						:key="item.value"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</div>
			<div class="_charts">
				<oa-bar :value="data"/>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
// import { staffByOwn } from '@stores/services/hr';
import { DebounceClick } from "wya-vc";
import { Button, Cascader, Select, Option } from "iview";
import { initTreeData } from '@utils/utils';
import echarts from './oa-charts.vue';
import Bar from './bar.vue';

export default {
	name: "oa-tpl",
	components: {
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		'oa-echarts': echarts,
		'oa-bar': Bar,
		
	},
	// mixins: [
	// 	staffByOwn
	// ],
	data() {
		return {
			// close: true,
			staff_id: '',
			data: [],
			staffList: [],
			staffLoading: false,
			staffData: [],
		};
	},
	mounted() {
	},
	methods: {
		loadData(id) {
			this.$request({
				url: API_ROOT._HR_ARCHIVES_ACHIE_TREND_STAFF_GET,
				type: "GET",
				param: {
					staff_id: id || this.staff_id || ''
				},
				loading: false
			}).then(res => {
				this.data = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleStaffChange(staff_id) {
			if (staff_id) {
				this.staff_id = staff_id;
				this.loadData();
			}
		},
		loadStaffNew(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_ARCHIVES_ACHIE_TREND_SEARCH_STAFF_GET,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
					if (res.data.length === 1) {
						this.loadData(res.data[0].staff_id);
					}
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};
</script>

<style lang="scss" >
.v-hr-archives-achie-trend-staff {
	min-width: 804px;
	border:1px solid rgba(212, 215, 219, 1);
	margin-top:20px;
    ._count {
        height: 400px;
        ._count-title {
            height: 50px;
        }
    }
    ._charts {
        height: 350px;
        ._charts-title {
            height: 46px;
            line-height: 46px;
        }
	}
}
</style>
