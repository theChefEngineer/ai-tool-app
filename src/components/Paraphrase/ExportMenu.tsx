import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileIcon, Download } from 'lucide-react';
import { exportToWord, exportToPdf } from '../../lib/documentExporter';
import toast from 'react-hot-toast';

interface ExportMenuProps {
  onClose: () => void;
  text: string;
  title: string;
  originalText?: string;
}

export default function ExportMenu({ onClose, text, title, originalText }: ExportMenuProps) {
  const handleExportToWord = async () => {
    try {
      await exportToWord(text, title, originalText);
      toast.success('Exported to Word document successfully');
      onClose();
    } catch (error) {
      console.error('Error exporting to Word:', error);
      toast.error('Failed to export to Word document');
    }
  };

  const handleExportToPdf = async () => {
    try {
      await exportToPdf(text, title, originalText);
      toast.success('Exported to PDF successfully');
      onClose();
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export to PDF');
    }
  };

  const handleExportToText = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Exported as text file successfully');
      onClose();
    } catch (error) {
      console.error('Error exporting as text:', error);
      toast.error('Failed to export as text file');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-full mt-2 z-10 w-48 glass-card rounded-xl shadow-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2">
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          className="w-full flex items-center space-x-2 p-2 rounded-lg text-left text-sm"
          onClick={handleExportToWord}
        >
          <FileText className="w-4 h-4 text-blue-500" />
          <span>Export to Word</span>
        </motion.button>
        
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          className="w-full flex items-center space-x-2 p-2 rounded-lg text-left text-sm"
          onClick={handleExportToPdf}
        >
          <FileIcon className="w-4 h-4 text-red-500" />
          <span>Export to PDF</span>
        </motion.button>
        
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          className="w-full flex items-center space-x-2 p-2 rounded-lg text-left text-sm"
          onClick={handleExportToText}
        >
          <Download className="w-4 h-4 text-green-500" />
          <span>Export as Text</span>
        </motion.button>
      </div>
    </motion.div>
  );
}