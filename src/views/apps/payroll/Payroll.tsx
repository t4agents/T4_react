import { useState } from 'react';
import TableComp from 'src/components/apps/payroll';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import StripedRowTable from 'src/components/apps/payroll/StripedRowTable';
import HoverTable from 'src/components/apps/payroll/HoverTable';
import CheckboxTable from 'src/components/apps/payroll/CheckboxTable';
import { DataTable } from 'src/components/apps/payroll/PayrollDataTable';
import { EmployeesData } from 'src/components/apps/payroll/data';

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

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsFormOpen(true);
    };
    return (
        <>
            <BreadcrumbComp title="Table" items={BCrumb} />
            <div className="flex gap-6 flex-col ">
                <DataTable<Employee>
                    data={EmployeesData}
                    onEdit={handleEdit}
                />
                <TableComp />
                <StripedRowTable />
                <HoverTable />
                <CheckboxTable />
            </div>

            {isFormOpen && selectedEmployee && (
                <PayrollForm
                    employee={selectedEmployee}
                    onClose={() => setIsFormOpen(false)}
                    onComplete={() => setIsFormOpen(false)}
                />)
            }
        </>
    );
};

export default Payroll;
