<template>
	<div class="c-step-tree">
		<div v-for="(items,i) in blockData" :key="i" class="g-flex" >
			<oa-block
				v-for="(item,j) in items" 
				:key="j" 
				:hide-inner="!item" 
				:out-ten="getOutTen(i,j)"
				:border="getBorder(i,j)"
				:size="blockSize"
				:line-color="lineColor"
			>
				<slot slot="inner" :data="item" name="inner" />
			</oa-block>
		</div>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import Block from './block';

export default { 
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-block': Block
	},
	props: {
		data: {
			type: Array,
			default: () => [
				[1, 1, 1, 1, 1], 
				[1],
				[1, 1, 1],
				[1],
				[1, 1, 1, 1, 1]
				
			]
		},
		blockSize: {
			type: Number,
			default: 150
		},
		lineColor: {
			type: String,
			default: 'dodgerblue'
		}

	},
	data() {
		return {
			
		};
	},
	computed: {
		
		blockData() {
			const height = this.data.length;
			let width = 0;
			this.data.forEach((row) => {
				if (row.length > width) {
					width = row.length;
				}
			});
			const res = [];
			for (let i = 0; i < height; i++) {
				for (let j = 0; j < width; j++) {
					if (!res[i]) res[i] = [];
					res[i][j] = this.data[i][j] || undefined;
				}
			}
			for (let i = 0; i < res.length; i++) {
				const cha = parseInt((res[i].length - res[i].filter(Boolean).length) / 2, 10);
				if (cha > 0) {
					res[i] = res[i].map((item, index) => res[i][(index - cha) % res[i].length]);
				}
			}
			return res;
		}
	},

	methods: {
		getBorder(i, j) {
			let res = [1, 1, 0, 0, 1, 1, 0, 0];
			if (!this.blockData[i][j - 1]) {
				res[0] = 0;
				res[5] = 0;
			}
			if (!this.blockData[i][j + 1]) {
				res[1] = 0;
				res[4] = 0;
			}
			if (!this.blockData[i - 1]) {
				res[0] = 0;
				res[1] = 0;
			}
			
			if (!this.blockData[i + 1]) {
				res[4] = 0;
				res[5] = 0;
			}
			return res;
		},
		getOutTen(i, j) {
			const res = [1, 0, 1, 0];
			if (i == 0) {
				res[0] = 0;
			}
			if (i == this.blockData.length - 1) {
				res[2] = 0;
			}
			return res;
		}
	}
};
</script>
<style lang="scss">
</style>