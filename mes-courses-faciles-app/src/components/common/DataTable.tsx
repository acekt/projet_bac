"use client";

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  globalFilterValue?: string;
  onGlobalFilterChangeValue?: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Rechercher...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<any>('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-6 overflow-hidden">
      {/* Search Bar / Header actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center flex-shrink-0">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium text-sm"
          />
        </div>

        {/* Page size indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Afficher</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="bg-white/50 dark:bg-slate-900/50 border border-slate-250 dark:border-slate-800 rounded-lg px-2 py-1 outline-none focus:border-brand-primary"
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span>lignes</span>
        </div>
      </div>

      {/* Table Card */}
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 backdrop-blur-xl rounded-[2rem] shadow-xl">
        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 relative">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-10 backdrop-blur-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    const sortState = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className="px-6 py-4.5 text-slate-450 dark:text-slate-400 text-xs font-bold uppercase tracking-wider select-none"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-1.5 ${
                              isSortable ? 'cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors' : ''
                            }`}
                            onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {isSortable && (
                              <span className="text-slate-400">
                                {sortState === 'asc' ? (
                                  <ArrowUp size={14} className="text-brand-primary" />
                                ) : sortState === 'desc' ? (
                                  <ArrowDown size={14} className="text-brand-primary" />
                                ) : (
                                  <ArrowUpDown size={14} className="opacity-40 hover:opacity-100" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-350">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 py-12"
                  >
                    Aucun résultat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/10">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-450">
            Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount() || 1} ({table.getFilteredRowModel().rows.length} éléments au total)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-all"
              title="Première page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-all"
              title="Page précédente"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-all"
              title="Page suivante"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-all"
              title="Dernière page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
