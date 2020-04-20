<template>
	<div class="v-administration-matter-sea-progress g-flex g-fw-w g-m-t-20">
		<div
			v-for="(item, index) in info.assign"
			:key="index"
			class="_progress-item g-flex g-ai-c g-m-b-20">
			<div class="_info g-pd-20 g-m-r-20">
				<i-row class="g-m-b-10">
					<i-col span="9">负责人</i-col>
					<i-col span="10">{{ item.responsible_staff_name }}</i-col>
					<i-col
						span="5"
						class="g-c-blue-mid g-pointer">
						<span @click="handleShowDetail(item,type)">详情</span>
					</i-col>
				</i-row>
				<i-row class="g-m-b-10">
					<i-col span="9">负责部门</i-col>
					<i-col span="15">{{ item.responsible_depart_name }}</i-col>
				</i-row>
				<i-row class="g-m-b-10">
					<i-col span="9">转入时间</i-col>
					<i-col span="15">{{ item.shift_to_time }}</i-col>
				</i-row>
				<i-row>
					<i-col span="9">转出时间</i-col>
					<i-col span="15">{{ item.roll_out_time }}</i-col>
				</i-row>
			</div>
			<i
				v-if="index != info.assign.length - 1"
				class="iconfont icon-long-arrow g-fs-26 g-m-r-20 g-c-red-light"/>
		</div>
	</div>
</template>


<script>
import { Row, Col } from 'iview';
import { detailModal } from '../../matter-my/popup/detail';

export default {
	name: 'oa-progress',
	components: {
		'i-row': Row,
		'i-col': Col
	},
	props: {
		info: Object,
		type: String | Number
	},
	data() {
		return {

		};
	},
	methods: {
		handleShowDetail(item) {
			detailModal.popup({
				event_id: this.info.event_id,
				event_assign_id: item.event_assign_id,
				type: this.type
			}).then(res => {
			}).catch(err => {});
		}
	}
};
</script>

<style lang="scss">
.v-administration-matter-sea-progress {
	._progress-item {
		._info {
			width: 210px;
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		}
	}
}
</style>
