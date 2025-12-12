'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dataAPI, SignalData } from '@/lib/api';
import { clearAuthTokens } from '@/lib/auth';
import SignalUpload from '@/components/SignalUpload';
import SignalVisualization from '@/components/SignalVisualization';

export default function DashboardPage() {
  const router = useRouter();
  const [signalDataList, setSignalDataList] = useState<SignalData[]>([]);
  const [selectedData, setSelectedData] = useState<SignalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dataAPI.list();
      setSignalDataList(data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const newData = await dataAPI.upload(file);
      setSignalDataList([newData, ...signalDataList]);
      setSelectedData(newData);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (dataId: string) => {
    try {
      setProcessing(dataId);
      await dataAPI.process(dataId);
      const result = await dataAPI.getResult(dataId);
      setSignalDataList(signalDataList.map(d => d.id === dataId ? result : d));
      setSelectedData(result);
    } catch (err) {
      console.error('Processing failed:', err);
      alert('Processing failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleLogout = () => {
    clearAuthTokens();
    router.push('/login');
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hero Lab Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Upload Signal Data</h2>
        <SignalUpload onUpload={handleUpload} loading={loading} />
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Signal Data Files</h2>
        {loading && signalDataList.length === 0 ? (
          <div className="loading">Loading...</div>
        ) : signalDataList.length === 0 ? (
          <p className="text-gray-600">No data files uploaded yet.</p>
        ) : (
          <div className="grid gap-4">
            {signalDataList.map((data) => (
              <div
                key={data.id}
                className={`p-4 border border-gray-300 rounded cursor-pointer transition-colors ${
                  selectedData?.id === data.id ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedData(data)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-lg">{data.file_name}</strong>
                    <p className="text-sm text-gray-600 mt-2">
                      Uploaded: {new Date(data.uploaded_at).toLocaleString()}
                      {data.processed_at && (
                        <> | Processed: {new Date(data.processed_at).toLocaleString()}</>
                      )}
                    </p>
                  </div>
                  <div>
                    {!data.processed_data ? (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProcess(data.id);
                        }}
                        disabled={processing === data.id}
                      >
                        {processing === data.id ? 'Processing...' : 'Process'}
                      </button>
                    ) : (
                      <span className="text-green-600 font-medium">✓ Processed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedData && selectedData.processed_data && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Visualization & Results</h2>
          <SignalVisualization data={selectedData} />
        </div>
      )}
    </div>
  );
}
