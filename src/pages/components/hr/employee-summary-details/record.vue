<template>
	<div class="v-hr-details-record_btn">
		<i-button-group v-if="$route.query.from !== 'avatar'" shape="circle" class="__btn">
			<i-button
				:disabled="staffs.prev.is_click==0?true:false"
				@click="handleBtn(staffs.prev.staff_id,staffs.prev.staff_name)"
			>
				<i-icon :class="staffs.prev.is_click==0 ?'g-c-black-light': 'g-c-red-light'" type="ios-arrow-back"/>
				<span :class="staffs.prev.is_click==0 ?'g-c-black-light': 'g-c-red-light'">
					{{ staffs.prev.is_click==0?'到头了':handleSlice(staffs.prev.staff_name) }}
				</span> 
			</i-button>
			<i-button
				:disabled="staffs.next.is_click==0?true:false"
				@click="handleBtn(staffs.next.staff_id,staffs.next.staff_name)"
			>
				<span :class="staffs.next.is_click==0 ?'g-c-black-light': 'g-c-red-light'">
					{{ staffs.next.is_click==0?'到底了':handleSlice(staffs.next.staff_name) }}
				</span>
				<i-icon :class="staffs.next.is_click==0 ?'g-c-black-light': 'g-c-red-light'" type="ios-arrow-forward"/>
			</i-button>
		</i-button-group>
	</div>
</template>

<script>
import { Icon, Button, ButtonGroup } from "iview";
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, unCode, enCode } from '@utils/utils';
import Title from "../_common/title";

export default {
	name: "v-hr-details-record-btn",
	components: {
		"oa-title": Title,
		"i-button-group": ButtonGroup,
		"i-button": Button,
		"i-icon": Icon
	},
	props: {
		position: Array,
		staffId: null
	},
	data() {
		return {
			staffs: {
				prev: {
					// 前一个
					staff_id: "", // 上一个员工id
					is_click: 0, // 是否可以向前点击，1：是 0：否
					staff_name: "" // 上一个员工的名称
				},
				next: {
					// 后一个
					staff_id: "", // 下一个员工id
					is_click: 0, // 是否可以向前点击，1：是 0：否
					staff_name: "" // 下一个员工的名称
				}
			}
		};
	},
	watch: {
		$route(to, from) {
			if (unCode(to.query.staff_id) != unCode(from.query.staff_id)) {
				this.loadStaffInfo();
			}
		}
	},
	created() {
		this.loadStaffInfo();
	},
	methods: {
		loadStaffInfo() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_PREV_NEXT_BTN_GET,
				type: "GET",
				param: {
					
					...query,
					staff_id: unCode(query.staff_id),
				},
				loading: false
			}).then(res => {
				this.staffs = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleBtn(id, name) {
			this.$router.push(getHashUrl(
				'/hr/employee/summary/details', 
				{ 
					...this.$route.query, 
					staff_id: enCode(id),
					staff_name: name,
				}
			));
		},
		handleSlice(val) {
		 return val.length > 3 ? val.slice(0, 3) + '...' : val;
							
		}
	}
};
</script>

<style lang="scss">
.v-hr-details-record_btn {
    .__btn {
        position: fixed;
        width: 400px;
        margin-left: -100px;
        bottom: 20px;
        z-index: 999;
        left: 50%;
        .ivu-btn-default {
            color: #333 !important;
            border: 1px solid #d4d7db !important;
        }
    }
}
</style>
