<template>
	<div :style="style" class="c-record g-dark-scroll">
		<!-- <div class="_wrapper"> -->
		<div
			v-for="(item,index) in getReverse(records)"
			:key="item.id"
			:style="(index === (records.length-1)) ?'border-left:none':''"
			class="_record-item"
		>
			<span v-if="index===lightIndex" class="_icon1">
				<span/>
			</span>
			<span v-else class="_icon2">
				<span/>
			</span>
			<div :style="'position: relative;top:'+(index>0?' -4px':'-1px')">
				<slot :data="item" :index="index"/>
			</div>
		</div>
		<!-- </div> -->
	</div>
</template>

<script >
export default {
	name: 'oa-record',
	components: {
		
	},
	props: {
		records: {
			type: Array,
			default: () => []
		},
		reverse: {
			type: Boolean,
			default: false
		},
		maxHeight: String,
		lightIndex: {
			default: 0,
			type: Number
		}

	},
	data() {
		return {
			style: { maxHeight: this.maxHeight || '' }
		};
	},	
	methods: {
		getReverse(records) {
			if (!this.reverse) return records;
			const arr = [...records];
			arr.reverse();
			return arr;
		}
	}
};
</script>

<style  lang="scss">
.c-record {
	//._wrapper {
		// max-height: 300px;
		padding: 0 20px;
		overflow: auto;
		> ._record-item {
				border-left: 1px lightgray solid;
				position: relative;
				padding-left: 20px;
				padding-bottom: 20px;
				._icon1 {
					position: absolute;
					left: -10px;
					width: 19px;
					background: rgb(255, 186, 186);
					height: 19px;
					border-radius: 10px;
					display: flex;
					justify-content: center;
					align-items: center;
					span {
						width: 9px;
						height: 9px;
						background: #ec505b;
						border-radius: 5px;
					}
				}
				._icon2 {
					position: absolute;
					left: -7px;
					width: 13px;
					background: white;
					height: 13px;
					border-radius: 10px;
					border: 1px #ec505b solid;
				}
				// &:last-child{
				// 	 padding-bottom: 0px;

				// }

			} 
	// }
	// ._wrapper::-webkit-scrollbar {/*滚动条整体样式*/
	// 	width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
	// 	height: 1px;
	// }
	// ._wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	// 	border-radius: 10px;
	// 	-webkit-box-shadow:  0 0 0 #110a0a;
	// 	background: #271717;
	// }
	// ._wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
	// 	-webkit-box-shadow:  0 0 0 #110a0a;
	// 	border-radius: 10px;
	// 	background: #464040;
	// }
}
</style>
