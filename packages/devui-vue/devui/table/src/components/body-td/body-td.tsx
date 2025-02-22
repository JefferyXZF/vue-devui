import { defineComponent, toRef, inject } from 'vue';
import type { SetupContext } from 'vue';
import { bodyTdProps, BodyTdProps } from './body-td-types';
import { TABLE_TOKEN, ITableInstanceAndDefaultRow } from '../../table-types';
import { Tooltip } from '../../../../tooltip';
import { useFixedColumn } from '../../composables/use-table';
import { useBodyTd } from './use-body-td';

export default defineComponent({
  name: 'DTableBodyTd',
  inheritAttrs: false,
  props: bodyTdProps,
  emits: ['cellClick'],
  setup(props: BodyTdProps, ctx: SetupContext) {
    const column = toRef(props, 'column');
    const table = inject(TABLE_TOKEN) as ITableInstanceAndDefaultRow;
    const { stickyClass, stickyStyle } = useFixedColumn(column);
    const { tdRef, isShowTooltip, tooltipContent, cellMode, onCellClick } = useBodyTd(props, ctx);

    return () => {
      return (
        <Tooltip content={tooltipContent.value} disabled={!isShowTooltip.value}>
          <td ref={tdRef} class={stickyClass.value} style={stickyStyle.value} {...ctx.attrs} onClick={onCellClick}>
            {props.column.renderCell?.(props.row, props.column, table.store, props.index, table.props, cellMode)}
          </td>
        </Tooltip>
      );
    };
  },
});
