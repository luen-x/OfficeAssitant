<template>
	<div class="v-page-information">
		<div class="g-flex" style="justify-content: center; margin-top: 40px;">
			<div class="_body">
				<div
					v-if="list.length==0"
					class="g-flex-cc g-flex-ac"
					style="height:615px;width:800px"
				>
					<div>
						<img :src="OSS_ACTIVE">
						<div class="g-tc g-fs-14">暂无最新资讯信息</div>
					</div>
				</div>
				<div v-else style="min-height:635px;overflow:auto">
					<div
						v-for="(tem,i) in list"
						:key="i"
						class="g-flex __body-item"
						style="justify-content: flex-start"
						@click="handleDetail(tem,tem.keyword)"
					>
						<div >
							<img
								v-if="tem.thumbnail"
								:src="tem.thumbnail"
								alt
							>
						</div>
						<div>
							<div
								:style="tem.thumbnail?
								'margin-bottom: 45px' : 'margin-bottom: 10px' "
								class="_item-text"
							>{{ tem.title }}</div>
							<div class="_item-name">
								<span>{{ tem.staff_name }}</span>
								<span class="g-m-l-30">{{ tem.create_date }}</span>
								<i class="iconfont icon-accessory"/>
								<span>{{ tem.attachment_num }}</span>
								<i class="iconfont icon-download"/>
								<span>{{ tem.download_number }}</span>
								<i class="iconfont icon-open-eyes"/>
								<span>{{ tem.browse_number }}</span>
							</div>
						</div>
					</div>
				</div>
				<i-page
					:total="total"
					:current="page"
					:page-size="8"
					show-total
					show-elevator
					style="height: 40px;margin-top: 10px;text-align: right; margin-bottom: 50px;"
					@on-change="handleChangePage"
				/>
			</div>
			<div class="_body _with">
				<div class="_with-title">
					最新资讯
				</div>
				<div>
					<ul class="_text">
						<li
							v-for="(item,i) in newlist"
							:key="i"
							@click="handleDetail(item,item.keyword)"
						>
							<div class="__operate-text">{{ item.title }}</div>
							<div>{{ item.create_date }}</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Page } from 'iview';
import { OSS_ACTIVE } from '@constants/constants';
import API from '@stores/apis/root';

export default {
	name: 'oa-tpl',
	components: {
		"i-page": Page,
	},
	props: {
		status: {
			type: String,
			default() {
				return '5';
			}
		} // 详情跳转首页参数，具体看资讯详情 containers
	},
	data() {
		const { query } = this.$route;
		return {
			OSS_ACTIVE,
			list: [],
			total: null, // 总页数
			page: null, // 当前页
			pageSize: 1, //
			newlist: [], // 最新资讯
		};
	},
	created() {
		this.getNewList();
		this.getNewdata();
	},
	methods: {
		handleChangePage(val) {
			this.pageSize = val;
			this.getNewList();
		},
		handleDetail(val, key) {
			const { query } = this.$route;
			if (query.status == 3) {
				this.$router.push({ path: '/sale/full/preview',
					query: {
						keyword: key,
						status: this.status || 3,
						information_id: val.information_id
					}
				});
				return;
			}
			if (+this.status >= 4) {
				let name = ['collage-consultation', 'finance-consultation', 'hr-consultation', 'sc-consultation'][+this.status - 4];
				
				this.$router.push(
					{
						name,
						query: {
							keyword: key,
							status: this.status,
							information_id: val.information_id
						}
					}
				);
			}
		},
		getNewList() {
			this.$request({
				url: API._SALE_MAIN_MATERIAL_LIST_GET,
				type: "get",
				param: {
					page: this.pageSize,
					pageSize: 8,
					is_control_role: this.$route.query.is_control_role
				}
			}).then(res => {
				this.list = res.data.list;
				this.total = res.data.totalCount;
				this.page = res.data.currentPage;
			});
		},
		getNewdata() {
			this.$request({
				url: API._SALE_MAIN_MATERIAL_NEW_LIST_GET,
				type: "get",
				param: {
					material_type: 2,
					is_control_role: this.$route.query.is_control_role
				}
			}).then(res => {
				this.newlist = res.data;
			});
		},
		initType(fileUrl) {
			let fileArry = fileUrl.split('.');
			let suffix = fileArry[fileArry.length - 1].toLowerCase(); // 获取后缀
			switch (suffix) {
				case 'png':
				case 'jpg':
				case 'jpeg':
				case 'bmp':
				case 'gif':
					return true;
				default:
					return false;
			}

		}
	},
};
</script>

<style lang="scss" scoped>
    .v-page-information {
       ._body {
            padding: 0px 20px;
            ._text {
                list-style-type: none;
                margin: 0 20px 20px 20px;
                height: 278px;
                text-align: center;
                background: #fff;
                overflow: hidden;
                li {
                    text-align: left;
					line-height: 27px;
                    width: 284px;
                    padding: 0 20px;
                    border-bottom: 1px solid#ebeef1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                    &:hover {
                        color: #2296f9;
                    }
                }
            }
           .__body-item {
                min-height: 80px;
                max-width: 760px;
                width: 60vw;
                padding: 10px 10px;
                border-bottom: 1px solid #ebeef1;
                &:hover {
                    background: #f5f5f6;
					cursor: pointer;
                }
                img {
                    width: 156px;
                    height: 92px;
                    margin-right: 15px;
                }
                ._item-text {
                    color: #000;
                    font-size: 15px;
                }
                 ._item-name {
                    font-size: 12px;
                    i {
                        margin-left: 30px;
                    }
                }
            }
        }
        ._with {
            margin-top: 0px;
            padding: 0;
            width: 352px;
            height: 680px;
            background: #f5f5f6;
           ._with-title {
                margin: 20px;
                font-size: 14px;
				.__operate-text {
					overflow:hidden;
					text-overflow:ellipsis;
					white-space:nowrap;
				}
                // div {
                //     display: inline-block;
                //     width: 2px;
                //     height: 14px;
                //     background: red;
                //     position: relative;
                //     bottom: -1px;
                //     margin-right: 15px;
                // }
            }
        }
    }
</style>
