import { useState, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { PayrollDataTable } from 'src/components/payroll/PayrollDataTable';
import { payrollAPI } from 'src/api/payroll';
import PayrollScheduleFormModal from 'src/payroll/PayrollScheduleFormModal';
import { PayrollSchedule } from 'src/types/payroll';
import { Button } from 'src/components/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Payroll Schedules',
    },
];

const PayrollScheduleEntrance = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [schedules, setSchedules] = useState<PayrollSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await payrollAPI.listPayrollSchedules({ skip: 0, limit: 100 });
            setSchedules(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payroll schedules';
            setError(errorMessage);
            console.error('Error fetching payroll schedules:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setIsFormOpen(true);
    };

    const handleFormComplete = async () => {
        // Refresh the schedule list
        await fetchSchedules();
        setIsFormOpen(false);
    };

    return (
        <>
            <BreadcrumbComp title="Payroll Schedules" items={BCrumb} />
            <div className="flex gap-6 flex-col">
                {/* Table and Header */}
                <div className="rounded-xl border border-border md:p-6 p-4">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="card-title">Payroll Schedules</h4>
                        <Button
                            onClick={handleAddNew}
                            className="bg-primary hover:bg-primary/90 text-white flex gap-2 items-center"
                        >
                            <Icon icon="solar:plus-circle-linear" width={18} height={18} />
                            Add Schedule
                        </Button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                            Error: {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">Loading payroll schedules...</div>
                    ) : schedules.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No payroll schedules found. Click "Add Schedule" to create one.
                        </div>
                    ) : (
                        <PayrollDataTable<PayrollSchedule>
                            data={schedules}
                            visibleColumns={[
                                'frequency',
                                'anchor_date',
                                'pay_date_offset_days',
                                'effective_from',
                                'status',
                            ]}
                        />
                    )}
                </div>
            </div>

            {isFormOpen && (
                <PayrollScheduleFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onComplete={handleFormComplete}
                />
            )}
        </>
    );
};

export default PayrollScheduleEntrance;
