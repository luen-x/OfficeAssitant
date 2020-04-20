<template>
	<div class="v-sale-call-manage g-flex g-jc-c">
		<div style="margin-top:120px;width:700px" >
			<i-input
				v-model="keyword"
				:maxlength="50"
				style="width:590px"
				placeholder="请输入公司名称或电话"
				@on-change="searchCompany"
				@on-blur="handleBlur"
			>
				<span slot="suffix" class="_append g-pointer" @click="handleCallOut">拨打</span>
			</i-input>
			<span v-if="$auth[601]" class="g-c-blue-mid g-pointer g-m-l-10 g-fs-14" @click="handleSearch">查询通话记录</span>
			<div v-if="status" class="_dropdown _border-radius" style="width:590px">
				<div v-if="status ===1" class="_tip">搜索中</div>
				<div v-else-if="status ===2" class="_tip">无匹配数据</div>
				<div v-else class="_list">
					<div
						v-for="(item,index) in companys"
						:key="item.relation_id || index"
						:class="index==companys.length-1?'_border-radius':''"
						class="_option"
						@click="handleSelect(item)"
					>
						{{ item.company_name }} ( {{ item.customer_name }} {{ item.tel }})
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script >
import { Input } from 'iview';
import Vue from 'vue';
import callService from './call/service';
import CusAudio from '../_common/audio/audio';

export default {
	components: {
		'i-input': Input,
		"oa-sale-audio": CusAudio
	},
	data() {
		return {
			keyword: '',
			companys: [],
			selectedItem: null,
			status: 0 // 0 收起  1 搜索中  2 无数据 3 展开,

		};
	},
	methods: {
		searchCompany() {
			if (/^[0-9]{0,2}$/.test(this.keyword)) return;
			this.status = 1;
			this.$request({
				url: "_SALE_DIALING_RECORDING_COMPANY_ASSOCIATE_GET",
				type: "GET",
				param: { keyword: this.keyword },
				loading: false,
			}).then(res => {
				this.companys = res.data;
				if (res.data.length > 0) {
					this.status = 3;
				} else {
					this.status = 2;
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleBlur() {
			setTimeout(() => {
				this.status = 0;

			}, 300);
		},
		handleSelect(item) {
			this.selectedItem = item;
			this.keyword = item.tel;
			this.status = 0;
		},
		handleCallOut() {
			if (this.keyword != '') {
				callService.prepareToCallOut(this.keyword);
			} else {
				this.$Message.warning("请输入电话号码");
			}
		},
		handleSearch() {
			this.$router.push('/sale/call/record?keyword=' + this.keyword);
		},

	}
};
</script>

<style  lang="scss">
.v-sale-call-manage {
    ._dropdown {
		// box-shadow: 0px 0px 2px 3px #eee;
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
        margin-top: 2px;
		width:500px;
		max-height: 400px;
		overflow: auto;
        ._option {
            padding: 5px;
            &:hover {
                background-color: #f0f4fc;
            }
            transition: all 0.2s ease;
            cursor: pointer;
            padding-left: 30px;
            height: 32px;
            overflow: hidden;
        }
        ._tip {
            padding: 5px;
            transition: background-color 0.5s ease;
            cursor: pointer;
            padding-left: 30px;
			border-bottom-left-radius: 4px;
			border-bottom-right-radius: 4px; 
			height: 32px;
        }
    }
    ._append {
        display: inline-block;
        color: red;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        margin-top: 10px;
        border-left: 1px #bbb solid;
		font-size: 16px;
    }
    .ivu-input-group-append {
        background-color: white;
	}
	.ivu-input{
		height: 44px;
	}
    .ivu-input-suffix {
        width: 70px;
    }
	._border-radius{
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px; 
	}
}
</style>
