<template>
	<div class="v-hr-details-record">
		<div class="_tabs-record">
			<oa-title title="职能履历"/>
			<div class="g-flex g-fw-w g-m-t-20">
				<div
					v-for="(item, index) in position"
					:key="index"
					class="g-flex g-m-t-20"
				>
					<div>
						<div class="__position">
							<div class="__name">{{ item.position_name }}</div>
						</div>
						<div class="g-flex-cc g-m-t-10 __time">{{ item.create_time }}</div>
					</div>
					<div v-show="index !== position.length-1" class="icon g-m-lr-10">
						<i class="iconfont icon-long-arrow g-fs-26 g-m-b-30 g-c-red-light"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Icon, Button, ButtonGroup } from "iview";
import { getItem, setItem, delItem, getHashUrl, getParseUrl, unCode } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import Title from "../../../_common/title";

export default {
	name: "v-hr-details-record",
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
				this.fetchStaffInfo();
			}
		}
	},
	created() {
		this.fetchStaffInfo();
	},
	methods: {
		fetchStaffInfo() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_PREV_NEXT_BTN_GET,
				type: "GET",
				param: {
					staff_id: unCode(query.staff_id)
				},
				loading: false
			}).then(res => {
				this.staffs = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
	}
};
</script>

<style lang="scss">
.v-hr-details-record {
    margin-top: 20px;
    position: relative;
    padding-bottom: 180px;
    ._tabs-record {
        .__position {
            border: 3px solid #fcecee;
            border-radius: 4px;
            .__name {
                border-radius: 4px;
                background-color: #e84c57;
                width: 136px;
                max-width: 136px;
                line-height: 42px;
                vertical-align: middle;
                text-align: center;
                color: #fff;
            }
        }
        .__time {
            color: #999;
        }
    }
}
</style>
