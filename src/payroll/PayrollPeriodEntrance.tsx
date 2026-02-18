import { useState, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { PayrollDataTable } from 'src/components/payroll/PayrollDataTable';
import { payrollAPI } from 'src/api/payroll';
import PayrollPeriodFormModal from 'src/payroll/PayrollPeriodFormModal';
import { PayrollPeriod } from 'src/types/payroll';
import { Button } from 'src/components/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Payroll Periods',
    },
];

const PayrollPeriodEntrance = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPeriods();
    }, []);

    const fetchPeriods = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await payrollAPI.listPayrollPeriods({ skip: 0, limit: 100 });
            setPeriods(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payroll periods';
            setError(errorMessage);
            console.error('Error fetching payroll periods:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setIsFormOpen(true);
    };

    const handleFormComplete = async () => {
        // Refresh the periods list
        await fetchPeriods();
        setIsFormOpen(false);
    };

    return (
        <>
            <BreadcrumbComp title="Payroll Periods" items={BCrumb} />
            <div className="flex gap-6 flex-col">
                {/* Table and Header */}
                <div className="rounded-xl border border-border md:p-6 p-4">
                    <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
                        <h4 className="card-title">Payroll Periods</h4>
                        <Button
                            onClick={handleAddNew}
                            className="bg-primary hover:bg-primary/90 text-white flex gap-2 items-center w-full sm:w-auto justify-center"
                        >
                            <Icon icon="solar:plus-circle-linear" width={18} height={18} />
                            Add Period
                        </Button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                            Error: {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">Loading payroll periods...</div>
                    ) : periods.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No payroll periods found. Click "Add Period" to create one.
                        </div>
                    ) : (
                        <PayrollDataTable<PayrollPeriod>
                            data={periods}
                            visibleColumns={[
                                'payroll_schedule_id',
                                'start_date',
                                'end_date',
                                'pay_date',
                                'status',
                            ]}
                        />
                    )}
                </div>
            </div>

            {isFormOpen && (
                <PayrollPeriodFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onComplete={handleFormComplete}
                />
            )}
        </>
    );
};

export default PayrollPeriodEntrance;
