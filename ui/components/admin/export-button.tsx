'use client';

import { useState } from 'react';
import { Button } from '@/ui/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportToCSV, exportToJSON } from '@/lib/export-data';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: any[];
  filename: string;
  label?: string;
}

export function ExportButton({ data, filename, label = 'Export' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);

    try {
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      if (format === 'csv') {
        exportToCSV(data, filename);
        toast.success(`Exported ${data.length} items to CSV`);
      } else {
        exportToJSON(data, filename);
        toast.success(`Exported ${data.length} items to JSON`);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={isExporting || !data || data.length === 0}
        className="gap-2"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('json')}
        disabled={isExporting || !data || data.length === 0}
        className="gap-2"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        JSON
      </Button>
    </div>
  );
}
