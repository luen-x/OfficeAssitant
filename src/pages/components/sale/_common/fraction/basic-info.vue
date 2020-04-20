<template>
	<div class="v-sale-fraction-basic-info">
		<div class="_basic-info">
			<div>
				<span class="g-fs-16 g-c-black3">{{ staffInfo.staff_name || '--' }}</span>
				<span class="g-pd-lr-10 g-c-black4">{{ staffInfo.position_name || '--' }}</span>
			</div>
			<div class="g-flex">
				<div class="__info g-m-t-10">
					<span class="g-c-black4">手机号码：</span>
					<span class="__tip">{{ staffInfo.mobile || '--' }}</span>
				</div>
				<div class="__info g-m-t-10">
					<span class="g-c-black4">部门：</span>
					<span class="__tip">{{ staffInfo.depart_name || '--' }}</span>
				</div>
				<div class="__info g-m-t-10">
					<span class="g-c-black4">入职时间：</span>
					<span class="__tip">{{ staffInfo.create_time || '--' }}</span>
				</div>
				<div class="__info g-m-t-10">
					<span class="g-c-black4">工龄：</span>
					<span class="__tip">{{ staffInfo.standing || '--' }}</span>
				</div>
			</div>
			<div class="g-flex">
				<div class="__info g-m-t-10">
					<span class="g-c-black4">毕业院校：</span>
					<i-tooltip 
						v-if="staffInfo.college && staffInfo.college.length > 10"
						:content="staffInfo.college"
						transfer
						max-width="250"
					>
						<span class="__tip">{{ staffInfo.college.substr(0, 10) + '...' }}</span>
					</i-tooltip>
					<span v-else class="__tip">{{ staffInfo.college || '--' }}</span>
				</div>
				<div class="__info g-m-t-10">
					<span class="g-c-black4">学历：</span>
					<span class="__tip">{{ staffInfo.education || '--' }}</span>
				</div>
				<div class="__info g-m-t-10">
					<span class="g-c-black4">本月业绩：</span>
					<span class="__tip">{{ staffInfo.performance }}</span>
				</div>
				<div class="__info g-m-t-10">
					<span class="g-c-black4">微一案师傅：</span>
					<span class="__tip">{{ staffInfo.is_master? '是': '否' }}</span>
				</div>
			</div>
			<div class="g-flex">
				<div class="__info g-m-t-10">
					<span class="g-c-black4">管理：</span>
					<span class="__tip">{{ staffInfo.is_charge ? '是': '否' }}</span>
				</div>
				<div class="__info g-m-t-10">
					<span class="g-c-black4">徒弟：</span>
					<span v-if="staffInfo.apprentice">
						<i-tooltip 
							v-if="staffInfo.apprentice.length > 10"
							:content="staffInfo.apprentice"
							transfer
							max-width="250"
						>
							<span class="__tip">{{ staffInfo.apprentice.substr(0, 10) + '...' }}</span>
						</i-tooltip>
						<span 
							v-else 
							class="__tip"
						>
							{{ staffInfo.apprentice }}
						</span>
					</span>
					<span v-else class="__tip">--</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip } from 'iview';

export default {
	name: 'oa-fraction-basic-info',
	components: {
		'i-tooltip': Tooltip
	},
	props: {
		staffInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
		};
	},
};

export const FractionBasicInfo = module.exports.default;
</script>

<style lang="scss">
.v-sale-fraction-basic-info {
	._basic-info {
		background-color: #f6f6f6;
		padding: 25px;
		.__info {
			width: 200px;
		}
		.__tip {
			color: #333;
		}
	}
}
</style>
