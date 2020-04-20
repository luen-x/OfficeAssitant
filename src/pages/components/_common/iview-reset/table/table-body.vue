<template>
<!--  eslint-disable  -->
	<table :style="styleObject" cellspacing="0" cellpadding="0" border="0">
		<colgroup>
			<col v-for="(column, index) in columns" :width="setCellWidth(column)" :key="index">
		</colgroup>
		<tbody :class="[prefixCls + '-tbody']">
			<div v-for="(row,index) in data" :key="index">
				<table-tr
					:draggable="draggable"
					:row="row"
					:key="row._rowKey"
					:prefix-cls="prefixCls"
					@mouseenter.native.stop="handleMouseIn(row._index)"
					@mouseleave.native.stop="handleMouseOut(row._index)"
					@click.native="clickCurrentRow(row._index)"
					@dblclick.native.stop="dblclickCurrentRow(row._index)">
					<td v-for="(column,index) in columns" :class="alignCls(column, row)" :key="index">
						<table-cell
							:fixed="fixed"
							:prefix-cls="prefixCls"
							:row="row"
							:key="column._columnKey"
							:column="column"
							:natural-index="index"
							:index="row._index"
							:checked="rowChecked(row._index)"
							:disabled="rowDisabled(row._index)"
							:expanded="rowExpanded(row._index)"
						/>
					</td>
				</table-tr>
				<tr v-if="rowExpanded(row._index)" :class="{[prefixCls + '-expanded-hidden']: fixed}">
					<td :colspan="columns.length" :class="prefixCls + '-expanded-cell'">
						<Expand :key="row._rowKey" :row="row" :render="expandRender" :index="row._index"/>
					</td>
				</tr>
			</div>
		</tbody>
	</table>
</template>
<script>
/* eslint-disable */ 

// todo :key="row"
import TableTr from './table-tr.vue';
import TableCell from './cell.vue';
import Expand from './expand.js';
import Mixin from './mixin';

export default {
	name: 'table-body',
	components: { TableCell, Expand, TableTr },
	mixins: [Mixin],
	props: {
		prefixCls: String,
		styleObject: Object,
		columns: Array,
		data: Array, // rebuildData
		objData: Object,
		columnsWidth: Object,
		fixed: {
			type: [Boolean, String],
			default: false
		},
		draggable: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		expandRender() {
			let render = function () {
				return '';
			};
			for (let i = 0; i < this.columns.length; i++) {
				const column = this.columns[i];
				if (column.type && column.type === 'expand') {
					if (column.render) render = column.render;
				}
			}
			return render;
		}
	},
	methods: {
		rowChecked(_index) {
			return this.objData[_index] && this.objData[_index]._isChecked;
		},
		rowDisabled(_index) {
			return this.objData[_index] && this.objData[_index]._isDisabled;
		},
		rowExpanded(_index) {
			return this.objData[_index] && this.objData[_index]._isExpanded;
		},
		handleMouseIn(_index) {
			this.$parent.handleMouseIn(_index);
		},
		handleMouseOut(_index) {
			this.$parent.handleMouseOut(_index);
		},
		clickCurrentRow(_index) {
			this.$parent.clickCurrentRow(_index);
		},
		dblclickCurrentRow(_index) {
			this.$parent.dblclickCurrentRow(_index);
		}
	}
};
</script>
