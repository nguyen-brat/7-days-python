import React, { useState, useEffect } from 'react';
import type { EmailTemplate, EmailTemplateFormData } from '../types';
import { emailTemplatesApi } from '../lib/api';
import { Button, Input, Card } from '../components/ui';
import { Send } from 'lucide-react';

export const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [form, setForm] = useState<EmailTemplateFormData>({
    name: '',
    subject: '',
    body_html: '',
  });
  const [preview, setPreview] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testVariables, setTestVariables] = useState('{"username": "John Doe"}');
  const [sendStatus, setSendStatus] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const data = await emailTemplatesApi.getAll();
    setTemplates(data);
  };

  const handleCreate = async () => {
    await emailTemplatesApi.create(form);
    fetchTemplates();
    setForm({ name: '', subject: '', body_html: '' });
    setPreview('');
  };

  const handleTestSend = async () => {
    if (!selectedTemplate || !testEmail) return;

    try {
      setSendStatus('Sending...');
      const variables = JSON.parse(testVariables);
      const result = await emailTemplatesApi.testSend(
        selectedTemplate.id,
        testEmail,
        variables
      );
      setSendStatus(result.status === 'success' ? '✅ ' + result.message : '❌ ' + result.message);
      setTimeout(() => {
        setShowTestModal(false);
        setSendStatus('');
      }, 2000);
    } catch (err: any) {
      setSendStatus('❌ Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card title="Create Template">
          <div className="space-y-3">
            <Input
              placeholder="Template Name (e.g., welcome_email)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              placeholder="HTML Body (Supports Jinja2 {{variable}})"
              className="w-full p-2 border border-gray-300 rounded-md h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={form.body_html}
              onChange={(e) => {
                setForm({ ...form, body_html: e.target.value });
                setPreview(e.target.value);
              }}
            />
            <Button onClick={handleCreate} variant="success" className="w-full">
              Save Template
            </Button>
          </div>
        </Card>

        <Card title="Existing Templates">
          <ul className="space-y-2">
            {templates.map((t) => (
              <li key={t.id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.subject}</div>
                </div>
                <Button
                  variant="secondary"
                  className="px-3 py-1 text-sm"
                  onClick={() => {
                    setSelectedTemplate(t);
                    setShowTestModal(true);
                  }}
                >
                  <Send className="w-3 h-3 mr-1" /> Test Send
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Live Preview" className="h-full flex flex-col">
        <div className="flex-grow border-2 border-dashed border-gray-300 rounded p-4 bg-gray-50">
          <iframe
            srcDoc={preview}
            title="Preview"
            className="w-full h-full bg-white border"
          />
        </div>
      </Card>

      {/* Test Send Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-full">
            <h2 className="text-xl font-bold mb-4">Test Send Email</h2>
            {sendStatus && (
              <div className={`p-2 mb-4 rounded ${sendStatus.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {sendStatus}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Template:</label>
                <div className="text-sm bg-gray-100 p-2 rounded">{selectedTemplate?.name}</div>
              </div>
              <Input
                label="Recipient Email"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Variables (JSON):</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md h-20 font-mono text-sm"
                  value={testVariables}
                  onChange={(e) => setTestVariables(e.target.value)}
                  placeholder='{"username": "John", "email": "john@example.com"}'
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleTestSend} variant="success" className="flex-1">
                  <Send className="w-4 h-4 mr-1" /> Send Test
                </Button>
                <Button
                  onClick={() => {
                    setShowTestModal(false);
                    setSendStatus('');
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
