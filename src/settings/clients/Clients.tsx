import { useState, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import { Button } from 'src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from 'src/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'src/components/ui/table';
import { Checkbox } from 'src/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { clientsAPI } from 'src/api/clients';
import BizEntityFormModal from './BizEntityFormModal';
import { TbDotsVertical } from 'react-icons/tb';
import { Icon } from '@iconify/react';

interface Client {
    id: string;
    type: string;
    name: string;
    business_number: string;
    payroll_account_number: string;
    province: string;
    street_address: string;
    city: string;
    postal_code: string;
    phone: string;
    email: string;
    wsib_number: string;
    eht_account: string;
    remittance_frequency: string;
    tax_year_end: string;
    legal_name: string;
    operating_name: string;
    business_type: string;
    incorporation_date: string;
    employee_count: number;
}

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Clients',
    },
];

const mockClients: Client[] = [
    {
        id: '1',
        type: 'FIRM',
        name: 'Acme Corporation',
        business_number: 'BN-001',
        payroll_account_number: 'PA-001',
        province: 'ON',
        street_address: '123 Main Street',
        city: 'Toronto',
        postal_code: 'M5V 3A8',
        phone: '+1 (416) 555-0100',
        email: 'contact@acme.com',
        wsib_number: 'WSIB-001',
        eht_account: 'EHT-001',
        remittance_frequency: 'monthly',
        tax_year_end: '2026-12-31',
        legal_name: 'Acme Corporation Inc',
        operating_name: 'Acme',
        business_type: 'Corporation',
        incorporation_date: '2020-01-15',
        employee_count: 50,
    },
    {
        id: '2',
        type: 'FIRM',
        name: 'Tech Solutions Ltd',
        business_number: 'BN-002',
        payroll_account_number: 'PA-002',
        province: 'BC',
        street_address: '456 Innovation Lane',
        city: 'Vancouver',
        postal_code: 'V6B 4Y3',
        phone: '+1 (604) 555-0200',
        email: 'info@techsolutions.com',
        wsib_number: 'WSIB-002',
        eht_account: 'EHT-002',
        remittance_frequency: 'bi-weekly',
        tax_year_end: '2026-06-30',
        legal_name: 'Tech Solutions Ltd',
        operating_name: 'TechSol',
        business_type: 'Limited Company',
        incorporation_date: '2018-03-20',
        employee_count: 120,
    },
    {
        id: '3',
        type: 'FIRM',
        name: 'Global Services Inc',
        business_number: 'BN-003',
        payroll_account_number: 'PA-003',
        province: 'AB',
        street_address: '789 Commerce Plaza',
        city: 'Calgary',
        postal_code: 'T2P 1H7',
        phone: '+1 (403) 555-0300',
        email: 'contact@globalservices.com',
        wsib_number: 'WSIB-003',
        eht_account: 'EHT-003',
        remittance_frequency: 'monthly',
        tax_year_end: '2026-12-31',
        legal_name: 'Global Services Incorporated',
        operating_name: 'Global',
        business_type: 'Corporation',
        incorporation_date: '2015-07-10',
        employee_count: 75,
    },
];

