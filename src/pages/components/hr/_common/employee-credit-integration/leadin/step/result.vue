<template>
	<div class="hr-leadin-result">
		<div class="g-tc" style="marginTop: 60px;">
			<div
				class="icon iconfont icon-selected" 
				style="fontSize: 120px; color: #E74854; height: 120px; lineHeight: 120px;"
			/>
			<div class="g-m-t-5" style="fontSize: 16px; color: #000">导入完成</div>
		</div>
		<div class="g-tc" style="word-break: break-word; fontSize: 14px; color: #333; marginTop: 60px">
			共导入
			<span style="color:#ed4014">{{ total - error }}</span>
			条数据，其中
			<span style="color:#ed4014">{{ error }}</span>
			条数据有问题。
		</div>
	</div>
</template>

<script>
export default {
	name: '',
	props: {
		msg: String,
		total: Number,
		error: Number
	}
};
</script>

<style lang="scss">
.hr-leadin-result {
	width: 800px;
	height: 400px;
	background: #f5f5f6;
	padding: 30px;
}
</style>

