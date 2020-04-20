<template>
	<div class="v-finance-record">
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
	</div>
</template>

<script >
import { CreateCustomer } from 'wya-vc';

const RecordContent = CreateCustomer({ content: [Object, Array], index: Number });
export default {
	name: 'oa-finance-record',
	components: {
		'oa-record-content': RecordContent
	},
	props: {
		records: {
			type: Array,
			default: () => []
		},
		reverse: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
		};
	},
	computed: {
		lightIndex() {
			return 0;
			// return this.reverse ? 0 : this.records.length - 1;
		},
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
.v-finance-record {
	max-height: 250px;
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
}
</style>
