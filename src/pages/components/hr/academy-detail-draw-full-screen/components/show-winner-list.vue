<template>
	<div class="c-show-winner-list">
		<img :src="OSS_LUCKDRAW_BG05" class="__bg-img1" alt="">
		<i-carousel 
			ref="carousel" 
			v-model="nowIndex"	
			:class="{ '_hide-arrow': chunkData.length <= 1 }" 
			radius-dot
			arrow="always" 
			class="_carousel"
			@on-change="handleChange">
			<i-carousel-item 
				v-for="(item, i) in chunkData"
				:key="i"
				class="__carousel-item">
				<div 
					:class="[item.length <= 3 ? '__three-item' : '__other-item', '__content',
						{ '__small-pagesize-pd': pageSize === 8 && item.length === 4 },
						{ '__big-pagesize-pd': pageSize > 8 && item.length >= 4 && item.length <= 6 }]">
					<!-- <div class="__bg-img">
						<img :src="OSS_LUCKDRAW_BG05">
					</div> -->
					<div 
						v-for="(person, i) in item"
						:key="i"
						class="__person">
						<!-- <div > -->
						<div :title="person.staff_name" class="__name">{{ person.staff_name.slice(-3) }}</div>
						<div class="__tel">{{ person.mobile }}</div>
						<div v-if="canEdit" class="__del g-pointer" @click="handleDel(person.record_id, chunkData.length)">
							<i class="icon iconfont icon-close2 g-fs-26 g-c-red-mid"/>
							<!-- </div> -->
						</div>
					</div>
				</div>
			</i-carousel-item>
		</i-carousel>
	</div>
</template>

<script>
import { Carousel, CarouselItem } from 'iview';
import { chunk } from 'lodash';
import { OSS_LUCKDRAW_BG05 } from '@constants/constants';

export default {
	components: {
		'i-carousel': Carousel,
		'i-carousel-item': CarouselItem
	},
	props: {
		type: {
			type: String,
			default: 'small',
			validator(value) {
				return ['small', 'big'].includes(value);
			}
		},
		canEdit: {
			type: Boolean,
			default: false
		},
		data: {
			type: Array,
			default: () => []
		},
		pageSize: {
			type: Number,
			default: 8
		}
	},
	data() {
		return {
			nowIndex: 0,
			OSS_LUCKDRAW_BG05
		};
	},
	computed: {
		chunkData() {
			return chunk(this.data, this.pageSize);
		},
	},
	methods: {
		handleDel(recordId, totalPage) {
			this.$emit('delete-record', recordId, totalPage);
		},
		handleChange(val) {
		}
	}
};
</script>
<style lang="scss">
.c-show-winner-list {
    width: 100%;
	position: relative;
	.__bg-img1 {
		position: absolute;
		height: 100%;
		width: 100%;
	}
	.ivu-carousel-arrow.left,
		.ivu-carousel-arrow.right {
			transform: scale(1.5);
			right: 30px;
			i {
				transform: scale(2)
			}
		}
		.ivu-carousel-arrow.left {
			left: 30px;
		}
    ._carousel {
		min-height: 528px;
		// background-color: #F6ECDF;
		border-radius: 8px;
        .__carousel-item {
            .__content {
                width: 100%;
                height: 530px;
                padding: 20px 100px;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
				position: relative;
				.__bg-img {
					position: absolute;
					top: 0;
					right: 0;
					left: 0;
					bottom: 0;
					object-fit: cover
				}
                .__person {
                    height: 125px;
                    width: 270px;
                    margin-left: 49px;
                    position: relative;
                    .__name {
                        font-size: 50px;
                        font-weight: bold;
                        color: rgba(227, 31, 77, 1);
                    }
                    .__tel {
                        font-size: 30px;
                        color: #333;
                        margin-top: -15px;
                    }
                    .__del {
                        position: absolute;
                        top: 20px;
                        right: 15px;
                        cursor: pointer;
                    }
                }
            }
            .__three-item {
                flex-direction: column;
                .__del {
                    top: 30px;
                }
                .__person {
                    height: 145px;
                    .__name {
                        font-size:60px;
                        font-weight: bold;
                    }
                    .__tel {
                        font-size: 30px;
                        color: #333;
                        margin-top: -15px;
                    }
                }
            }
			.__small-pagesize-pd {
				padding: 130px 100px;
			}
			.__big-pagesize-pd {
				padding: 130px 100px;
			}
            .__other-item {
                justify-content: flex-start;
            }
        }
        
    }
	._hide-arrow {
		button {
			display: none;
		}
	}
	._hide-left-arrow {
		.ivu-carousel-arrow.left {
			display: none;
		}
	}
	._hide-right-arrow {
		.ivu-carousel-arrow.right {
			display: none;
		}
	}
}
</style>


