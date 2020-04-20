<template>
	<div class="v-sale-study-video-study g-flex g-fd-c" style="height:100%;overflow: hidden;">
		<div class="_title" >
			<span style="cursor: pointer;" @click="handleGoback">
				<i style="margin-left:30px" class="iconfont icon-left"/>
				<span style="margin-left:30px" class="g-fs-20" >{{ course_name }}</span>
			</span>
		</div>
		<div class="g-flex _content g-col">
			<oa-preview class="g-col"/>
			<transition name="slide-fade">
				<oa-sidebar v-if="show" @changeTitle="(name)=>{if(name)course_name=name}"/>
				<div v-else class="_left g-flex-cc g-flex-ac" @click="handleShowSidebar" >
					<i class="iconfont icon-left"/>
				</div>
			</transition>
		</div>
	</div>
</template>
<script>

import { getItem, setItem, delItem } from '@utils/utils';
import video from './video';
import Sidebar from './sidebar';
import preview from './preview';

export default {
	name: 'oa-tpl',
	components: {
		'oa-video': video,
		'oa-preview': preview,
		'oa-sidebar': Sidebar
	},
	data() {
		const { query } = this.$route;
		return {
			show: true,
			course_name: query.course_name
		};
	},
	computed: {

	},
	created() {

	},
	methods: {
		handleShowSidebar() {
			this.show = !this.show;
		},
		loadData() {
			this.loading = true;
			this.$request({
				url: API._SALE_TRAIN_STUDY_ONLINE_STUDY_GET,
				type: "get",
				loading: false,
				param: {
					course_type: this.data.invoice_id
				}
			}).then(res => {
				this.loading = false;
			}).catch(error => {
				console.error(error);
			});
		},
		handleGoback() {
			this.$router.go(-1);
		}
	},
};
</script>

<style lang="scss" >
    .v-sale-study-video-study {
        ._title {
            background: rgba(51, 51, 51, 1);
            height: 80px;
            line-height: 80px;
            color: #fff;
        }
        ._content {
            height: calc(100%-154px);
        }
        ._left {
            position: absolute;
            right: 0;
            top: 40%;
            width: 20px;
            height: 40px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 0px 4px 4px 0px;
        }
        .slide-fade-enter-active {
            transition: all 0.3s ease;
        }
        .slide-fade-leave-active {
            transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
        }
        .slide-fade-enter, .slide-fade-leave-to
                /* .slide-fade-leave-active for below version 2.1.8 */ {
            transform: translateX(50px);
            opacity: 0;
        }
    }
</style>
