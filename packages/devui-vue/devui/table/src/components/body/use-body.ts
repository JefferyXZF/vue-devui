import { inject, computed, Ref } from 'vue';
import { TABLE_TOKEN, ITableInstanceAndDefaultRow } from '../../table-types';
import { useNamespace } from '../../../../shared/hooks/use-namespace';
import { UseBodyRender, UseMergeCell, CellClickArg } from './body-types';
import { getRowIdentity } from '../../utils';

const ns = useNamespace('table');

export function useMergeCell(): UseMergeCell {
  const table = inject(TABLE_TOKEN) as ITableInstanceAndDefaultRow;
  const { _data: data, _columns: columns } = table.store.states;

  const getSpan = (row: Record<string, unknown>, column: CellClickArg['column'], rowIndex: number, columnIndex: number) => {
    const fn = table?.props.spanMethod;
    let rowspan = 1;
    let colspan = 1;

    if (typeof fn === 'function') {
      const result = fn({ row, column, rowIndex, columnIndex });

      if (Array.isArray(result)) {
        rowspan = result[0];
        colspan = result[1];
      } else if (typeof result === 'object') {
        rowspan = result.rowspan;
        colspan = result.colspan;
      }
    }

    return { rowspan, colspan };
  };

  const tableSpans = computed(() => {
    const result: Record<string, [number, number]> = {};

    if (table?.props.spanMethod) {
      data.value.forEach((row, rowIndex) => {
        columns.value.forEach((column, columnIndex) => {
          const { rowspan, colspan } = getSpan(row, column, rowIndex, columnIndex);
          if (rowspan > 1 || colspan > 1) {
            result[`${rowIndex}-${columnIndex}`] = [rowspan, colspan];
          }
        });
      });
    }

    return result;
  });

  const removeCells = computed(() => {
    const result: string[] = [];
    for (const indexKey of Object.keys(tableSpans.value)) {
      const indexArray = indexKey.split('-').map((item) => Number(item));
      const spans = tableSpans.value[indexKey];
      for (let i = 1; i < spans[0]; i++) {
        result.push(`${indexArray[0] + i}-${indexArray[1]}`);
        for (let j = 1; j < spans[1]; j++) {
          result.push(`${indexArray[0] + i}-${indexArray[1] + j}`);
        }
      }
      for (let i = 1; i < spans[1]; i++) {
        result.push(`${indexArray[0]}-${indexArray[1] + i}`);
      }
    }
    return result;
  });

  return { tableSpans, removeCells };
}

export function useBodyRender(): UseBodyRender {
  const table = inject(TABLE_TOKEN) as ITableInstanceAndDefaultRow;
  const hoverEnabled = computed(() => table?.props.rowHoveredHighlight);
  const rowLevelMap = table?.store.states.rowLevelMap || ({} as Ref<Record<string, number>>);
  const rowKey = table?.props.rowKey || 'id';
  const getTableRowClass = (row: Record<string, unknown>): Record<string, unknown> => {
    const level = rowLevelMap.value[getRowIdentity(row, rowKey)];

    return {
      [ns.e('row')]: true,
      ['hover-enabled']: hoverEnabled.value,
      ['expanded']: table?.store.isRowExpanded(row),
      [ns.em('row', `level-${level}`)]: level !== undefined,
      ['is-hidden']: table?.store.states.hiddenRowKeys.value.includes(getRowIdentity(row, rowKey)),
    };
  };

  return { getTableRowClass };
}
