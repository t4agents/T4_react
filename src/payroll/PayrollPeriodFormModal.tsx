import { useState, useEffect } from 'react';
import { Button } from 'src/components/ui/button';
import { Calendar } from 'src/components/ui/calendar';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'src/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'src/components/ui/dialog';
import { payrollAPI } from 'src/api/payroll';
import { PayrollPeriod, PayrollSchedule } from 'src/types/payroll';
import { Icon } from '@iconify/react/dist/iconify.js';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
];

interface PayrollPeriodFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const PayrollPeriodFormModal = ({
    isOpen,
    onClose,
    onComplete,
}: PayrollPeriodFormModalProps) => {
    const [payrollScheduleId, setPayrollScheduleId] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [payDate, setPayDate] = useState<Date | undefined>(undefined);
    const [status, setStatus] = useState('draft');
    const [schedules, setSchedules] = useState<PayrollSchedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDatePickers, setOpenDatePickers] = useState({
        startDate: false,
        endDate: false,
        payDate: false,
    });

    // Fetch schedules on mount
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoadingSchedules(true);
                const data = await payrollAPI.listPayrollSchedules({ limit: 100 });
                setSchedules(data);
            } catch (err) {
                console.error('Error fetching payroll schedules:', err);
            } finally {
                setLoadingSchedules(false);
            }
        };

        if (isOpen) {
            fetchSchedules();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        // Validation
        if (!payrollScheduleId.trim()) {
            setError('Payroll schedule is required');
            return;
        }

        if (!startDate) {
            setError('Start date is required');
            return;
        }

        if (!endDate) {
            setError('End date is required');
            return;
        }

        if (!payDate) {
            setError('Pay date is required');
            return;
        }

        if (startDate > endDate) {
            setError('End date must be after start date');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload: Partial<PayrollPeriod> = {
                payroll_schedule_id: payrollScheduleId,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                pay_date: payDate.toISOString().split('T')[0],
                status: status as 'draft' | 'in_progress' | 'completed' | 'archived',
            };

            await payrollAPI.createPayrollPeriod(payload);

            // Reset form
            setPayrollScheduleId('');
            setStartDate(undefined);
            setEndDate(undefined);
            setPayDate(undefined);
            setStatus('draft');

            onComplete();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create payroll period';
            setError(errorMessage);
            console.error('Error creating payroll period:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPayrollScheduleId('');
        setStartDate(undefined);
        setEndDate(undefined);
        setPayDate(undefined);
        setStatus('draft');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Payroll Period</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Payroll Schedule */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="schedule">Payroll Schedule *</Label>
                        <Select value={payrollScheduleId} onValueChange={setPayrollScheduleId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                            <SelectContent>
                                {loadingSchedules ? (
                                    <SelectItem value="loading" disabled>
                                        Loading schedules...
                                    </SelectItem>
                                ) : schedules.length === 0 ? (
                                    <SelectItem value="empty" disabled>
                                        No schedules available
                                    </SelectItem>
                                ) : (
                                    schedules.map((schedule) => (
                                        <SelectItem key={schedule.id} value={schedule.id || ''}>
                                            {schedule.frequency} - {schedule.effective_from}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Popover
                            open={openDatePickers.startDate}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({
                                    ...prev,
                                    startDate: open,
                                }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                >
                                    {startDate
                                        ? startDate.toLocaleDateString()
                                        : 'Select start date'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => {
                                        setStartDate(date);
                                        setOpenDatePickers((prev) => ({
                                            ...prev,
                                            startDate: false,
                                        }));
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="endDate">End Date *</Label>
                        <Popover
                            open={openDatePickers.endDate}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({
                                    ...prev,
                                    endDate: open,
                                }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                >
                                    {endDate
                                        ? endDate.toLocaleDateString()
                                        : 'Select end date'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) => {
                                        setEndDate(date);
                                        setOpenDatePickers((prev) => ({
                                            ...prev,
                                            endDate: false,
                                        }));
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Pay Date */}
                    <div className="flex flex-col gap-2 lg:col-span-2">
                        <Label htmlFor="payDate">Pay Date *</Label>
                        <Popover
                            open={openDatePickers.payDate}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({
                                    ...prev,
                                    payDate: open,
                                }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                >
                                    {payDate
                                        ? payDate.toLocaleDateString()
                                        : 'Select pay date'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={payDate}
                                    onSelect={(date) => {
                                        setPayDate(date);
                                        setOpenDatePickers((prev) => ({
                                            ...prev,
                                            payDate: false,
                                        }));
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Period'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PayrollPeriodFormModal;
