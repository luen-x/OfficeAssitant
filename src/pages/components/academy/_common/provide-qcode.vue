<template>
	<div>
		<oa-title>发放方式</oa-title>
		<div class="v-hr-train-provide-setting">
			<div class="__left">
				<!-- <div class="__text">
					<div v-else>关联项目</div>
				</div> -->
				<div v-show="false" class="__img">
					<canvas id="canvas" style="width: 340px;height:170px;"/>
				</div>
				<div class="__img">
					<img id="image" :src="src" >
				</div>
			</div>
			<div class="__right">
				<div>
					<i-button 
						type="primary"
						style="width: 100px; margin-bottom: 15px" 
						@click="handleDownload">下载二维码</i-button></div>
				<div>
					<i-button 
						type="primary"
						class="__btn"
						style="margin-top: -6px">
						<vc-copy 
							:value="url" 
							class="__copy"
							@after="handleCopySuccess"
							@error="handleError">复制</vc-copy>
					</i-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Copy } from 'wya-vc';
import { Button } from 'iview';
import API_ROOT from '@stores/apis/root';
import qrcode, { createQRCode } from 'wya-qrcode';
import { getHashUrl, getItem } from '@utils/utils';
import oaTitle from '@components/hr/academy-train-detail/_common/title';

export default {
	name: 'oa-provide-qcrode',
	components: {
		'i-button': Button,
		'vc-copy': Copy,
		'oa-title': oaTitle
	},
	props: {
		url: {
			type: String,
			default: 'www.baidu.com'
		},
		activity_type: {
			// 1签到 2考试 3投票 4链接报名 5抽奖
			required: true,
			type: String | Number,
		},
		activity_id: {
			// 活动id：比如考试id，投票id，报名id
			required: true,
			type: String | Number,
		}

	},
	data() {
		return {
			src: createQRCode(this.url),
		};
	},
	methods: {
		handleDownload() {
			const { query } = this.$route;
			window.open(getHashUrl(API_ROOT._ACADEMY_TRAIN_PLAN_DETAIL_SIGN_QRCODE_GET, {
				activity_id: query.course_id,
				activity_type: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleCopySuccess() {
			this.$Message.success(`复制成功: ${this.url}`);
		},
		handleError(err) {
			console.error(err);
		}
	}
};
</script>

<style lang="scss">
.v-hr-train-provide-setting {
		display: flex;
		padding: 12px 0 25px 15px;
		position: relative;
		.__left {
			.__text {
				margin-bottom: 5px;
				color: #4B4F57
			}
			.__img {
				width:160px;
				height:160px;
				border:1px solid rgba(212, 215, 219, 1);
			}
		}
		.__right {
			display: flex;
			padding-left: 20px;
			justify-content: flex-end;
			flex-direction: column;
			position: absolute;
			bottom: 25px;
			left: 180px;
			.__net {
				font-size: 14px;
				color: #4B4F57;
				display: inline-block;
				padding-left: 15px;
				width:300px;
				height:32px;
				line-height: 32px;
				border:1px solid rgba(217, 220, 224, 1);
				border-radius:4px;
			}
			.__btn > span {
				display: inline-block;
				height: 32px;
				margin-top: -5px;
				line-height: 32px;
				width: 50px;	
			}
			.ivu-btn {
				padding-left: 0!important;
				padding-right: 0!important;
			}
		}
	}
</style>


