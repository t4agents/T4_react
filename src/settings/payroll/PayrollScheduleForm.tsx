import { Icon } from '@iconify/react/dist/iconify.js';
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
import { config } from 'src/config';

interface PayrollScheduleFormData {
    frequency: string;
    anchor_date: Date | undefined;
    pay_date_offset_days: number;
    effective_from: Date | undefined;
    effective_to: Date | undefined | null;
    status: string;
}

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

const PayrollScheduleForm = () => {
    const [formData, setFormData] = useState<PayrollScheduleFormData>({
        frequency: '',
        anchor_date: undefined,
        pay_date_offset_days: 0,
        effective_from: undefined,
        effective_to: undefined,
        status: 'active',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [openDatePickers, setOpenDatePickers] = useState({
        anchorDate: false,
        effectiveFrom: false,
        effectiveTo: false,
    });

    const handleInputChange = (field: keyof PayrollScheduleFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setError(null);
        setSuccess(false);
    };

    const validateForm = (): boolean => {
        if (!formData.frequency) {
            setError('Frequency is required');
            return false;
        }
        if (!formData.anchor_date) {
            setError('Anchor date is required');
            return false;
        }
        if (formData.pay_date_offset_days === undefined || formData.pay_date_offset_days === null) {
            setError('Pay date offset days is required');
            return false;
        }
        if (!formData.effective_from) {
            setError('Effective from date is required');
            return false;
        }
        if (formData.effective_to && formData.effective_from > formData.effective_to) {
            setError('Effective to date must be after effective from date');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                frequency: formData.frequency,
                anchor_date: formData.anchor_date?.toISOString().split('T')[0],
                pay_date_offset_days: parseInt(formData.pay_date_offset_days.toString()),
                effective_from: formData.effective_from?.toISOString().split('T')[0],
                effective_to: formData.effective_to ? formData.effective_to.toISOString().split('T')[0] : null,
                status: formData.status,
            };

            const response = await fetch(`${config.api.baseUrl}/payroll/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Failed to create payroll schedule: ${response.statusText}`);
            }

            setSuccess(true);
            setFormData({
                frequency: '',
                anchor_date: undefined,
                pay_date_offset_days: 0,
                effective_from: undefined,
                effective_to: undefined,
                status: 'active',
            });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="rounded-xl border border-border md:p-6 p-4">
                <h4 className="card-title mb-6">Payroll Schedule Configuration</h4>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-red-800 text-sm font-medium">Error: {error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-green-800 text-sm font-medium">Payroll schedule created successfully!</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Frequency */}
                    <div>
                        <Label htmlFor="frequency" className="font-semibold">
                            Frequency <span className="text-red-600">*</span>
                        </Label>
                        <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Select payment frequency" />
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

                    {/* Anchor Date */}
                    <div>
                        <Label htmlFor="anchor-date" className="font-semibold">
                            Anchor Date <span className="text-red-600">*</span>
                        </Label>
                        <Popover
                            open={openDatePickers.anchorDate}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({ ...prev, anchorDate: open }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="anchor-date"
                                    className="w-full justify-between font-normal mt-2 hover:bg-transparent focus:border-primary"
                                >
                                    {formData.anchor_date
                                        ? formData.anchor_date.toLocaleDateString()
                                        : 'Select anchor date'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.anchor_date}
                                    onSelect={(date) => {
                                        handleInputChange('anchor_date', date);
                                        setOpenDatePickers((prev) => ({ ...prev, anchorDate: false }));
                                    }}
                                    disabled={(date) => date > new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Pay Date Offset Days */}
                    <div>
                        <Label htmlFor="pay-offset" className="font-semibold">
                            Pay Date Offset (Days) <span className="text-red-600">*</span>
                        </Label>
                        <Input
                            id="pay-offset"
                            type="number"
                            min="0"
                            max="31"
                            value={formData.pay_date_offset_days}
                            onChange={(e) =>
                                handleInputChange('pay_date_offset_days', parseInt(e.target.value) || 0)
                            }
                            placeholder="e.g., 5"
                            className="mt-2"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Number of days after the period end date to pay
                        </p>
                    </div>

                    {/* Effective From */}
                    <div>
                        <Label htmlFor="effective-from" className="font-semibold">
                            Effective From <span className="text-red-600">*</span>
                        </Label>
                        <Popover
                            open={openDatePickers.effectiveFrom}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({ ...prev, effectiveFrom: open }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="effective-from"
                                    className="w-full justify-between font-normal mt-2 hover:bg-transparent focus:border-primary"
                                >
                                    {formData.effective_from
                                        ? formData.effective_from.toLocaleDateString()
                                        : 'Select start date'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.effective_from}
                                    onSelect={(date) => {
                                        handleInputChange('effective_from', date);
                                        setOpenDatePickers((prev) => ({ ...prev, effectiveFrom: false }));
                                    }}
                                    disabled={(date) => date > new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Effective To */}
                    <div>
                        <Label htmlFor="effective-to" className="font-semibold">
                            Effective To (Optional)
                        </Label>
                        <Popover
                            open={openDatePickers.effectiveTo}
                            onOpenChange={(open) =>
                                setOpenDatePickers((prev) => ({ ...prev, effectiveTo: open }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="effective-to"
                                    className="w-full justify-between font-normal mt-2 hover:bg-transparent focus:border-primary"
                                >
                                    {formData.effective_to
                                        ? formData.effective_to.toLocaleDateString()
                                        : 'Select end date (optional)'}
                                    <Icon icon="solar:calendar-minimalistic-linear" width={18} height={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.effective_to || undefined}
                                    onSelect={(date) => {
                                        handleInputChange('effective_to', date);
                                        setOpenDatePickers((prev) => ({ ...prev, effectiveTo: false }));
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <p className="text-xs text-gray-500 mt-2">
                            Leave empty for ongoing schedules
                        </p>
                    </div>

                    {/* Status */}
                    <div>
                        <Label htmlFor="status" className="font-semibold">
                            Status <span className="text-red-600">*</span>
                        </Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                            <SelectTrigger className="mt-2 w-full">
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

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        >
                            {loading ? (
                                <>
                                    <Icon
                                        icon="solar:spinner-linear"
                                        width={18}
                                        height={18}
                                        className="mr-2 animate-spin"
                                    />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Icon icon="solar:plus-circle-linear" width={18} height={18} className="mr-2" />
                                    Create Schedule
                                </>
                            )}
                        </Button>
                        <Button
                            type="reset"
                            variant="outline"
                            onClick={() => {
                                setFormData({
                                    frequency: '',
                                    anchor_date: undefined,
                                    pay_date_offset_days: 0,
                                    effective_from: undefined,
                                    effective_to: undefined,
                                    status: 'active',
                                });
                                setError(null);
                                setSuccess(false);
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PayrollScheduleForm;
