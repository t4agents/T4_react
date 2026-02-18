import { useState } from 'react';
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
import { PayrollSchedule } from 'src/types/payroll';
import { Icon } from '@iconify/react/dist/iconify.js';

const FREQUENCY_OPTIONS = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'semimonthly', label: 'Semi-monthly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

interface PayrollScheduleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const PayrollScheduleFormModal = ({
    isOpen,
    onClose,
    onComplete,
}: PayrollScheduleFormModalProps) => {
    const [frequency, setFrequency] = useState('');
    const [anchorDate, setAnchorDate] = useState<Date | undefined>(undefined);
    const [payDateOffsetDays, setPayDateOffsetDays] = useState(0);
    const [effectiveFrom, setEffectiveFrom] = useState<Date | undefined>(undefined);
    const [effectiveTo, setEffectiveTo] = useState<Date | undefined | null>(undefined);
    const [status, setStatus] = useState('active');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openDatePickers, setOpenDatePickers] = useState({
        anchorDate: false,
        effectiveFrom: false,
        effectiveTo: false,
    });

    const handleSubmit = async () => {
        // Validation
        if (!frequency.trim()) {
            setError('Frequency is required');
            return;
        }

        if (!anchorDate) {
            setError('Anchor date is required');
            return;
        }

        if (payDateOffsetDays === undefined || payDateOffsetDays === null) {
            setError('Pay date offset days is required');
            return;
        }

        if (!effectiveFrom) {
            setError('Effective from date is required');
            return;
        }

        if (effectiveTo && effectiveFrom > effectiveTo) {
            setError('Effective to date must be after effective from date');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload: Partial<PayrollSchedule> = {
                frequency,
                anchor_date: anchorDate.toISOString().split('T')[0],
                pay_date_offset_days: parseInt(payDateOffsetDays.toString()),
                effective_from: effectiveFrom.toISOString().split('T')[0],
                effective_to: effectiveTo ? effectiveTo.toISOString().split('T')[0] : null,
                status: status as 'active' | 'inactive',
            };

            await payrollAPI.createPayrollSchedule(payload);

            // Reset form
            setFrequency('');
            setAnchorDate(undefined);
            setPayDateOffsetDays(0);
            setEffectiveFrom(undefined);
            setEffectiveTo(undefined);
            setStatus('active');

            onComplete();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create payroll schedule';
            setError(errorMessage);
            console.error('Error creating payroll schedule:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFrequency('');
        setAnchorDate(undefined);
        setPayDateOffsetDays(0);
        setEffectiveFrom(undefined);
        setEffectiveTo(undefined);
        setStatus('active');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Payroll Schedule</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Frequency */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="frequency">Frequency *</Label>
                        <Select value={frequency} onValueChange={setFrequency}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                {FREQUENCY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pay Date Offset Days */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="payDateOffset">Pay Date Offset (Days) *</Label>
                        <Input
                            id="payDateOffset"
                            type="number"
                            min="0"
                            max="31"
                            value={payDateOffsetDays}
                            onChange={(e) => setPayDateOffsetDays(parseInt(e.target.value) || 0)}
                            placeholder="e.g., 5"
                        />
                    </div>

                    {/* Anchor Date */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="anchorDate">Anchor Date *</Label>
                        <Popover
                            open={openDatePickers.anchorDate}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({
                                    ...prev,
                                    anchorDate: open,
                                }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                >
                                    {anchorDate
                                        ? anchorDate.toLocaleDateString()
                                        : 'Select anchor date'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={anchorDate}
                                    onSelect={(date) => {
                                        setAnchorDate(date);
                                        setOpenDatePickers((prev) => ({
                                            ...prev,
                                            anchorDate: false,
                                        }));
                                    }}
                                    disabled={(date) => date > new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Effective From */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="effectiveFrom">Effective From *</Label>
                        <Popover
                            open={openDatePickers.effectiveFrom}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({
                                    ...prev,
                                    effectiveFrom: open,
                                }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                >
                                    {effectiveFrom
                                        ? effectiveFrom.toLocaleDateString()
                                        : 'Select start date'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={effectiveFrom}
                                    onSelect={(date) => {
                                        setEffectiveFrom(date);
                                        setOpenDatePickers((prev) => ({
                                            ...prev,
                                            effectiveFrom: false,
                                        }));
                                    }}
                                    disabled={(date) => date > new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Effective To */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="effectiveTo">Effective To (Optional)</Label>
                        <Popover
                            open={openDatePickers.effectiveTo}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({
                                    ...prev,
                                    effectiveTo: open,
                                }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                >
                                    {effectiveTo
                                        ? effectiveTo.toLocaleDateString()
                                        : 'Select end date'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={effectiveTo || undefined}
                                    onSelect={(date) => {
                                        setEffectiveTo(date);
                                        setOpenDatePickers((prev) => ({
                                            ...prev,
                                            effectiveTo: false,
                                        }));
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
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
                        {loading ? 'Creating...' : 'Create Schedule'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PayrollScheduleFormModal;
