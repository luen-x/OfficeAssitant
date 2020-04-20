<template>
	<div class="g-flex g-flex-ac v-hr-detail-header">
		<div v-if="$auth['693']">
			<div class="g-flex g-flex-cc g-flex-ac _avatarimg" @click="handleAvatar">
				<img :src="info.head_img+'!4-4'" alt="">
			</div>
		</div>
		<div v-else>
			<div class="g-flex g-flex-cc g-flex-ac _avatarimg" >
				<img :src="info.head_img+'!4-4'" alt="">
			</div>
		</div>
		<div class="_content">
			<div class="__left">
				<span class="g-fs-18 _name">{{ info.staff_name }}</span>
				<span class="g-fs-14 g-m-l-5 __post">{{ info.position_name }}</span>
				<div class="g-fs-12 _tel __item">{{ info.mobile }}</div>
				<div class="g-c-black-light">
					<span v-for="(item,index) in info.info" :key="index" class="__sex">{{ item }}</span>
				</div>
			</div>
		</div>
		<div v-if="staffStatus !== 4">
			<div class="_right">
				<i-poptip v-if="info.status&&info.status.length" trigger="hover" transfer>
					<i class="iconfont icon-uncomplete1 g-fs-24 g-c-yellow-mid"/>
					<div slot="content" class="api">
						<div v-for="(item, index) in info.status" :key="index">{{ item }}</div>
					</div>
				</i-poptip>
			</div>
			<div class="g-flex g-flex-ac _btn">
				<div v-if="info.is_show_master&&$auth['1226'] && $route.path !== '/hr/personnel/member/staff/info'">
					<i-button v-if="info.apply_status" class="__add" @click="loadMasterRecommend">师傅申请</i-button>
					<i-button v-else class="__pwd" @click="handleMasterApply">申请进度</i-button>
				</div>
				<i-button v-if="$auth['207']" class="__pwd" @click="handlePwd">更改密码</i-button>
				<i-dropdown
					v-if="$route.path !== '/hr/personnel/member/staff/info'"
					trigger="click"
					@on-click="handleClick"
				>
					<i-button class="__pwd">
						<span>更多</span>
						<i class="icon iconfont icon-triangle-down g-fs-12"/>
					</i-button>

					<i-dropdownMenu slot="list" >
						<i-dropdownItem
							v-for="(item, index) in options"
							:key="index"
							:name="item.name"
						>{{ item.label }}</i-dropdownItem>
					</i-dropdownMenu>
				</i-dropdown>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { getLevel } from '@components/sale/_common/util';
import { Select, Option, Poptip, Button, Slider, Message, Dropdown, DropdownMenu, Icon, DropdownItem } from "iview";
import { getItem, setItem, delItem, getHashUrl, getParseUrl, unCode } from '@utils/utils';
import { PWDModal } from "./popup/password";
import { AvatarModal } from "./popup/avatar";
import { ApplyMasterModal } from "./popup/apply-master";
import { PersonnelInfoTrack } from "../../../personnel-info-track";
// utils

