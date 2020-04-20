<template>
	<div 
		:style="{right: toggle ? '0px' : '-360px',height }" 
		class="v-hr-main-side">
		<div v-if="top_info.title">
			<oa-title :title="top_info.title" class="_title" />
			<div class="_shadow-box">
				<div class="g-fs-14 __head">
					<span class="g-c-red-mid">{{ top_info.count }}人</span>
					<span style="color: #bbb">{{ top_info.msg }}</span>
				</div>
				<div class="g-pd-tb-10">
					<p class="g-flex-ac g-jc-sb g-fs-14 g-c-black-dark g-m-b-10 g-pd-lr-15">
						<span>{{ mid_info_one.title }}</span>
					</p>
					<div class="g-flex g-fw-w g-ac-sb g-pd-l-10 __peoples">
						<div 
							v-for="(item, index) in mid_info_one.list " 
							:key="index" 
							class="g-flex g-flex-ac g-flex-cc __item">
							<div class="g-flex g-fd-c g-flex-cc g-flex-ac">
								<div class="__avatar g-m-t-10">
									{{ item.staff_name.slice(-2) }}
								</div>
								<div class="g-m-t-5">
									<p>{{ (item.staff_name || '').length > 4 
										? item.staff_name.substr(0, 4) + '...' 
									: item.staff_name }}
									</p>
									<p class="g-c-black5">
										{{ (item.position_name || '').length > 4 
											? item.position_name.substr(0, 4) + '...' 
										: item.position_name }}
									</p>
								</div>
							</div>
	
						</div>
					</div>
				</div>
			</div>
		</div>
	
		<div v-if="mid_info_two.title">
			<oa-title :title="mid_info_two.title" class="_title" />
			<div class="_shadow-box _interview-container g-flex-ac g-jc-sb">
				<div v-for="(item, index) in mid_info_two.list" :key="index" class="g-fs-12">
					<p class="g-c-black5">
						<span class="g-c-red-mid g-fs-16">{{ item.value }}</span>人
					</p>
					<p>{{ item.label }}</p>
				</div>
			</div>
		</div>
		<div v-if="bottom_info.title">
			<oa-title :title="bottom_info.title" class="_title" />
			<div class="_shadow-box _performance-container">
				<div v-for="(item, index) in bottom_info.list" :key="index" class="g-m-b-10">
					<p class="g-c-black2">{{ item.content }}</p>
					<p class="g-c-black4">
						{{ item.create_time }}
						<span v-if="item.staff_name" class="g-m-l-20">{{ item.staff_name }}</span>
					</p>
				</div>
			</div>
		</div>
		<oa-bookmark :toggle="toggle" @toggle="handleToggle" />
	</div>
</template>

<script>
import Bookmark from '@components/_common/bookmark/bookmark';
import Title from './title';

export default {
	name: 'hr-main-side',
	components: {
		'oa-title': Title,
		'oa-bookmark': Bookmark
	},
	data() {
		return {
			isExpand: false,
			tipList: [],
			toggle: false,
			height: '100%'
		};
	},

	computed: {
		top_info() {
			return this.$store.state.hrMain.data.top_info || {};
		},
		mid_info_one() {
			return this.$store.state.hrMain.data.mid_info_one || { list: [] };
		},
		mid_info_two() {
			return this.$store.state.hrMain.data.mid_info_two || {};
		},
		bottom_info() {
			return this.$store.state.hrMain.data.bottom_info || {};
		}
	},
	
	mounted() {
		window.addEventListener('resize', this.setHeight, true); // 监听窗口变化
	},
	methods: {
		handleExpand() {
			this.isExpand = !this.isExpand;
		},
		handleToggle() {
			this.toggle = !this.toggle;
		},
		setHeight() {
			let winWidth;
			if (window.innerWidth) winWidth = window.innerWidth;
			else if (document.body && document.body.clientWidth) winWidth = document.body.clientWidth;
			if (winWidth > 1366) {
				this.height = '100%';
			} else {
				this.height = 'calc(100% - 58px)';
			}
		}
	}
};
</script>

<style lang="scss">
.v-hr-main-side {
	min-width: 360px;
	max-width: 360px;
	padding: 20px 15px;
	overflow: auto;
	background-color: #f5f5f7;
	top: 56px;
	._title {
		margin-top: 6px;
		margin-bottom: 19px;
	}
	._survey-container {
		height: 130px;
		padding: 0 15px;
		color: #333333;
	}
	._record-container {
		max-height: 300px;
		padding: 15px;
	}
	._interview-container {
		height: 130px;
		padding: 0 15px;
		color: #333333;
	}
	._performance-container {
		max-height: 300px !important;
		padding: 20px 15px;
	}
	._shadow-box {
		margin-bottom: 25px; // box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		max-height: 400px; // overflow-y: auto;
		overflow: hidden;
		background-color: #ffffff;
		.__head {
			height: 48px;
			line-height: 48px;
			border-bottom: 1px solid #eaeef1;
			padding: 0 16px;
		}
		.__avatar {
			width: 32px;
			height: 32px;
			display: inline-block;
			line-height: 32px;
			border-radius: 16px;
			text-align: center;
			background: #ffe5e5;
			color: #e74854;
		}
		.__peoples {
			height: 182px; 
			overflow-y: hidden;
			transition: height .2s linear;
			.__item {
				width: 70px;
				height: 60px;
				color: #333333;
				padding-bottom: 30px;
				margin-top: 20px;
				border-bottom: 1px solid #ebeef1
			}
		}
		.__peoples:hover {
			overflow-y: auto;
		}
	}
	
}
</style>