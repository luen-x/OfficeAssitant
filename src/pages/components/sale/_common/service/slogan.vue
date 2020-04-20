<template>
	<div 
		id="slogan"
		class="v-sale-service-slogan g-prevent-portal"
	>
		<div 
			class="g-tr g-pd-r-20 _header" 
			@mousedown="handleDrag"
		>
			<div v-if="showClose">
				<i 
					v-if="showClose" 
					class="icon iconfont icon-clear g-fs-14 g-pointer" 
					style="color:#818794"
					@click.stop="handleClose"/>
			</div>
			<div v-else>
				<span style="color:#818794">还剩</span>
				<span style="color:#d9444f">{{ time }}</span>
				<span style="color:#818794">秒可关闭</span>
			</div>
		</div>
		<div class="g-tc g-pd-lr-20 _content">
			<img 
				:src="oss_slogan" 
				alt="" 
				style="width:160px;"
			>
			<div class="g-tc g-m-t-20 g-fs-14">{{ msg }}</div>
		</div>
	</div>
</template>

<script>
import { setInterval, clearTimeout } from 'timers';
import { OSS_SLOGAN } from "@constants/constants";

export default {
	name: "oa-service-slogan",
	props: {
		msg: String
	},
	data() {
		return {
			time: 4, // 初始值
			showClose: false,
			timer: null,
			slogan: null,
			oss_slogan: OSS_SLOGAN
		};
	},
	mounted() {
		this.slogan = document.getElementById('slogan');
		this.countDown();
	},
	methods: {
		/**
		 * 倒计时
		 */
		countDown() {
			if (this.time == 0) {
				this.showClose = true;
			} else { 
				this.showClose = false;
				this.time--;
				this.timer = setTimeout(() => {
					this.countDown();
				}, 1000);
			}
		},
		/**
		 * 关闭弹窗
		 */
		handleClose() {
			this.timer = null;
			this.$emit('close');
		},
		/**
		 * 可视区拖拽
		 */
		handleDrag(ev) {
			let oDiv = ev.target; // 获取目标元素
            
			// 算出鼠标相对元素的位置
			let disX = ev.clientX - this.slogan.offsetLeft;
			let disY = ev.clientY - this.slogan.offsetTop;
			document.onmousemove = (e) => { 
				let left = e.clientX - disX;    
				let top = e.clientY - disY;
				
				if (left < 0) {
					left = 0;
				} else if (left > document.documentElement.clientWidth - this.slogan.offsetWidth) {
					left = document.documentElement.clientWidth - this.slogan.offsetWidth;
				}
				if (top < 0) {
					top = 0;
				} else if (top > document.documentElement.clientHeight - this.slogan.offsetHeight) {
					top = document.documentElement.clientHeight - this.slogan.offsetHeight;
				}

				this.slogan.style.left = left + 'px';
				this.slogan.style.top = top + 'px';
			};
			document.onmouseup = (e) => {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		}
	}
};

export const ServiceSlogan = module.exports.default;

</script>

<style lang="scss">
.v-sale-service-slogan {
	position: fixed;
	top: calc(50% - 155px);
	left: calc(50% - 200px);
	width: 400px;
	height: 310px;
	border-radius: 4px;
	background-color: #fff;
	box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
	z-index: 10000;
	._header {
		background-color: #F5F5F6;
		line-height: 40px;
		border-bottom: 1px solid #D4D7DB;
		&:hover {
			cursor: move;
		}
	}
	._content {
		margin-top: 40px;
	}
}
</style>

