<template>
	<div ref="options" class="v-sc-main-option">
		<div
			v-for="(item, index) in options"
			:key="index"
			class="g-flex g-jc-sb g-pointer g-m-b-5 g-pd-b-5 _options"
			@click="$router.push({path:'/sc/product',query:{make_id : item.make_id, search: item.contract_company_name}})"
		>
			<div class="g-m-l-15 __options-left">
				<h3 class="g-m-t-20 g-m-b-10 g-fs-16">{{ item.contract_company_name }}</h3>

				<ul class="g-flex g-fw-w g-m-b-20">
					<li class="g-m-t-10 g-pd-r-15 g-fs-12">
						<span>下单产品：</span>
						<span>{{ item.product_name }}</span>
					</li>
					<li class="g-m-t-10 g-pd-r-15 g-fs-12">
						<span>下单时间：</span>
						<span>{{ item.single_time }}</span>
					</li>

					<div class="g-flex g-fw-w">
						<div class="g-m-t-10 g-pd-r-15 g-fs-12">
							<span>主要负责人：</span>
							<span>{{ item.main_person_name }}</span>
						</div>

						<template v-if="item.is_have_child" class="g-flex g-fw-w">
							<div
								v-for="(date,key) in item.product_person"
								:key="key"
								class="g-flex g-fw-w"
							>
								<div class="g-m-t-10 g-pd-r-15 g-fs-12">
									<span>{{ date.product }}：</span>
									<span>{{ date.name }}</span>
								</div>
							</div>
						</template>

						<div v-else class="g-flex g-fw-w">
							<li class="g-m-t-10 g-pd-r-15 g-fs-12">
								<span>负责人：</span>
								<span>{{ item.product_person.length != 0 ? item.product_person[0].name : "" }}</span>
							</li>
						</div>
					</div>
				</ul>
			</div>

			<div class="g-m-r-30 g-m-t-20">
				<i-circle
					:percent="Number(item.progress)"
					:size="80"
					stroke-linecap="square"
					stroke-color="#d6434d"
				>
					<div>
						<p class="g-m-b-10">制作进度</p>
						<p>{{ item.progress }}%</p>
					</div>
				</i-circle>
			</div>
		</div>
	</div>
</template>

<script>
import { Circle, Tooltip } from "iview";

export default {  
	name: "sc-main-option",

	components: {
		"i-circle": Circle,
		"i-tooltip": Tooltip
	},
    
	props: {
		options: Array,
		flags: Boolean,
		len: Boolean
	},
    
	data() {
		return {
			page: 1,
			flag: false // 判断请求的数组是否为空
		};
	},
    
	watch: {
		flags() {
			this.flag = false;
		},
        
		len() {
			// 移除滚动事件
			this.$refs.options.removeEventListener(
				"scroll",
				this.scrollBottom
			);
		}
	},
    
	mounted() {
		this.$nextTick(() => {
			// 添加滚动事件
			this.$refs.options.addEventListener(
				"scroll",
				this.scrollBottom
			);
		});
	},
    
	methods: {
		scrollBottom(e) {
			if (this.flag) {
				return;
			}

			if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.flag = true;
				this.page++; 
                
				this.$emit("event", this.page);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.v-sc-main-option{
    max-height: 300px;
    overflow-y: hidden;

	&:hover{
		overflow-y: overlay;
	}

    ._options {
        border-bottom: 1px solid #ebeef1;

        &:hover {
            background-color:  #f5f5f6;
		}
		
        .__options-left {
            h3 {
                height: 16px;
                line-height: 16px;
            }

            ul {
                width: 98%;

                li {
                    span:nth-of-type(1) {
                        color: #818794;
                    }

                    span:nth-of-type(2) {
                        color: #333333;
                    }
                }
            }
        }
    }
}
</style>

