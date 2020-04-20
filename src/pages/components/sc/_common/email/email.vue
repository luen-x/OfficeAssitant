
<template>
	<div
		:style="{right: toggle ? '-60px' : '0',top: position.top + 'px'}"
		class="v-sc-email g-absolute g-pointer g-prevent-portal"
	>
		<div :style="`top:${$auth[778]?'60':'30'}px`" class="g-absolute g-fs-12 _toggle " @click="toggle = !toggle">
			{{ toggle ? '展开': '收起' }}
		</div>
		<div>
			<div v-if="$auth[778]" class="g-flex g-flex-cc g-fw-w _views" @click="handleAdministration">
				<i class="iconfont icon-contract g-fs-24"/>
				<span>政务申请</span>
			</div>
			<div class="g-flex g-flex-cc g-fw-w _views" @click="handleGoViews">
				<i class="iconfont icon-xiaochangxinxiang g-fs-24"/>
				<span>意见反馈</span>
			</div>

			<i-tooltip placement="bottom-end" max-width="300">
				<div class="g-flex g-flex-cc g-fw-w _load">
					<i class="iconfont icon-qrcode"/>
					<span>APP下载</span>
				</div>
				<div slot="content">
					<div class="g-flex">
						<div class="g-pd-t-5 g-pd-r-10">
							<img
								:src="OSS_IOS_QRCODE"
								:height="size"
								:width="size"
								style="display: block;"
								alt=""
							>
							<div class="g-tc">IOS下载</div>
						</div>
						<div class="g-pd-t-5">
							<img
								:src="OSS_ANDROID_QRCODE"
								:height="size"
								:width="size"
								style="display: block;"
								alt=""
							>
							<div class="g-tc">Android下载</div>
						</div>
					</div>
				</div>
			</i-tooltip>
		</div>
	</div>
</template>

<script>
import { Tooltip } from "iview";
import { OSS_WYA_LOGO, OSS_IOS_QRCODE, OSS_ANDROID_QRCODE } from "@constants/constants";
import { setClosePath } from '@components/layout/hack/single-page';


export default {
	name: "oa-email",

	components: {
		"i-tooltip": Tooltip
	},

	data() {
		return {
			position: { top: 0, right: 0 },
			toggle: true,
			OSS_WYA_LOGO,
			OSS_IOS_QRCODE,
			OSS_ANDROID_QRCODE,
			size: 100
		};
	},

	created() {
		let height = window.innerHeight || document.body.clientHeight;
		this.position.top = (height - 120) / 2;
	},

	methods: {
		handleGoViews() {
			setClosePath();
			this.$router.push({
				path: "/sc/views",
				query: {
					from: "avatar"
				}
			});
		},

		handleToggle() {
			this.toggle = !this.toggle;
		},
		handleAdministration() {
			setClosePath();
			this.$router.push(`/administration/application/mine`);
		}
	}
};
</script>

<style lang="scss">
.v-sc-email{
	width: 60px;
	// height: 180px;
	background: #FFFFFF;
	border-radius:2px;
	right: 10px;
	z-index: 2000;
	box-shadow: 0px 0px 8px 0px rgba(110, 68, 68, 0.1);
	transition: right .3s;
	._toggle{
		width:20px;
		height: 60px;
		background: #E74854;
		color: #FFFFFF;
		left: -20px;
		top: 60px;
		word-wrap:break-word;
		text-align: center;
		padding-top: 10px;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	._views,._load{
		width: 60px;
		height: 60px;
		text-align: center;

		&:hover{
			background: #FDEAEC;
			color: #E74854;
		}
	}

	._views{
		border-top-left-radius:5px;
		border-top-right-radius:5px;
	}

	._load{
		border-bottom-left-radius:5px;
		border-bottom-right-radius:5px;
	}

	.ivu-tooltip{
		&:hover{
			._load{
				background: #FDEAEC;
				color: #E74854;
			}
		}
	}
}
</style>