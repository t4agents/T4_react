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
    const [name, setName] = useState('');
    const [businessNumber, setBusinessNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('ON');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setBusinessNumber(initialData.business_number || '');
            setPhone(initialData.phone || '');
            setEmail(initialData.email || '');
            setCity(initialData.city || '');
            setProvince(initialData.province || 'ON');
        } else {
            setName('');
            setBusinessNumber('');
            setPhone('');
            setEmail('');
            setCity('');
            setProvince('ON');
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
            type: 'FIRM',
            name,
            business_number: businessNumber,
            payroll_account_number: '',
            province,
            street_address: '',
            city,
            postal_code: '',
            phone,
            email,
            wsib_number: '',
            eht_account: '',
            remittance_frequency: 'monthly',
            tax_year_end: new Date().toISOString().split('T')[0],
            legal_name: '',
            operating_name: '',
            business_type: '',
            incorporation_date: new Date().toISOString().split('T')[0],
            employee_count: 0,
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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Business Entity' : 'Add Business Entity'}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="businessNumber">Business Number</Label>
                        <Input id="businessNumber" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="province">Province</Label>
                        <Input id="province" value={province} onChange={(e) => setProvince(e.target.value)} />
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
