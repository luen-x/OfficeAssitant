<template>
	<div v-if="showItem" class="c-academy-statistic-study-detail-tab-train">
		<div v-if="spin">
			<oa-detail-expend v-if="detailList.length" :data="detailList"/>
			<div 
				v-else
				class="g-flex g-jc-c g-ai-c"
				style="height:100%"
			>
				<div style="width:416px;margin-top: 60px;">
					<img :src="OSS_SEARCH_EMPTY" >
					<div class="g-tc">暂无数据</div>
				</div>
			</div>
		</div>
		<oa-loading v-else />
	</div>
</template>

<script>
import { Drawer, Button } from "iview";
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import { getHashUrl } from '@utils/utils';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import API_ROOT from '@stores/apis/root';
import DetailExpend from './detail-expend';

export default {
	name: "c-academy-statistic-study-detail-tab-train",
	components: {
		'oa-loading': Loading,
		'oa-detail-expend': DetailExpend,
	},
	props: {
		data: {
			type: Object,
			default: () => {
				return { 
					paper_id: 1,
				};
			}
		},
		staff: Number,
		showItem: Boolean,
		applicant: Number,
	},
	data() {
		return {
			show: false,
			detailList: [],
			isfetching: 0,
			spin: true,
			OSS_SEARCH_EMPTY
		};
	},
	watch: {
		showItem(val, old) {
			val && this.isfetching === 0 && this.loadData();
		}
	},
	created() {
		this.showItem && this.loadData();
	},
	methods: {
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			return this.$request({
				url: API_ROOT._HR_ACADEMY_STATISTIC_STUDY_DETAIL_PROJECT_GET,
				type: 'GET',
				param: {
					staff_id: this.staff,
					applicant_id: this.applicant,
				},
			}).then((res) => {
				this.detailList = res.data;
				this.spin = true;
			}).catch((error) => {
				console.error(error);
				this.spin = true;
			});
		},
	}
};
</script>
<style lang="scss" >
.c-academy-statistic-study-detail-tab-train {
}
</style>
