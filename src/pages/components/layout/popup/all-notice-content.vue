<template>
	<div class="v-all-notice">
		<oa-loading v-if="show" />
		<div class="_content g-pd-20">
			<div
				v-for="item in list"
				:key="item.type"
				class="__notice g-flex-ac g-m-b-10 g-pd-r-30 g-pointer"
				@click="handleClick(item)">


				<div class="g-flex g-ai-c __left">
					<!-- <i-poptip
						:content="item.type_name"
						trigger="hover"
						word-wrap
						transfer
						width="200"> -->
					<!-- <div class="g-flex g-ai-c"> -->
					<div
						:style="{backgroundColor: item.count !== 0 ? '#e74854' : '#b5bfce'}"
						class="__circle g-m-lr-20" />
					<div
						:class="item.count !== 0 ? '' : 'g-m-r-10'"
						:style="{color: item.count !== 0 ? '#333' : '#818794'}"
						class="g-fs-14 __name">
						{{ item.type_name }}
					</div>
					<span
						v-if="item.count !== 0"
						style="color: #e74854;"
						class="g-fs-12 g-m-r-5">
						（{{ item.count }}条未读）
					</span>
					<!-- </div>
					</i-poptip> -->
				</div>

				<div class="g-c-black-light __right">
					<span class="g-m-r-5">{{ item.create_time }}</span>
					{{ item.content }}
				</div>

			</div>
		</div>
	</div>
</template>

<script>
import { Poptip } from 'iview';

export default {
	name: "all-notice",
	components: {
		"i-poptip": Poptip
	},
	data() {
		return {
			list: [],
			show: false
		};
	},
	computed: {},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.show = true;
			this.$request({
				url: '_COMMON_NOTICE_GET',
				type: 'GET',
				loading: false
			}).then(res => {
				this.show = false;
				this.list = res.data.list;
			}).catch(() => {
				this.show = false;
			});
		},
		handleClick(item) {
			// if (item.count) {
			this.$emit('save', item);
			// }
		}
	}
};
</script>

<style lang="scss" scoped>
.v-all-notice {
	._content {
		.__notice {
			width: 100%;
			height: 44px;
			border-radius: 2px;
			background-color: #f5f5f5;
			.__left {
				width: 30%;
				white-space: nowrap;
				.__circle {
					width: 8px;
					height: 8px;
					border-radius: 50%;
				}
				.__name {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.__right {
				width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
}
</style>
