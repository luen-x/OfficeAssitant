<template>
	<div class="c-product-label">
		<div :style="{background: curLabel.color}" class="_label">
			{{ curLabel.name }}
			<div :style="{background: curLabel.color}" class="_circle g-flex g-jc-c g-ai-c">
				<div :style="{background: curLabel.color}" class="_small"/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'oa-product-label',
	components: {

	},
	props: {
		type: [Number, String],
		name: {
			type: String,
			default: '已更换'
		},
		color: {
			type: String,
			default: '#2397F9'
		},
		colorId: [Number, String]
	},
	data() {
		return {
			label: {
				'1': { name: '赠送', color: '#2397F9' },
				'2': { name: '已更换', color: '#ed8f4a' },
				'3': { name: '已退款', color: '#4FC43D' },
				'4': { name: '换后产品', color: '#7e23f9' },
				'5': { name: '续费产品', color: '#f97923' },
				'6': { name: '', color: '#2397F9' },
			}
		};
	},
	computed: {
		curLabel() {
			if (this.label[this.type]) {
				return this.label[this.type];
			} else {
				return { 
					name: this.name, 
					color: (this.label[this.colorId] && this.label[this.colorId].color) || this.color 
				};
			}
		}
	},
	created() {
	},
	methods: {

	},
};
</script>

<style lang="scss" scoped>
.c-product-label {
	._label {
		position: relative;
		height: 23px;
		line-height: 23px;
		padding-right: 13px;
		padding-left: 18px;
		color: #fff;
		border-radius: 4px;
		._circle {
			position: absolute;
			left: -3px;
			top: 4px;
			width: 15px;
			height: 15px;
			border-radius: 50%;
			._small {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				border: 2px solid #fff;
			}
		}
	}
}
</style>
