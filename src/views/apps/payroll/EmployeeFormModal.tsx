import { useState } from 'react';
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
import { employeeAPI } from 'src/api/employee';
import { Employee } from 'src/types/employee';

interface EmployeeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const EmployeeFormModal = ({ isOpen, onClose, onComplete }: EmployeeFormModalProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sin, setSin] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!firstName.trim() || !lastName.trim() || !sin.trim()) {
            setError('First Name, Last Name, and SIN are required');
            return;
        }

        if (sin.length !== 9) {
            setError('SIN must be exactly 9 characters');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newEmployee = {
                first_name: firstName,
                last_name: lastName,
                sin: sin,
                email: email || undefined,
                address: address || undefined,
            };

            await employeeAPI.createEmployee(newEmployee as Partial<Employee>);
            
            // Reset form
            setFirstName('');
            setLastName('');
            setSin('');
            setEmail('');
            setAddress('');
            
            onComplete();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create employee';
            setError(errorMessage);
            console.error('Error creating employee:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                            id="firstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                            id="lastName"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sin">SIN (Social Insurance Number) *</Label>
                        <Input
                            id="sin"
                            placeholder="9 digits (e.g., 123456789)"
                            value={sin}
                            onChange={(e) => setSin(e.target.value.replace(/\D/g, '').slice(0, 9))}
                            maxLength={9}
                        />
                        {sin && sin.length !== 9 && (
                            <p className="text-xs text-yellow-600">SIN must be exactly 9 characters</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 lg:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Employee'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeFormModal;
