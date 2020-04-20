<template>
	<div class="v-sale-hr-item" @click="()=>handleStaff( $attrs.staff_id)">
		<div>
			<div class="_line _first"/>
			<div class="_line _second"/>
		</div>
		<div class="g-flex g-flex-ac g-fs-14">
			<div class="_left">
				<div class="g-flex g-flex-ac g-fd-c g-m-t-20">
					<img
						:src="$attrs.head_img"
						class="_avatar"
						alt
					>
					<div class="g-m-t-15 g-c-black3">{{ $attrs.staff_name }}</div>
					<div v-if="$attrs.identity===1" class="g-m-t-10 _master">师傅</div>
				</div>
			</div>
			<div class="_right">
				<div class="_content">
					<div class="g-flex g-c-black3 g-m-t-15">
						<div>手机:</div>
						<div class="g-m-l-10">{{ $attrs.mobile }}</div>
					</div>
					<div class="g-flex g-c-black3 g-m-t-15">
						<div>部门:</div>
						<div class="g-m-l-10">{{ $attrs.depart_name }}</div>
					</div>
					<div class="g-flex g-c-black3 g-m-t-15">
						<div>职位:</div>
						<div class="g-m-l-10">{{ $attrs.position_name }}</div>
					</div>
					<div class="g-flex g-c-black3 g-m-t-15">
						<div>工龄:</div>
						<div class="g-m-l-10">{{ $attrs.work_age }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Progress, Button, Select, Option } from "iview";
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-item",
	components: {
		"i-button": Button,
		"i-select": Select,
		"i-option": Option
	},

	data() {
		return {};
	},
	methods: {
		handleStaff(staff_id) {
			if (this.$global.auth[1233]) {
				this.$router.push(getHashUrl(
					'/hr/personnel/member/staff/info', 
					{ 
						...this.$route.query,
						staff_id
					}
				));
			}
		}
	}
};
</script>
<style lang="scss" >
.v-sale-hr-item {
	float:left;
	margin-right: 20px;
	margin-bottom: 20px;
    position: relative;
	cursor:pointer;
    ._left {
        width: 124px;
        height: 199px;
        border: 1px solid #d4d7db;
        border-radius: 4px;
        ._avatar {
            width: 70px;
			height: 70px;
            border-radius: 50%;
        }
        ._master {
            width: 60px;
            height: 20px;
            background-color: #e74854;
            border-radius: 10px;
            color: #fff;
            line-height: 20px;
            text-align: center;
        }
    }
    ._right {
        margin-left: 5px;
        width: 260px;
        height: 199px;
        border: 1px solid #d4d7db;
        border-radius: 4px;
        ._content {
            padding:10px 30px;
        }
    }

    ._line {
        position: absolute;
        width: 17px;
        height: 5px;
        left: 118px;
        background: rgba(170, 170, 170, 1);
        border-radius: 3px;
    }
    ._first {
        top: 60px;
    }
    ._second {
        top: 122px;
    }
}
</style>