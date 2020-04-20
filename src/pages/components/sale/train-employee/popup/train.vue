<template>
	<div class="v-sale-statistics-student-train g-pd-t-10">
		<div
			v-for="(item,index) in trainList"
			:key="index"
			class="g-m-t-20 g-m-l-20 _train"
		>
			<div
				class="g-pd-lr-20 g-flex g-jc-sb g-pointer __top"
				@click="handleToggle(`train_${index}`)"
			>
				<span class="g-fs-16 g-c-black1">{{ item.course_name }}</span>

				<i
					:class="item.show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-10"
				/>
			</div>

			<vc-expand :ref="`train_${index}`" v-model="item.show">
				<div class="g-pd-20 __content">
					<div class="g-flex">
						<div style="width: 160px;">
							<span class="g-c-black4">授课讲师：</span>
							<oa-auto-tooltip
								:content="item.lecture"
								style="width:80px"
								placement="bottom"
								theme="dark"
								label-class="g-c-black1"
							/>
						</div>
						<div>
							<span class="g-c-black4">授课时间：</span>
							<span class="g-c-black1">{{ item.start_time }}-{{ item.end_time }}</span>
						</div>
					</div>

					<div class="g-flex g-m-t-15">
						<div style="width: 240px;">
							<i class="iconfont icon-baoming g-fs-12" style="color: #E74854;"/>
							<span class="g-c-black1">
								报名：{{ item.apply_str }}
							</span>
							<span v-if="item.is_apply==2" class="g-c-black4">（{{ item.apply_time }}）</span>
						</div>
						<div style="width: 240px;">
							<i class="iconfont icon-qiandao g-fs-12" style="color: #2397F9;"/>
							<span class="g-c-black1">
								签到：{{ item.sign_str }}
							</span>
							<span v-if="item.is_sign==3" class="g-c-black4">（{{ item.sign_time }} ）</span>
						</div>
						<div style="width: 240px;">
							<i class="iconfont icon-toupiao g-fs-12" style="color: #ED8F4A;"/>
							<span class="g-c-black1">
								作业：{{ item.upload_str }}
							</span>
							<span v-if="item.upload_time" class="g-c-black4">
								（{{ item.upload_time }} ）
							</span>
						</div>
						<div style="width: 240px;">
							<i class="iconfont icon-kaoshi g-fs-12" style="color: #4FC43D;"/>
							<span class="g-c-black1">
								已通关：{{ item.pass_str }}
							</span>
						</div>
					</div>
				</div>
			</vc-expand>
		</div>
		<div v-if="!trainList.length" style="height:500px;flex-direction: column;" class="g-flex-cc g-flex-ac">
			<img :src="OSS_SEARCH_EMPTY" style="max-height:100px">
			<div class="g-tc">暂无数据哦~</div>
		</div>
		<div class="g-tr _footers">
			<i-page
				:total="totalCount"
				:page-size-opts="[10,20,30]"
				show-sizer
				show-elevator
				show-total
				@on-change="handleChange"
				@on-page-size-change="handlePageSize"
			/>
		</div>
	</div>
</template>

<script>
import { Expand } from "wya-vc";
import { Page } from "iview";
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	name: "academy-statistics-student-train",

	components: {
		"i-page": Page,
		"vc-expand": Expand,
		"oa-auto-tooltip": AutoToolTip
	},

	props: {
		staffId: {
			required: true,
			type: Number
		},
		type: {
			required: true,
			type: Number
		}
	},

	data() {
		return {
			page: 1,
			pageSize: 10,
			trainList: [],
			totalCount: null,
			OSS_SEARCH_EMPTY
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: "_ACADEMY_STATISTICS_STUDENT_THREE_TRAIN_GET",
				type: "GET",
				param: {
					staff_id: this.staffId,
					type: this.type,
					page: this.page,
					pageSize: this.pageSize
				},
				loading: false
			}).then(res => {
				this.trainList = res.data.list.map(ele => { return { ...ele, show: true }; });
				this.totalCount = res.data.totalCount;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleToggle(value) {
			// this.$refs[value].length ? this.$refs[value][0].toggle() : this.$refs[value].toggle();
			// this.$refs[value].toggle();
			this.$refs[value][0].toggle();
		},

		handleChange(page) {
			this.page = page;
			this.loadData();
		},

		handlePageSize(size) {
			this.pageSize = size;
			this.loadData();
		}
	}
};
</script>

<style lang="scss">
.v-sale-statistics-student-train{
	position: relative;
	margin-bottom: 80px;
    ._train{
        width: 900px;
        box-shadow: 0 0 7px 0 rgba(0,0,0,0.1);

        .__top{
            height: 56px;
            line-height: 56px;
            background: #F5F5F6;
        }

        .__content{
            height: 100px;
        }
	}

	._footers {
		width: 940px;
		position: fixed;
		bottom: 0;
		border-top: 1px solid #e8e8e8;
		height: 60px;
		padding-top: 5px;
		padding-right: 20px;
		background: #fff;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
	}
}
</style>