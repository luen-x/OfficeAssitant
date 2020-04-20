<template>
	<div class="v-screen-message">
		<div class="_item g-jc-sb g-relative">
			<div class="__head">
				{{ message.staff_name | sliceLastTwoOfName }}
			</div>
			<div class="__body">
				<div class="__name">
					<span>{{ message.staff_name }}</span>
					<!-- <span>{{ message.praise_num }}</span> -->
					<span>{{ message.send_time }}</span>
				</div>
				<div class="__text">{{ message.content }}</div>
				<div
					v-if="message.interactImage.length"
					class="__img"
				>
					<vc-imgs-preview :data-source="handleSrcFromArr(message.interactImage)" :render-row="renderRow" />
				</div>
			</div>
			<div class="g-absolute" style="top: 10px; right: 20px">
				<span v-if="canWithdraw" class="__withdraw" @click="handleWithdraw">撤回</span>
				<span
					class="g-m-r-10"
					@click="handlePraise(message)"
				>
					<i
						v-if="message.is_praise"
						class="g-c-red-light iconfont icon-like"
						style="cursor: pointer"
					/>
					<i
						v-else
						class="g-c-red-light iconfont icon-unlike"
						style="cursor: pointer"
					/>
					<span>{{ message.praise_num }}</span>
				</span>
				<span @click="handleCollectOn(message)">
					<i
						v-if="message.is_collect"
						class="g-c-orange-light iconfont icon-collected"
						style="cursor: pointer"
					/>
					<i
						v-else
						class="g-c-orange-light iconfont icon-unmark"
						style="cursor: pointer"
					/>
				</span>
			</div>
		</div>
	</div>

</template>

<script>
import ROOT_API from '@stores/apis/root';
import { ImgsPreview } from 'wya-vc';

export default {
	name: "oa-screen-message",
	components: {
		'vc-imgs-preview': ImgsPreview
	},
	filters: {
		sliceLastTwoOfName(name) {
			if (!name) return '';
			return name.trim().slice(-2);
		}
	},
	props: {
		message: {
			type: Object,
			required: true
		},
		handlePraise: {
			type: Function,
			required: true
		},
		handleCollectOn: {
			type: Function,
			required: true
		}
	},
	data() {
		return { };
	},
	computed: {
		canWithdraw() {
			// 是否超级管理员
			const isCharge = this.$global.staff.is_charge; 
			// return (app.$route.path.includes('interaction') && Number(this.message.is_own_send))
			// || isCharge;
			return app.$route.path.includes('interaction')
				&& (Number(this.message.is_own_send) || isCharge);
		}
	},
	created() {
	},
	methods: {
		handleWithdraw() {
			this.$request({
				url: ROOT_API._SALE_MAIN_SCREEN_WITHDRAW_POST,
				type: 'POST',
				param: {
					interact_id: this.message.interact_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				const interact_id = this.message.interact_id;
				this.$store.commit('SALE_MAIN_SCREEN_WITHDRAW', { interact_id });
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSrcFromArr(arr) {
			return arr.map(v => v.image_url);
		},
		renderRow(h, params) {
			const { src, index } = params;
			return h('img', {
				attrs: {
					src: src + '!4-4',
					width: 70,
					height: 70,
				}
			});
		}
	},
};
</script>

<style lang="scss">
.v-screen-message {
	// >>> .vc-imgs-preview {
	// 	img {
	// 		width: 72px;
	// 		height: 72px;
	// 		border: 2px solid red;
	// 		margin-right: 5px;
	// 		box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
	// 	}
	// }
  ._item {
    margin: 20px 20px 10px 20px;
    background: #fafafa;
    min-height: 68px;
    padding: 15px;
    .__head {
		display: inline-block;
		vertical-align: top;
		width: 40px;
		height: 40px;
		line-height: 40px;
		border-radius: 50%;
		margin-right: 20px;
		background-color: #ec505b;
		color: #fff;
		font-size: 14px;
		left: 40px;
		text-align: center;
    }
    .__body {
		display: inline-block;
		vertical-align: top;
		width: calc(100% - 107px);
		.__name {
			span:first-child {
				font-size: 14px;
				color: #333;
			}
		}
		.__text {
			padding: 12px 0 8px 0;
			word-break: break-word;
		}
      .__img {
        img {
          width: 72px;
					height: 72px;
					border: 1px solid #d4d7db;
        }
			}
			.__item {
				margin-right: 10px;
			}
    }
	}
	.__withdraw {
		padding: 0 10px;
		cursor: pointer;
	}
}
</style>

