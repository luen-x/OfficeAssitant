<template>
	<div class="v-sc-main-options g-relative">
		<oa-title title="制作进度"/>

		<div class="_options g-pd-t-10 g-pd-b-10 g-m-t-30">
			<oa-option 
				v-if="options.length != 0" 
				ref="option"
				:options="options"
				:flags="flags"
				:len="len"
				@event="handleGetPage"
			/>

			<div v-else class="g-tc _empty">
				<img :src="OSS_SEARCH_EMPTY">
				<p>目前没有正在制作的合同哦！</p>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { setTimeout } from 'timers';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Title from "./title";
import option from "./option";

export default {
	name: "sc-main-options",

	components: {
		"oa-title": Title,
		"oa-option": option
	},

	data() {
		return {
			OSS_SEARCH_EMPTY,
			options: [], // 产品制作进度
			page: 1,
			flags: true,
			len: false // 判断数组是否为空
		};
	},

	async mounted() {
		await this.handleGetDate(1);
	},

	methods: {
		handleGetDate(page) {
			// 产品制作进度
			this.$request({
				url: API_ROOT._SC_MAIN_MAKE_PROCESS_GET,
				type: "GET",
				param: {
					page
				}
			}).then(res => {
				this.flags = !this.flags;

				if (res.data.length == 0) {
					this.len = true;
				}

				this.options = [...this.options, ...res.data];
			}).catch(error => {});
		},

		handleGetPage(v) {
			this.handleGetDate(v);
		}
	}
};
</script>

<style lang="scss">
.v-sc-main-options {
    height: 274px;

	._options{
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
	}

    ._empty {
		height: 274px;

        img {
            margin-top: 5%;
        }

        p {
            color: #818794;
        }
    }
}
</style>