export default {
	name: "v-hr-detail-header",
	components: {
		"i-select": Select,
		"i-option": Option,
		"i-poptip": Poptip,
		"i-button": Button,
		'i-slider': Slider,
		'i-dropdown': Dropdown,
		'i-dropdownMenu': DropdownMenu,
		'i-dropdownItem': DropdownItem,
		'i-icon': Icon,
	},
	props: {
		handleStatus: Function
	},
	data() {
		return {
			more: [],
			scale: 1,
			visible: false,
			rotate: 0,
			staffStatus: null,
			options: [
				{ label: '办理离职', name: "1" },
				{ label: '办理转岗', name: "2" }

			],
			info: {
				staff_name: "", // 名称
				mobile: "", // 手机号
				sex: "", // 性别
				province: "", // 省
				constellation: "", // 星座
				create_time: "", // 入职时间
				position_name: "", // 职位名称
				work_day: "", // 工龄
				ei_status: 0, // 入职状态     0：未完善；1:已完善
				resume_status: 0, // 简历状态    0：未完善；1:已完善
				bank_status: 0, // 招商银行卡状态  0：未完善；1:已完善
				info: [],
				head_img: '',
				is_show_master: false, // 师傅申请按钮状态
				apply_status: true
			}
		};
	},
	computed: {
		level() {
			return getLevel();
		}
	},
	watch: {
		$route(to, from) {
			if (
				unCode(to.query.staff_id) != unCode(from.query.staff_id)
                || to.query.name != from.query.name
			) {
				this.loadBaseInfo();
			}
		}
	},
	mounted() {
		this.loadBaseInfo();
		// this.$auth[709] ? this.options.push({ label: '员工分配', name: '3' }) : null;
	},
	methods: {
		handleAvatar() {
			AvatarModal.popup({}).then(res => {
				this.loadBaseInfo();
			});
		},
		handleMasterApply() {
			// this.info.apply_status = false;
			ApplyMasterModal.popup({
				staff_id: unCode(this.$route.query.staff_id)
			}).then(res => {
				this.loadBaseInfo();
			});
		},
		handleClose() {
			this.visible = false;
		},
		loadMasterRecommend() {
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBER_MASTER_RECOMMEND_MASTER_SAVE_POST,
				type: "POST",
				param: {
					staff_id: [unCode(this.$route.query.staff_id)],
					type: 2
				},
				loading: false
			}).then(res => {
				Message.success("申请微一案师傅成功!");
				this.info.apply_status = false;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},

		loadBaseInfo() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_HEADER_GET,
				type: "GET",
				param: {
					staff_id: unCode(this.$route.query.staff_id)
				},
				loading: false
			}).then(res => {
				this.info = { ...res.data };
				this.staffStatus = res.data.staff_status;
				 res.data.staff_status && this.handleStatus(res.data.staff_status);
				if (this.$route.query.from === 'avatar' && this.$route.path !== '/hr/personnel/member/staff/info') {
					if (this.$auth[1227]) {
						if (this.options.findIndex(it => it.name === '5') == -1) {
							this.options.push({ label: '心态跟踪', name: "5" });
						}
					}
					if (res.data.is_show_recommend) {
						if (this.options.findIndex(it => it.name === '4') == -1) {
							this.options.push({ label: '优劣势互荐', name: "4" });
						}
					}
				}
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handlePwd() {
			let staff_id = unCode(this.$route.query.staff_id);
			PWDModal.popup({ staff_id }).then(res => {});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleClick(value) {
			let { query = {} } = getParseUrl();
			let staff_id = unCode(query.staff_id);

			switch (value) {
				case "1":
					this.$router.push(
						`/hr/employee/transfer?staff_id=${staff_id}`
					);
					break;
				case "2":
					this.$router.push(
						`/hr/employee/dimission?staff_id=${staff_id}`
					);
					break;
				case "3":
					this.$router.push(
						`/hr/employee/allocation?is_majordomo=1&type=1`
					);
					break;
				case "4":
					this.$router.push({
						name: 'hr-personnel-info-recommend',
						query: {
							staff_id,
							staff_name: query.staff_name,
							from: query.from
						}
					});
					break;
				case "5":
					PersonnelInfoTrack.popup().catch((error) => {});
					break;
				default:
					break;
			}
		}
	}
};
</script>

<style lang="scss">
.v-hr-detail-header {
    padding: 40px 12px 80px 24px;
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
            .__post {
                color: #818794;
            }
            .__item {
                margin: 12px 0px;
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
        // float: right;
    }
    ._btn {
        margin-top: 30px;
        .__pwd, .__add {
            margin-top: 20px;
            margin-right: 10px;
			border-color: #f14b5f;
			color:#f14b5f;
			.ivu-select-selection{
				border-color: #f14b5f;
				.ivu-select-placeholder,i{
					color:#f14b5f !important;
				}
			}
        }
    }
}
</style>