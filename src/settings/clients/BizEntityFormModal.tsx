import { useEffect, useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'src/components/ui/dialog';
import { clientsAPI, ClientPayload } from 'src/api/clients/clients-api';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    initialData?: any;
}

const BizEntityFormModal = ({ isOpen, onClose, onComplete, initialData }: Props) => {
    const [type, setType] = useState('FIRM');
    const [name, setName] = useState('');
    const [businessNumber, setBusinessNumber] = useState('');
    const [payrollAccountNumber, setPayrollAccountNumber] = useState('');
    const [province, setProvince] = useState('ON');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [wsibNumber, setWsibNumber] = useState('');
    const [ehtAccount, setEhtAccount] = useState('');
    const [remittanceFrequency, setRemittanceFrequency] = useState('monthly');
    const [taxYearEnd, setTaxYearEnd] = useState(new Date().toISOString().split('T')[0]);
    const [legalName, setLegalName] = useState('');
    const [operatingName, setOperatingName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [incorporationDate, setIncorporationDate] = useState(new Date().toISOString().split('T')[0]);
    const [employeeCount, setEmployeeCount] = useState<number>(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setType(initialData.type || 'FIRM');
            setName(initialData.name || '');
            setBusinessNumber(initialData.business_number || '');
            setPayrollAccountNumber(initialData.payroll_account_number || '');
            setProvince(initialData.province || 'ON');
            setStreetAddress(initialData.street_address || '');
            setCity(initialData.city || '');
            setPostalCode(initialData.postal_code || '');
            setPhone(initialData.phone || '');
            setEmail(initialData.email || '');
            setWsibNumber(initialData.wsib_number || '');
            setEhtAccount(initialData.eht_account || '');
            setRemittanceFrequency(initialData.remittance_frequency || 'monthly');
            setTaxYearEnd(initialData.tax_year_end ? initialData.tax_year_end.split('T')[0] : new Date().toISOString().split('T')[0]);
            setLegalName(initialData.legal_name || '');
            setOperatingName(initialData.operating_name || '');
            setBusinessType(initialData.business_type || '');
            setIncorporationDate(initialData.incorporation_date ? initialData.incorporation_date.split('T')[0] : new Date().toISOString().split('T')[0]);
            setEmployeeCount(initialData.employee_count || 0);
        } else {
            setType('FIRM');
            setName('');
            setBusinessNumber('');
            setPayrollAccountNumber('');
            setProvince('ON');
            setStreetAddress('');
            setCity('');
            setPostalCode('');
            setPhone('');
            setEmail('');
            setWsibNumber('');
            setEhtAccount('');
            setRemittanceFrequency('monthly');
            setTaxYearEnd(new Date().toISOString().split('T')[0]);
            setLegalName('');
            setOperatingName('');
            setBusinessType('');
            setIncorporationDate(new Date().toISOString().split('T')[0]);
            setEmployeeCount(0);
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        setLoading(true);
        setError(null);

        const payload: ClientPayload = {
            type,
            name,
            business_number: businessNumber,
            payroll_account_number: payrollAccountNumber,
            province,
            street_address: streetAddress,
            city,
            postal_code: postalCode,
            phone,
            email,
            wsib_number: wsibNumber,
            eht_account: ehtAccount,
            remittance_frequency: remittanceFrequency,
            tax_year_end: taxYearEnd,
            legal_name: legalName,
            operating_name: operatingName,
            business_type: businessType,
            incorporation_date: incorporationDate,
            employee_count: employeeCount,
        };

        try {
            if (initialData && initialData.id) {
                await clientsAPI.updateClient(initialData.id, payload);
            } else {
                await clientsAPI.createClient(payload);
            }

            onComplete();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save entity';
            setError(message);
            console.error('Biz entity save error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Business Entity' : 'Add Business Entity'}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <Label htmlFor="type" className="w-36 text-sm">Type</Label>
                        <Input id="type" className="flex-1" value={type} onChange={(e) => setType(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="name" className="w-36 text-sm">Name *</Label>
                        <Input id="name" className="flex-1" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="businessNumber" className="w-36 text-sm">Business Number</Label>
                        <Input id="businessNumber" className="flex-1" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="payrollAccountNumber" className="w-36 text-sm">Payroll Account #</Label>
                        <Input id="payrollAccountNumber" className="flex-1" value={payrollAccountNumber} onChange={(e) => setPayrollAccountNumber(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="legalName" className="w-36 text-sm">Legal Name</Label>
                        <Input id="legalName" className="flex-1" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="operatingName" className="w-36 text-sm">Operating Name</Label>
                        <Input id="operatingName" className="flex-1" value={operatingName} onChange={(e) => setOperatingName(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="businessType" className="w-36 text-sm">Business Type</Label>
                        <Input id="businessType" className="flex-1" value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="incorporationDate" className="w-36 text-sm">Incorporation Date</Label>
                        <Input id="incorporationDate" className="flex-1" type="date" value={incorporationDate} onChange={(e) => setIncorporationDate(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="streetAddress" className="w-36 text-sm">Street Address</Label>
                        <Input id="streetAddress" className="flex-1" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="city" className="w-36 text-sm">City</Label>
                        <Input id="city" className="flex-1" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="province" className="w-36 text-sm">Province</Label>
                        <Input id="province" className="flex-1" value={province} onChange={(e) => setProvince(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="postalCode" className="w-36 text-sm">Postal Code</Label>
                        <Input id="postalCode" className="flex-1" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="employeeCount" className="w-36 text-sm">Employee Count</Label>
                        <Input id="employeeCount" className="flex-1" type="number" value={String(employeeCount)} onChange={(e) => setEmployeeCount(Number(e.target.value) || 0)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="phone" className="w-36 text-sm">Phone</Label>
                        <Input id="phone" className="flex-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="email" className="w-36 text-sm">Email</Label>
                        <Input id="email" className="flex-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="wsibNumber" className="w-36 text-sm">WSIB Number</Label>
                        <Input id="wsibNumber" className="flex-1" value={wsibNumber} onChange={(e) => setWsibNumber(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="ehtAccount" className="w-36 text-sm">EHT Account</Label>
                        <Input id="ehtAccount" className="flex-1" value={ehtAccount} onChange={(e) => setEhtAccount(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="remittanceFrequency" className="w-36 text-sm">Remittance Frequency</Label>
                        <Input id="remittanceFrequency" className="flex-1" value={remittanceFrequency} onChange={(e) => setRemittanceFrequency(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Label htmlFor="taxYearEnd" className="w-36 text-sm">Tax Year End</Label>
                        <Input id="taxYearEnd" className="flex-1" type="date" value={taxYearEnd} onChange={(e) => setTaxYearEnd(e.target.value)} />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BizEntityFormModal;
