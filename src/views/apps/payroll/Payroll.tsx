import TableComp from 'src/components/apps/payroll';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import StripedRowTable from 'src/components/apps/payroll/StripedRowTable';
import HoverTable from 'src/components/apps/payroll/HoverTable';
import CheckboxTable from 'src/components/apps/payroll/CheckboxTable';
import { DataTable } from 'src/components/apps/payroll/DataTable';
import { EmployeesData } from 'src/components/apps/payroll/data';
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
    return (
        <>
            <BreadcrumbComp title="Table" items={BCrumb} />
            <div className="flex gap-6 flex-col ">
                <DataTable data={EmployeesData} />
                <TableComp />
                <StripedRowTable />
                <HoverTable />
                <CheckboxTable />
            </div>
        </>
    );
};

export default Payroll;
