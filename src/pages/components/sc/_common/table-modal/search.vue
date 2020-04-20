<template>
	<div class="v-sc-cooperate-search-setting">
		<div class="g-c-black g-pd-l-10 _title">已选择</div>

		<ul class="g-flex g-flex-ac g-fw-w">
			<li 
				v-for="(item,index) in search.title_show" 
				:key="index" 
				:class="item.is_optional === 0 ? '_optional' : ''"
				class="g-pd-l-15 g-pd-r-15 g-m-r-20 g-m-t-20"
			>
				{{ item.value }}
				<i 
					v-if="item.is_optional === 1"
					class="iconfont icon-close g-fs-12 g-inline-block g-m-l-20 g-pointer _icons"
					@click="handleDelete(index)"
				/>
			</li>
		</ul>

		<div class="g-c-black g-pd-l-10 g-m-t-20 _title">未选择</div>

		<ul class="g-flex g-flex-ac g-fw-w">
			<li 
				v-for="(item,index) in search.title_hide" 
				:key="index" 
				class="g-pd-l-15 g-pd-r-15 g-m-r-20 g-m-t-20"
			>
				{{ item.value }}
				<div class="g-pointer __mask" @click="handleAdd(index)">添加</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "sc-search",

	props: {
		searchData: Object
	},
    
	data() {
		return {
			search: {
				title_show: [],
				title_hide: []
			}
		};
	},
    
	mounted() {
		this.search = JSON.parse(JSON.stringify(this.searchData));
	},
    
	methods: {
		handleAdd(index) {
			let obj = this.search.title_hide.splice(index, 1)[0];
			let len = this.search.title_show.length;
			let i = 0;

			for (i; i < len; i++) {
				if (obj.search_id < this.search.title_show[i].search_id) {
					this.search.title_show.splice(i, 0, obj);
					return;
				} else if (i === len - 1) {
					this.search.title_show.splice(len, 0, obj);
					return;
				}
			}
		},

		handleDelete(index) {
			this.search.title_hide.push(this.search.title_show.splice(index, 1)[0]);
		}
	}
};
</script>

<style lang="scss">
.v-sc-cooperate-search-setting{
    ._title{
			border-left: 2px solid #E74854;
			height: 14px;
			line-height: 14px;
	}

	ul:nth-of-type(1),ul:nth-of-type(2){
		li{
			list-style: none;
			height: 32px;
			line-height:  32px;
			background: #E74854;
			color: #ffffff;
			text-align: center;
			position: relative;
			border-radius: 4px;
		}

		._optional{
			background: #F0F4FC;
			color: #000000;
		}

		._icons{
			width: 16px;
			height: 16px;
			line-height: 16px;
			border-radius: 8px;
			background: #ffffff;
			color: #E74854;
		}
	}

	ul:nth-of-type(2){
		li{
			background: #F0F4FC;
			color: #000000;
			min-width: 100px;
			position: relative;

			.__mask{
				opacity: 0;
				position: absolute;
				color: #fff;
				left: 0;
				top: 0;
				width: 100%;
				height: 32px;
				line-height: 32px;
				cursor: pointer;
				background: rgba(0, 0, 0, 0.6);

				&:hover{
					opacity: 1;
					transition: opacity .5s;
				}
			}
		}
	}
}
</style>