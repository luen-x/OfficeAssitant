<template>
	<div class="_header">
		<div class="__left" @click="handleClick('pre')">
			<i class="icon iconfont icon-left g-fs-26" />
		</div>
		<div class="__center">
			<div class="__name">{{ examInfo.staff_name.slice(-2) }}</div>
			<div class="__desc">
				<div class="g-m-b-5">
					<span class="g-fs-18">{{ examInfo.staff_name }}</span>
					<span class="g-c-black5 g-fs-14 g-pd-l-10">{{ examInfo.depart_name }}</span>
				</div>
				<div>
					<span class="g-c-black2 g-fs-14">分数：</span>
					<span class="g-c-red-mid g-fs-14">{{ examInfo.result_score }}</span><span class="g-fs-14">分</span>
					<span class="__notice">{{ examInfo.pass_info }}</span>
					<span class="g-c-black2 g-fs-14" style="margin-left: 50px">排名：第{{ examInfo.participator_rank }}名</span>
				</div>
			</div>
		</div>
		<div class="__right" @click="handleClick('next')">
			<i class="icon iconfont icon-right g-fs-26" />
		</div>
	</div>
</template>
<script>
export default {
	props: {
		examInfo: Object
	},
	data() {
		return {};
	},
	methods: {
		handleClick(type) {
			this.$emit('student-change', type);
		}
	}
};
</script>
<style lang="scss" scoped>
._header {
		display: flex;
		width:800px;
		height:130px;
		box-shadow:0px 0px 6px 0px rgba(102,102,102,0.2);
		border-radius:6px;
		margin: 15px auto 0;
		margin-top: 27px;
		.__left,
		.__right {
			width: 55px;
			cursor: pointer;
			display: flex;
			align-items: center;
			color: #bbb;
			&:hover {
				color: #2397F9 !important
			}
		}
		.__left {
			justify-content: flex-end;
		}
		.__center {
			justify-content: center;
			align-items: center;
		}
		.__center {
			flex: 1;
			display: flex;
			.__name {
				width: 72px;
				height: 72px;
				background-color: #EC505B;
				color: #fff;
				font-size: 24px;
				line-height: 72px;
				text-align: center;
				border-radius: 50%;
				margin-right: 20px;
			}
			.__desc {
				.__notice {
					display: inline-block;
					border: 1px solid rgb(232,76,87);
					border-radius:3px;
					color: rgb(232,76,87);
					padding: 0px 5px;
					margin-left: 5px;
				}
			}
		}
	}
</style>


