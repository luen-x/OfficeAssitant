<template>
	<div class="g-flex g-flex-ac v-hr-archives-person-detail-header">
		<div>
			<div class="g-flex g-flex-cc g-flex-ac _avatarimg">
				<img :src="headerData.head_img+'!4-4'" alt>
			</div>
		</div>
		<div class="_content">
			<div class="__left">
				<span class="g-fs-18 __name">{{ headerData.staff_name||headerData.applicant_name }}</span>
				<span v-if=" query.scenario!=3" class="g-fs-14 g-m-l-5 __post">{{ headerData.position_name }}</span>
				<div class="g-fs-12 __tel __item">{{ headerData.mobile }}</div>
				<div v-if="query.scenario!=3" class="g-flex __wechat">
					<div class="g-fs-12">
						<span>微信号：</span>
						{{ headerData.wechat||"--" }}
					</div>
					<div class="g-fs-12 g-m-l-20">
						<span>邮箱：</span>
						{{ headerData.email||"--" }}
					</div>
				</div>
				<div :style="{marginTop:query.scenario==3?'40px':''}" class="g-c-black-light g-m-t-20">
					<span
						v-for="(item,index) in headerData.content"
						:key="index"
						class="__sex"
					>{{ item.label }}：{{ item.value ||"--" }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Select, Option, Poptip, Button, Slider, Message } from "iview";
// utils

export default {
	name: "v-hr-archives-person-detail-header",
	components: {
		"i-select": Select,
		"i-option": Option,
		"i-poptip": Poptip,
		"i-button": Button,
		"i-slider": Slider
	},
	data() {
		const { query = {} } = this.$route;
		return {
			query,
			headerData: {
				staff_name: "", // 员工名称
				mobile: "", // 手机号
				head_img: "",
				wechat: "",
				email: "",
				content: []
			}
		};
	},
	mounted() {
		this.loadBaseInfo();
	},
	methods: {
		loadBaseInfo() {
			this.$request({
				url: API_ROOT._HR_ARCHIVES_PERSON_DETAIL_PERSON_HEADER_GET,
				type: "GET",
				param: {
					staff_id: this.$route.query.staff_id,
					scenario: this.$route.query.scenario,
					applicant_id: this.$route.query.applicant_id,
				},
				loading: false
			}).then(res => {
				this.headerData = { ...res.data };
			}).catch(err => {});
		}
	}
};
</script>

<style lang="scss">
.v-hr-archives-person-detail-header {
    padding: 40px 12px 60px 24px;
    background-color: #f5f5f6;
    position: relative;
    ._img {
        width: 110px;
        min-width: 110px;
        height: 110px;
        background-color: #eb525a;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        overflow: hidden;
    }
    ._avatarimg {
        width: 110px;
        min-width: 110px;
        height: 110px;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        overflow: hidden;
    }
    ._content {
        width: 100%;
        .__left {
            margin-left: 30px;
            .__name {
                font-size: 18px;
                font-weight: 400;
                color: rgba(75, 79, 87, 1);
            }
            .__post {
                margin-left: 15px;
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(129, 135, 148, 1);
            }
			.__tel{
				height:11px;
				font-size:14px;
				font-weight:400;
				color:rgba(75,79,87,1);
			}
            .__item {
                margin: 12px 0px;
            }
			.__wechat{
				margin-top: 20px;
				font-size:14px;
				font-weight:400;
				color:rgba(129,135,148,1);
			}
            .__sex {
                font-size: 12px;
                padding: 4px 12px;
                border-radius: 4px;
                background-color: #fff;
                margin-right: 12px;
            }
        }
    }
    ._right {
        position: absolute;
        top: 33px;
        right: 40px;
    }
    ._btn {
        margin-top: 30px;
        .__pwd {
            margin-top: 20px;
            margin-right: 10px;
            border-color: #f14b5f;
            color: #f14b5f;
            .ivu-select-selection {
                border-color: #f14b5f;
                .ivu-select-placeholder,
                i {
                    color: #f14b5f !important;
                }
            }
        }
    }
}
</style>