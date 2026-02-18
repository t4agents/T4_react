import React, { useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from 'src/components/ui/dialog';
import { Alert, AlertDescription } from 'src/components/ui/alert';
import { usePayroll } from 'src/context/payroll-context';
import { PayrollPeriod } from 'src/types/payroll';

interface PayrollPeriodManagerProps {
  onPeriodSelect?: (period: PayrollPeriod) => void;
}

export const PayrollPeriodManager: React.FC<PayrollPeriodManagerProps> = ({ onPeriodSelect }) => {
  const { periods, activePeriod, loading, error, createPeriod, setActivePeriod } = usePayroll();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    pay_date: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePeriod = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!formData.name || !formData.start_date || !formData.end_date) {
        setSubmitError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const newPeriod = await createPeriod({
        ...formData,
        status: 'draft',
      });

      setActivePeriod(newPeriod);
      onPeriodSelect?.(newPeriod);

      // Reset form
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        pay_date: '',
        description: '',
      });
      setIsDialogOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create payroll period');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPeriod = (period: PayrollPeriod) => {
    setActivePeriod(period);
    onPeriodSelect?.(period);
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Alert className="border-red-500 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Active Period Display */}
      {activePeriod && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-900">Active Payroll Period</p>
          <p className="text-lg font-semibold text-blue-900">{activePeriod.name}</p>
          <p className="text-sm text-blue-700">
            {activePeriod.start_date} to {activePeriod.end_date}
          </p>
          {activePeriod.pay_date && (
            <p className="text-sm text-blue-700">Pay Date: {activePeriod.pay_date}</p>
          )}
        </div>
      )}

      {/* Periods List */}
      <div>
        <h3 className="mb-2 font-semibold">Payroll Periods</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading payroll periods...</p>
        ) : periods.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payroll periods created yet</p>
        ) : (
          <div className="grid gap-2 max-h-64 overflow-y-auto">
            {periods.map(period => (
              <button
                key={period.id}
                onClick={() => handleSelectPeriod(period)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  activePeriod?.id === period.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium">{period.name}</p>
                <p className="text-sm text-gray-600">
                  {period.start_date} to {period.end_date}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  Status: {period.status || 'draft'}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Button */}
      <Button onClick={() => setIsDialogOpen(true)} className="w-full">
        Create New Payroll Period
      </Button>

      {/* Create Period Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Payroll Period</DialogTitle>
            <DialogDescription>
              Enter the details for a new payroll period
            </DialogDescription>
          </DialogHeader>

          {submitError && (
            <Alert className="border-red-500 bg-red-50">
              <AlertDescription className="text-red-800">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                Period Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Feb 15-28, 2026"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="end_date">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pay_date">Pay Date</Label>
              <Input
                id="pay_date"
                name="pay_date"
                type="date"
                value={formData.pay_date}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Add any notes about this payroll period"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePeriod}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Period'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollPeriodManager;
