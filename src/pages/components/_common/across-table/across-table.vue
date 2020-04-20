<template>
	<div class="c-across-table">
		<div
			v-for="(item,index) in formatData"
			:key="index"
			class="_item"
		>
			<div v-if="index < formatData.length-1" :class="'_line '+statusClass[item.status]"/>
			<div 
				:class="{ 'g-pointer':item.status=='2' || item.status=='4'}" 
				class="g-flex g-flex-cc " 
				@click="$emit('click-icon',item,index)"
			>
				<div :class="'_out '+statusClass[item.status]">
					<div :class="'_in '+statusClass[item.status]">
						<span v-if="item.status=='1'">{{ index + 1 }}</span>
						<i
							v-else-if="item.status=='2'"
							class="icon iconfont icon-check-mark g-fs-12"
						/>
						<i
							v-else-if="item.status=='3'"
							class="icon iconfont icon-close  g-fs-12"
						/>
						<span v-else-if="item.status=='4'">{{ index + 1 }}</span>
					</div>
				</div>
				<slot :item="item" :index="index" name="side" />
			</div>
			<slot :item="item" :index="index">
				<div v-if="mode=='audit'" class="__content ">
					<div v-if="item.check_step" class="g-flex g-flex-cc" style="margin-top: 5px;">{{ item.check_step }}</div>
					<div :class="statusClass[item.status]" class="g-flex g-flex-cc">{{ item.title }}</div>
					<div class="g-flex g-flex-cc">{{ item.staff_name }}</div>
					<div v-if="item.content" >
						<div v-if="item.content.length < 18" class="g-flex g-flex-cc">{{ item.content }}</div>
						<div v-else class="g-flex g-flex-cc">
							<i-tool-tip
								:content="item.content"
								placement="bottom"
								max-width="250"
								transfer
							>
								{{ item.content.substring(0, 18) }}...
							</i-tool-tip>
						</div>
					</div>
					<div v-if="item.status ==2 || item.status == 3" class="g-flex g-flex-cc">{{ item.create_time }}</div>
				</div>
			</slot>
		</div>
	</div>
</template>

<script>
import { Tooltip } from 'iview';
// 1 待审核 ，2 通过  3 未通过（驳回） 4 进行中

export default {
	name: "oa-across-table",
	components: {
		'i-tool-tip': Tooltip,
	},
	props: {
		data: Array, // [{status,}]
		mode: {
			type: String,
			default: 'audit'
		}
	},
	data() {
		return {
			statusClass: {
				1: 'plain',
				2: "success",
				3: 'error',
				4: 'success'
			}
		};
	},
	computed: {
		formatData() {
			// 审核模式，将第一个待审核1状态改为进行中4，如果存在被驳回状态则不改变数据
			if (this.mode == 'audit' && this.data) {
				const dataCopy = JSON.parse(JSON.stringify(this.data));
				const hasError = dataCopy.find(item => {
					return item.status == 3;
				});
				if (hasError) {
					return dataCopy;
				}
				const temp = dataCopy.find(item => {
					return item.status == 1;
				});
				if (temp) temp.status = 4;
				return dataCopy;
			} else {
				return this.data;
			}
		}
	}
};
</script>

<style lang="scss" >
.c-across-table{
    display: flex;
    margin-top:20px;
    display: flex;
    justify-content: center;
    ._item{
        height: 100px;
        width:132px;
        position: relative;
    }
    ._out {
        width: 37px;
        height: 37px;
        border-radius: 19px;
        display: flex;
        justify-content: center;
        align-items: center;
        &.success{
                 background: rgb(186, 224, 255);
        }
        &.error{
              background: rgb(253, 206, 206);
        }
        &.plain{
            background-color: white;
        }
    }
    ._in{
        width: 23px;
        height: 23px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        &.success{
            background: rgb(24, 139, 233);
        }
        &.error{
            background: #ec505b;
        }
        &.plain{
            background-color: #bbbbbb;
        }
    }
    ._line{
		width: 88px;
		height: 1px;
		position: absolute;
		top: 20px;
		left: 89px;

    &.success{
        background: rgb(24, 139, 233);
    }
    &.error{
        background: #ec505b;
    }
    &.plain{
        background-color:  #bbbbbb;
    }
    }
    .__content{
        .success{
            color: rgb(24, 139, 233);
        }
        .error{
            color: #ec505b;
        }
        .plain{
            color:  #bbbbbb;
        }
    }
}
</style>

