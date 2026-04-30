// src/components/shared/DataTable.tsx
'use client';

import { memo, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T, index: number) => ReactNode;
}

interface SortState {
  key: string;
  order: 'asc' | 'desc';
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  className?: string;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded-md bg-gray-100 animate-pulse" style={{ width: `${60 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

function DataTableInner<T extends { id: string }>({
  columns,
  data,
  isLoading,
  emptyState,
  selectable,
  onSelectionChange,
  onSort,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSort = useCallback(
    (key: string) => {
      const newOrder = sort?.key === key && sort.order === 'asc' ? 'desc' : 'asc';
      setSort({ key, order: newOrder });
      onSort?.(key, newOrder);
    },
    [sort, onSort]
  );

  const toggleAll = useCallback(() => {
    const allIds = data.map((r) => r.id);
    const newSelected = selected.size === data.length ? new Set<string>() : new Set(allIds);
    setSelected(newSelected);
    onSelectionChange?.([...newSelected]);
  }, [data, selected, onSelectionChange]);

  const toggleRow = useCallback(
    (id: string) => {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelected(next);
      onSelectionChange?.([...next]);
    },
    [selected, onSelectionChange]
  );

  return (
    <div className={cn('overflow-x-auto rounded-xl border border-gray-200 bg-white', className)}>
      <table className="w-full text-sm" role="grid">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === data.length && data.length > 0}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                  className="rounded border-gray-300 accent-indigo-600"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left font-semibold text-gray-500 text-xs tracking-wider uppercase',
                  col.sortable && 'cursor-pointer select-none hover:text-gray-900 transition-colors',
                  col.width
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                aria-sort={
                  sort?.key === String(col.key)
                    ? sort.order === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <svg
                      className={cn(
                        'h-3 w-3 transition-opacity',
                        sort?.key === String(col.key) ? 'opacity-100' : 'opacity-30'
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden
                    >
                      {sort?.key === String(col.key) && sort.order === 'desc' ? (
                        <path d="m6 9 6 6 6-6" />
                      ) : (
                        <path d="m18 15-6-6-6 6" />
                      )}
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length + (selectable ? 1 : 0)} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-16 text-center text-gray-400"
              >
                {emptyState ?? 'No results found'}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={cn(
                  'group hover:bg-indigo-50/30 transition-colors',
                  selected.has(row.id) && 'bg-indigo-50/50'
                )}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      aria-label={`Select row ${rowIndex + 1}`}
                      className="rounded border-gray-300 accent-indigo-600"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-gray-700 align-middle">
                    {col.render
                      ? col.render(row, rowIndex)
                      : String(row[col.key as keyof T] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner;
