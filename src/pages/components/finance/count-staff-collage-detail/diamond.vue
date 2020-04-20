<template>
	<div class="v-finance-collage-diamond">
		<h3>{{ $attrs.lesson_name }}</h3>
		<div class="_content">
			<div class="g-flex">
				<div class="_left">担任角色：</div>
				<div class="_right">{{ $attrs.role_type_name }}</div>
			</div>
			<div class="g-flex">
				<div class="_left">课时费：</div>
				<div class="_right">{{ $attrs.class_hour_salary }}</div>
			</div>
			<div class="g-flex">
				<div class="_left">补贴：</div>
				<div class="_right">{{ $attrs.allowance_salary }}</div>
			</div>
		</div>
		<div v-if="$auth['1461']||$auth['1337']" class="_btn" @click="handleCheckPass($attrs.open_lesson_id);">
			查看详情
		</div>
	</div>
</template>

<script>
import { Progress, Button, Select, Option } from "iview";
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import { PrelectionModal } from './popup/prelection-modal.vue';

export default {
	name: "oa-diamond",
	components: {},

	data() {
		return {};
	},
	methods: {
		handleStaff(staff_id) {
			this.$router.push(
				getHashUrl("/hr/personnel/member/staff/info", {
					...this.$route.query,
					staff_id
				})
			);
		},
		handleCheckPass(id) {
			PrelectionModal.popup({
				type: 3,
				record_id: id
			}).then(res => {
				
			});
		}
	}
};
</script>
<style lang="scss" >
.v-finance-collage-diamond {
	float: left;
	margin-right: 20px;
	margin-bottom: 20px;
	padding: 40px;
	width: 230px;
	height: 260px;
	border: 1px solid #d9dce0;
	position: relative;
	cursor: pointer;
	h3 {
		font-size: 14px;
		color: #333;
	}
	._content {
		padding-top: 28px;
		color: #666;
		font-size: 12px;
		._left {
			width: 60px;
			text-align: right;
			color: #666;
			padding-bottom: 20px;
		}
		._right {
			text-align: left;
			color: #4b4f57;
		}
	}
	._btn {
		position: absolute;
		left: 0;
		bottom: 0px;
		width: 230px;
		height: 38px;
		background: #2397f9;
		line-height: 38px;
		text-align: center;
		font-size: 13px;
		color: #fff;
	}
}
</style>