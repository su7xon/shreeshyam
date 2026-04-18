'use client';

import { useState, ReactNode } from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getId?: (item: T) => string;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onSelectionChange,
  getId = (item) => item.id?.toString() || item._id?.toString() || Math.random().toString(),
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      return { key, direction: 'asc' };
    });
  };

  const sortedData = sortConfig
    ? [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : data;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(sortedData.map(getId));
      setSelectedRows(allIds);
      onSelectionChange?.(Array.from(allIds));
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) newSelected.add(id); else newSelected.delete(id);
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const isAllSelected = sortedData.length > 0 && selectedRows.size === sortedData.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  return (
    <div className="admin-table-wrap">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {onSelectionChange && (
                <th className="w-12 px-4">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded bg-transparent border-white/20 text-[#3b82f6] focus:ring-[#3b82f6] cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`${column.sortable ? 'cursor-pointer hover:text-[#d1d5db]' : ''} ${column.className || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    {column.header}
                    {column.sortable && (
                      sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className="px-4 py-12 text-center text-[#6b7280]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item) => {
                const id = getId(item);
                const isSelected = selectedRows.has(id);
                return (
                  <tr key={id}>
                    {onSelectionChange && (
                      <td className="px-4 w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(id, e.target.checked)}
                          className="h-4 w-4 rounded bg-transparent border-white/20 text-[#3b82f6] focus:ring-[#3b82f6] cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className={column.className || ''}>
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
