'use client';

import React, { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import { Badge } from 'src/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'src/components/ui/table';
import type { CellContext, ColumnDef, SortingState } from '@tanstack/react-table';
import { Input } from 'src/components/ui/input';
import { Button } from 'src/components/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ArrowUp, ArrowDown, ChevronsUpDown, Trash2, Pencil } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'src/components/ui/select';
import { Label } from 'src/components/ui/label';
import CardBox from '../shared/CardBox';

const badgeColors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-teal-100 text-teal-700',
    'bg-orange-100 text-orange-700',
];

export function getColorForValue(value: string) {
    const index =
        Math.abs(value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
        badgeColors.length;
    return badgeColors[index];
}

export function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

interface DynamicTableProps<T> {
    data?: T[];
    onEdit?: (row: T) => void;
    visibleColumns?: string[];
    onAddNew?: () => void;
}

export const PayrollDataTable = <T extends Record<string, any>>({
    data = [],
    onEdit,
    visibleColumns,
    onAddNew,
}: DynamicTableProps<T>) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const renderValue = (val: unknown): React.ReactNode => {
        if (val === null || val === undefined) return '-';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
    };

    const paginationOptions = useMemo(() => {
        const sizes = [5, 10, 20, 50];
        return sizes.filter((size) => size <= data.length);
    }, [data.length]);

    const columns = useMemo<ColumnDef<T, unknown>[]>(() => {
        if (!data.length) return [];

        let keys = Object.keys(data[0]).filter((key) => {
            const val = data[0][key];
            return !Array.isArray(val);
        });

        // Filter to only visible columns if specified
        if (visibleColumns && visibleColumns.length > 0) {
            keys = keys.filter((key) => visibleColumns.includes(key));
        }

        const baseColumns = keys.map((col) => ({
            accessorKey: col,
            header: toTitleCase(col.replace(/([A-Z])/g, ' $1').trim()),
            cell: (info: CellContext<T, unknown>) => {
                const value = info.getValue();

                if (
                    ['status', 'availability', 'gender', 'category', 'genre', 'position'].some((key) =>
                        col.toLowerCase().includes(key),
                    )
                ) {
                    const cls = getColorForValue(String(value));

                    return (
                        <Badge
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${cls}`}
                        >
                            {renderValue(value)}
                        </Badge>
                    );
                }

                if (col.toLowerCase().includes('rating')) {
                    const ratingValue = Number(value) || 0;
                    const maxRating = 5;
                    const fullStars = Math.floor(ratingValue);
                    const halfStar = ratingValue % 1 >= 0.5;
                    const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

                    return (
                        <div className="flex items-center gap-0.5">
                            {[...Array(fullStars)].map((_, i) => (
                                <Icon
                                    key={`full-${i}`}
                                    icon="mdi:star"
                                    className="text-[#f3d55b] w-6 h-6 shrink-0"
                                />
                            ))}
                            {halfStar && (
                                <Icon icon="mdi:star-half-full" className="text-[#f3d55b] w-6 h-6 shrink-0" />
                            )}
                            {[...Array(emptyStars)].map((_, i) => (
                                <Icon
                                    key={`empty-${i}`}
                                    icon="mdi:star-outline"
                                    className="text-[#f3d55b] w-6 h-6 shrink-0"
                                />
                            ))}
                        </div>
                    );
                }

                if (typeof value === 'boolean') {
                    return value ? (
                        <Badge className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Inactive
                        </Badge>
                    ) : (
                        <Badge className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Active
                        </Badge>
                    );
                }

                if (col.toLowerCase().includes('id')) {
                    return (
                        <span className="text-gray-900 dark:text-white font-medium max-w-xs truncate whitespace-nowrap">
                            {renderValue(value)}
                        </span>
                    );
                }

                if (typeof value === 'object' && value !== null) {
                    const typedValue = value as Record<string, unknown>;
                    const {
                        image,
                        imageUrl,
                        thumbnailUrl,
                        thumbnail,
                        image_url,
                        avatar,
                        qrCode,
                        profileImage,
                        icon,
                        ...rest
                    } = typedValue;
                    const keys = Object.keys(rest);

                    return (
                        <div className="flex items-center gap-2">
                            {image ||
                                imageUrl ||
                                thumbnailUrl ||
                                thumbnail ||
                                image_url ||
                                avatar ||
                                qrCode ||
                                profileImage ||
                                icon ? (
                                <img
                                    src={
                                        (image as string) ??
                                        (imageUrl as string) ??
                                        (thumbnailUrl as string) ??
                                        (thumbnail as string) ??
                                        (image_url as string) ??
                                        (avatar as string) ??
                                        (qrCode as string) ??
                                        (profileImage as string) ??
                                        (icon as string)
                                    }
                                    width={36}
                                    height={36}
                                    className="rounded-full"
                                />
                            ) : (
                                <Badge className="size-10 flex items-center justify-center rounded-full shrink-0">
                                    {keys[0] ? String(rest[keys[0]])[0]?.toUpperCase() : '?'}
                                </Badge>
                            )}
                            <div className="flex flex-col">
                                {keys.map((k) => {
                                    const val = rest[k];
                                    let displayValue;

                                    const isTimestamp = (v: unknown) => {
                                        if (typeof v !== 'string') return false;
                                        return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(v);
                                    };
                                    if (isTimestamp(val)) return null;

                                    if (typeof val === 'object' && val !== null) {
                                        if ('lat' in val && 'lng' in val) {
                                            displayValue = `${val.lat}, ${val.lng}`;
                                        } else {
                                            displayValue = JSON.stringify(val);
                                        }
                                    } else {
                                        displayValue = val ?? '-';
                                    }

                                    return (
                                        <span
                                            key={k}
                                            className={
                                                k === 'name'
                                                    ? 'text-gray-900 dark:text-white font-semibold max-w-xs truncate whitespace-nowrap pe-6'
                                                    : 'text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate whitespace-nowrap pe-6'
                                            }
                                        >
                                            {renderValue(displayValue)}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                if (typeof value === 'string') {
                    if (
                        value?.includes('png') ||
                        value?.includes('jpg') ||
                        value?.includes('jpeg') ||
                        value?.includes('svg') ||
                        col.toLowerCase().includes('thumbnail') ||
                        col.toLowerCase().includes('image')
                    ) {
                        return <img src={value} className="size-10 rounded-md" />;
                    }
                }

                if (
                    ['user', 'product', 'fullname', 'name', 'author'].some((key) =>
                        col.toLowerCase().includes(key),
                    )
                ) {
                    const cls = getColorForValue(String(value));
                    return (
                        <div className="flex items-center gap-2 min-w-0">
                            <Badge
                                className={`size-8 sm:size-10 flex items-center justify-center rounded-full flex-shrink-0 ${cls}`}
                            >
                                {value ? String(value)[0]?.toUpperCase() : '?'}
                            </Badge>
                            <span className="text-gray-900 dark:text-white font-semibold max-w-xs truncate whitespace-nowrap text-xs sm:text-sm">
                                {renderValue(value)}
                            </span>
                        </div>
                    );
                }

                return (
                    <span className="text-gray-900 dark:text-white font-medium max-w-xs truncate block">
                        {renderValue(value)}
                    </span>
                );
            },
            enableSorting: true,
            enableGlobalFilter: true,
        }));

        const actionColumn: ColumnDef<T, unknown> = {
            id: 'action',
            header: 'Action',
            enableSorting: false,
            cell: ({ row }) => {
                const original = row.original;
                return (
                    <div className="flex items-center gap-1 sm:gap-2 justify-end">
                        <Button 
                            size={'sm'} 
                            variant={'lightprimary'}
                            className="size-7 sm:size-8 !rounded-full flex-shrink-0"
                            onClick={() => {
                                console.log(original);
                                onEdit?.(original);
                            }}
                            title="Edit"
                        >
                            <Pencil className="size-4" />
                        </Button>
                        <Button 
                            size={'sm'} 
                            variant={'lighterror'} 
                            className="size-7 sm:size-8 !rounded-full flex-shrink-0"
                            title="Delete"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                );
            },
        };

        return [...baseColumns, actionColumn];
    }, [data, visibleColumns]);

    // React Table Setup
    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        globalFilterFn: 'includesString',
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: paginationOptions[0] || 5 } },
    });

    // CSV Download
    const handleDownload = () => {
        if (!data.length) return;

        const headers = columns.map((col) => String(col.header));
        const rows = data.map((item) =>
            columns.map((col) => {
                const column = col as unknown as { accessorKey?: string };
                const accessorKey = column.accessorKey;
                const value = accessorKey ? item[accessorKey] : '';
                if (Array.isArray(value)) return `"[array]"`;
                return `"${String(value ?? '').replace(/"/g, '""')}"`;
            }),
        );

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'table-data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <CardBox>
            <div>
                {data.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No data available.</p>
                ) : (
                    <>
                        {/* Search + Download - Responsive Layout */}
                        <div className="p-4 pt-0 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <h3 className="text-lg sm:text-xl font-semibold">Payroll</h3>
                                {onAddNew && (
                                    <Button onClick={onAddNew} className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start" size="sm">
                                        <Icon icon="mdi:plus" className="w-4 h-4" />
                                        <span className="hidden sm:inline">Add New Employee</span>
                                        <span className="sm:hidden">Add Employee</span>
                                    </Button>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                                <Input
                                    type="text"
                                    className="flex-1 min-w-0 placeholder:text-gray-400 dark:placeholder:text-white/20"
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Search..."
                                />
                                <Button onClick={handleDownload} className="p-2 px-4 rounded-md sm:w-auto w-full">
                                    <Icon icon="material-symbols:download-rounded" width={20} height={20} />
                                    <span className="ml-2 sm:hidden">Download</span>
                                </Button>
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto border rounded-md border-ld">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead
                                                    key={header.id}
                                                    className="cursor-pointer select-none min-w-32 px-0"
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <Button
                                                            className="flex items-center gap-1 px-4 bg-transparent hover:bg-transparent text-dark dark:text-white font-semibold text-xs sm:text-sm"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <span className="truncate">
                                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                            </span>
                                                            {{
                                                                asc: <ArrowUp className="w-4 h-4 inline flex-shrink-0" />,
                                                                desc: <ArrowDown className="w-4 h-4 inline flex-shrink-0" />,
                                                            }[header.column.getIsSorted() as string] ??
                                                                (header.column.id !== 'action' ? (
                                                                    <ChevronsUpDown className="w-2 h-2 inline flex-shrink-0" />
                                                                ) : null)}
                                                        </Button>
                                                    )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>

                                <TableBody>
                                    {table.getRowModel().rows.length > 0 ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} className="hover:bg-primary/10 transition-colors">
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="text-gray-700 dark:text-white/70 text-sm px-4 py-3">
                                                        <div className="truncate">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </div>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="text-center p-6 text-gray-500 dark:text-white/70 font-medium"
                                            >
                                                No results found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3 px-4 py-2">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <div key={row.id} className="border border-border rounded-lg p-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                        <div className="space-y-3">
                                            {row.getVisibleCells().map((cell, idx) => {
                                                const header = flexRender(
                                                    cell.column.columnDef.header,
                                                    cell.column.columnDef.header as any,
                                                );
                                                // Skip action column in header display on mobile
                                                if (cell.column.id === 'action') {
                                                    return (
                                                        <div key={cell.id} className="flex justify-end pt-2 border-t border-border">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div key={cell.id} className="flex flex-col">
                                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                            {header}
                                                        </span>
                                                        <span className="text-sm text-gray-900 dark:text-white/80 mt-1">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-6 text-gray-500 dark:text-white/70 font-medium">
                                    No results found.
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls - Responsive */}
                        <div className="flex flex-col gap-4 p-4 border-t border-border dark:border-white/10">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        variant={'secondary'}
                                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                                    >
                                        Next
                                    </Button>
                                </div>

                                <div className="text-forest-black dark:text-white/90 font-medium text-xs sm:text-base whitespace-nowrap">
                                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Label
                                        htmlFor="pageSize"
                                        className="mr-0 text-forest-black dark:text-white/90 text-xs sm:text-base font-medium whitespace-nowrap"
                                    >
                                        <span className="hidden sm:inline">Rows per page:</span>
                                        <span className="sm:hidden">Rows:</span>
                                    </Label>
                                    <Select
                                        value={String(table.getState().pagination.pageSize)}
                                        onValueChange={(value) => table.setPageSize(Number(value))}
                                    >
                                        <SelectTrigger className="!w-16 sm:!w-18 cursor-pointer text-xs sm:text-sm">
                                            <SelectValue placeholder="Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paginationOptions.map((size) => (
                                                <SelectItem key={size} value={String(size)}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </CardBox>
    );
};
