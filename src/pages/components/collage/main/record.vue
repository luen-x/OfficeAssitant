<template>
	<div class="v-collage-main-record">
		<oa-title title="客户服务" />
		<div class="_record g-m-t-20">
			<div v-if="recordList.length">
				<div
					v-for="(item, index) in recordList"
					:key="index"
					class="_item g-pd-30 g-pd-tb-20 g-pointer"
					@click="handleClickService(item)">
					<i-row class="g-fs-16 g-lh-36">{{ item.contract_company_name }}</i-row>
					<i-row class="g-lh-26 g-fs-12 g-c-black4 g-m-t-5">
						<i-col span="8">
							下单产品：
							<span class="g-c-black2">{{ item.product_name }}</span>
						</i-col>
						<i-col v-if="item.lesson_type == 2" span="8">
							课程类型：
							<span class="g-c-black2">{{ item.lecture_set_name }}</span>
						</i-col>
						<i-col v-if="item.lesson_type == 1" span="8">
							套系：
							<span class="g-c-black2">{{ item.lecture_set_name }}</span>
						</i-col>
						<i-col span="8">
							下单时间：
							<span class="g-c-black2">{{ item.create_time }}</span>
						</i-col>
					</i-row>
					<i-row class="g-lh-26 g-fs-12 g-c-black4">
						<i-col span="8">
							流程对接人：
							<span class="g-c-black2">{{ item.main_role }}</span>
						</i-col>
						<i-col span="8">
							协助流程对接人：
							<span class="g-c-black2">{{ item.assist_role }}</span>
						</i-col>
						<i-col span="8">
							讲师：
							<span class="g-c-black2">{{ item.lecturer_role }}</span>
						</i-col>
					</i-row>
					<i-row class="g-lh-26 g-fs-12 g-c-black4">
						<i-col span="8">
							主持人：
							<span class="g-c-black2">{{ item.host_role }}</span>
						</i-col>
						<i-col span="8">
							唱单：
							<span class="g-c-black2">{{ item.sing_role }}</span>
						</i-col>
						<i-col span="8">
							音控：
							<span class="g-c-black2">{{ item.volume_role }}</span>
						</i-col>
					</i-row>
				</div>
			</div>
			<div v-else class="g-tc g-pd-t-10">
				<img :src="OSS_SEARCH_EMPTY" style="width: 400px;height: 160px;" class="g-m-t-20">
				<div class="g-fs-12 g-m-t-10">您暂时没有客户服务通知~</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Row, Col } from 'iview';
import API_ROOT from '@stores/apis/root';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Title from './title';

export default {
	name: 'oa-record',
	components: {
		'i-row': Row,
		'i-col': Col,
		'oa-title': Title
	},
	data() {
		return {
			recordList: [],
			OSS_SEARCH_EMPTY
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		handleClickService(item) {
			let path = ['/collage/record/online', '/collage/record/outline'];
			this.$router.push({
				path: path[item.lesson_type - 1],
				query: {
					company: item.contract_company_name
				}
			});
		},
		loadData() {
			this.$request({
				url: '_COLLAGE_MAIN_CUSTUMER_SERVICE_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.recordList = res.data;
				this.recordList.forEach(v => {
					v.main_role = v.assign.filter(e => e.role_type == 1).length ? v.assign.filter(e => e.role_type == 1)[0].staff_name : '--';
					v.assist_role = v.assign.filter(e => e.role_type == 2).length ? v.assign.filter(e => e.role_type == 2)[0].staff_name : '--';
					v.host_role = v.assign.filter(e => e.role_type == 3).length ? v.assign.filter(e => e.role_type == 3)[0].staff_name : '--';
					v.lecturer_role = v.assign.filter(e => e.role_type == 4).length ? v.assign.filter(e => e.role_type == 4)[0].staff_name : '--';
					v.sing_role = v.assign.filter(e => e.role_type == 5).length ? v.assign.filter(e => e.role_type == 5)[0].staff_name : '--';
					v.volume_role = v.assign.filter(e => e.role_type == 6).length ? v.assign.filter(e => e.role_type == 6)[0].staff_name : '--';
				});
			}).catch((error) => {
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.v-collage-main-record {
	._record {
		height: 300px;
		overflow-y: hidden;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
		._item {
			border-bottom: 1px solid #EBEEF1;
		}
	}
	._record:hover {
		overflow-y: auto;
	}
}
</style>


