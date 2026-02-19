import { useState } from 'react';
import TableComp from 'src/components/utilities/table';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import StripedRowTable from 'src/components/utilities/table/StripedRowTable';
import HoverTable from 'src/components/utilities/table/HoverTable';
import CheckboxTable from 'src/components/utilities/table/CheckboxTable';
import { DataTable } from 'src/components/utilities/table/DataTable';
import { EmployeesData } from 'src/components/utilities/table/data_default';
import EmployeeFormModal from './EmployeeFormModal';
const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Table',
  },
];
const Notes = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddNew = () => {
    setIsFormOpen(true);
  };

  const handleFormComplete = () => {
    setIsFormOpen(false);
    // Optionally refresh data here if needed
  };

  return (
    <>
      <BreadcrumbComp title="Table" items={BCrumb} />
      <div className="flex gap-6 flex-col ">
        <DataTable data={EmployeesData} onAddNew={handleAddNew} />
      </div>

      {isFormOpen && (
        <EmployeeFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onComplete={handleFormComplete}
        />
      )}
    </>
  );
};

export default Notes;