const Clients = () => {
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any | null>(null);

    const selectedClient = clients.find((c) => c.id === selectedClientId);

    const tableActionData = [
        {
            icon: 'solar:pen-new-square-broken',
            listtitle: 'Edit',
        },
        {
            icon: 'solar:trash-bin-minimalistic-outline',
            listtitle: 'Delete',
        },
    ];

    const handleCheckboxChange = (clientId: string) => {
        setSelectedClientId(selectedClientId === clientId ? null : clientId);
    };

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const data = await clientsAPI.listClients();
            // filter out deleted if backend marks is_delete or is_deleted
            const filtered = Array.isArray(data)
                ? data.filter((d: any) => !d.is_delete && !d.is_deleted)
                : [];
            setClients(filtered as any);
        } catch (err) {
            console.error('Failed to load clients:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateClient = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const handleEditClient = (client: any) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClient = async (clientId: string) => {
        try {
            await clientsAPI.softDeleteClient(clientId);
            // reload
            await fetchClients();
        } catch (err) {
            console.error('Failed to delete client:', err);
        }
    };

    // load on mount
    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <>
            <BreadcrumbComp
                title="Clients"
                items={BCrumb}
                leftContent={
                    selectedClient ? (
                        <Card className="p-4 gap-2 bg-muted/50">
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm font-medium">Selected Client</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-base font-semibold mb-1">{selectedClient.name}</p>
                                <p className="text-xs text-muted-foreground mb-1">
                                    {selectedClient.city}, {selectedClient.province}
                                </p>
                                {selectedClient.phone && (
                                    <p className="text-xs text-muted-foreground">
                                        {selectedClient.phone}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="p-4">
                            <CardContent className="text-center text-muted-foreground py-2">
                                No client selected
                            </CardContent>
                        </Card>
                    )
                }
            />

            <div className="flex gap-6 flex-col">
                <CardBox>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Clients List</h3>
                        <Button onClick={handleCreateClient} color={"primary"} className="flex items-center gap-1.5 rounded-md">
                            <Icon icon="solar:add-circle-outline" width="18" height="18" /> Add Client
                        </Button>
                    </div>

                    <div className="flex flex-col border rounded-md border-ld">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-semibold">
                                                    Client Name
                                                </TableHead>
                                                <TableHead className="text-sm font-semibold">
                                                    City, Province
                                                </TableHead>
                                                <TableHead className="text-sm font-semibold">
                                                    Phone
                                                </TableHead>
                                                <TableHead className="text-sm font-semibold">
                                                    Email
                                                </TableHead>
                                                <TableHead className="text-sm font-semibold">
                                                    Employees
                                                </TableHead>
                                                <TableHead className="text-sm font-semibold">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {isLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        Loading clients...
                                                    </TableCell>
                                                </TableRow>
                                            ) : clients.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        No clients found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                clients.map((client) => (
                                                    <TableRow
                                                        key={client.id}
                                                        className={
                                                            selectedClientId === client.id
                                                                ? 'bg-primary/5'
                                                                : ''
                                                        }
                                                    >
                                                        {/* Client Name */}
                                                        <TableCell className="font-semibold">
                                                            <div
                                                                className="flex items-center gap-3 cursor-pointer"
                                                                onClick={() =>
                                                                    handleCheckboxChange(client.id)
                                                                }
                                                            >
                                                                <Checkbox
                                                                    checked={selectedClientId === client.id}
                                                                    onCheckedChange={() =>
                                                                        handleCheckboxChange(client.id)
                                                                    }
                                                                />
                                                                {client.name}
                                                            </div>
                                                        </TableCell>

                                                        {/* Location */}
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {client.city}, {client.province}
                                                        </TableCell>

                                                        {/* Phone */}
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {client.phone}
                                                        </TableCell>

                                                        {/* Email */}
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {client.email}
                                                        </TableCell>

                                                        {/* Employee Count */}
                                                        <TableCell className="text-center text-sm">
                                                            {client.employee_count}
                                                        </TableCell>

                                                        {/* Actions Dropdown */}
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                                                                        <TbDotsVertical size={22} />
                                                                    </span>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-40">
                                                                        <DropdownMenuItem className="flex gap-3 items-center cursor-pointer" onClick={() => handleEditClient(client)}>
                                                                            <Icon icon={'solar:pen-new-square-broken'} height={18} />
                                                                            <span>Edit</span>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="flex gap-3 items-center cursor-pointer" onClick={() => handleDeleteClient(client.id)}>
                                                                            <Icon icon={'solar:trash-bin-minimalistic-outline'} height={18} />
                                                                            <span>Delete</span>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBox>
                    <BizEntityFormModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onComplete={async () => { setIsModalOpen(false); await fetchClients(); }}
                        initialData={editingClient}
                    />
            </div>
        </>
    );
};

export default Clients;
