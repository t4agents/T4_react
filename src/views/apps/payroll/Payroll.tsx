import { useState, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { DataTable } from 'src/components/apps/payroll/PayrollDataTable';
import { employeeAPI } from 'src/api/employee';

import PayrollForm from 'src/views/apps/payroll/PayrollForm';
import {Employee} from 'src/types/employee'

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
    
    return (
        <>
            <BreadcrumbComp title="Table" items={BCrumb} />
            <div className="flex gap-6 flex-col ">
                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        Error: {error}
                    </div>
                )}
                {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading employees...</div>
                ) : (
                    <DataTable<Employee>
                        data={employees}
                        onEdit={handleEdit}
                        onAddNew={handleAddNew}
                        visibleColumns={['first_name', 'last_name']}
                    />
                )}
            </div>

            {isFormOpen && (
                <PayrollForm
                    employee={selectedEmployee || undefined}
                    onClose={() => setIsFormOpen(false)}
                    onComplete={() => setIsFormOpen(false)}
                />
            )}
        </>
    );
};

export default Payroll;
