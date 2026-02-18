import { useState, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { PayrollDataTable } from 'src/components/payroll/PayrollDataTable';
import { employeeAPI } from 'src/api/employee';
import EmployeeFormModal from 'src/payroll/EmployeeFormModal';
import PayrollForm from 'src/payroll/PayrollForm';
import { PayrollProvider } from 'src/context/payroll-context';
import PayrollPeriodManager from 'src/components/payroll/PayrollPeriodManager';
import { Employee } from 'src/types/employee';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Payroll',
    },
];


const Payroll = () => {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await employeeAPI.listEmployees({ skip: 0, limit: 100 });
                setEmployees(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch employees';
                setError(errorMessage);
                console.error('Error fetching employees:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setSelectedEmployee(null);
        setIsFormOpen(true);
    };

    const handleFormComplete = async () => {
        // Refresh the employee list
        try {
            const data = await employeeAPI.listEmployees({ skip: 0, limit: 100 });
            setEmployees(data);
        } catch (err) {
            console.error('Error refreshing employees:', err);
        }
        setIsFormOpen(false);
    };
    
    return (
        <PayrollProvider>
            <PayrollContent
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                isFormOpen={isFormOpen}
                setIsFormOpen={setIsFormOpen}
                employees={employees}
                setEmployees={setEmployees}
                isLoading={isLoading}
                error={error}
                handleEdit={handleEdit}
                handleAddNew={handleAddNew}
                handleFormComplete={handleFormComplete}
            />
        </PayrollProvider>
    );
};

const PayrollContent = ({
    selectedEmployee,
    setSelectedEmployee,
    isFormOpen,
    setIsFormOpen,
    employees,
    setEmployees,
    isLoading,
    error,
    handleEdit,
    handleAddNew,
    handleFormComplete,
}: any) => {
    return (
        <>
            <BreadcrumbComp title="Payroll" items={BCrumb} />
            <div className="flex gap-6 flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Payroll Period Manager */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg border p-4">
                            <PayrollPeriodManager />
                        </div>
                    </div>

                    {/* Employee Data Table */}
                    <div className="lg:col-span-3">
                        {error && (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                Error: {error}
                            </div>
                        )}
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-500">Loading employees...</div>
                        ) : (
                            <PayrollDataTable<Employee>
                                data={employees}
                                onEdit={handleEdit}
                                onAddNew={handleAddNew}
                                visibleColumns={['first_name', 'last_name']}
                            />
                        )}
                    </div>
                </div>
            </div>

            {isFormOpen && !selectedEmployee && (
                <EmployeeFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onComplete={handleFormComplete}
                />
            )}

            {isFormOpen && selectedEmployee && (
                <PayrollForm
                    employee={selectedEmployee}
                    onClose={() => setIsFormOpen(false)}
                    onComplete={() => setIsFormOpen(false)}
                />
            )}
        </>
    );
};

export default Payroll;
