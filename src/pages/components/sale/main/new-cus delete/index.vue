<template>
	<div class="v-main-new-cus g-m-t-20">
		<div class="_head g-flex g-jc-sb">
			<div class="g-operation more g-m-l-10" style="visibility: hidden;">
				更多
			</div>
			<div class="g-c-black1  g-tc">
				新增客户
			</div>
			<div class="g-operation more g-m-r-10" @click="handleMore">
				更多
			</div>
		</div>
		<oa-staff v-if="!level"/>
		<oa-manager v-else/>
	</div>
</template>

<script type="text/ecmascript-6">
import manager from './com/manager';
import staff from './com/staff';

export default {
	components: {
		'oa-manager': manager,
		'oa-staff': staff,
	},
	data() {
		return {


		};

	},
	computed: {
		level() {
			if (this.$global.staff.is_charge == 1) {
				return 3; // 超管
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 1) {
				return 1; // 经理
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 0) {
				return 2; // 总监
			} else if (this.$global.staff.depart_is_charge == 0) {
				return false; // 员工
			}
		},
	},
	methods: {
		handleMore() {
			this.$router.push({ name: 'sale-newuser' });
		}
	}
};
</script>

<style scoped lang="scss">
.v-main-new-cus{
	box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
	.more{
		height: 46px;
        line-height: 46px;

	}
	._head{
		@extend .more;
            font-size: 14px;
            background: #f8f8f8;
        }
}
</style>
