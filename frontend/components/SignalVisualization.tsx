'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SignalData } from '@/lib/api';

interface SignalVisualizationProps {
  data: SignalData;
}

export default function SignalVisualization({ data }: SignalVisualizationProps) {
  const chartData = useMemo(() => {
    if (!data.processed_data) return [];

    const { time, channel1, channel2, channel3 } = data.processed_data;
    
    // Sample data for performance (show every Nth point)
    const sampleRate = Math.max(1, Math.floor(time.length / 2000));
    
    return time
      .map((t, i) => ({
        time: t,
        channel1: channel1[i],
        channel2: channel2[i],
        channel3: channel3[i],
      }))
      .filter((_, i) => i % sampleRate === 0);
  }, [data.processed_data]);

  const metrics = data.metrics;

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Waveforms</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Amplitude (V)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="channel1" 
              stroke="#8884d8" 
              name="Channel 1"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="channel2" 
              stroke="#82ca9d" 
              name="Channel 2"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="channel3" 
              stroke="#ffc658" 
              name="Channel 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {metrics && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['channel1', 'channel2', 'channel3'].map((channelKey) => {
              const channelMetrics = metrics[channelKey];
              if (!channelMetrics) return null;

              return (
                <div key={channelKey} className="p-4 border border-gray-300 rounded">
                  <h4 className="font-semibold text-lg mb-2">{channelKey.toUpperCase()}</h4>
                  <div className="mt-2">
                    <p><strong>Statistics:</strong></p>
                    <ul className="ml-6 mt-2 list-disc">
                      <li>Mean: {channelMetrics.statistics?.mean?.toFixed(4)} V</li>
                      <li>Std: {channelMetrics.statistics?.std?.toFixed(4)} V</li>
                      <li>Min: {channelMetrics.statistics?.min?.toFixed(4)} V</li>
                      <li>Max: {channelMetrics.statistics?.max?.toFixed(4)} V</li>
                      <li>Range: {channelMetrics.statistics?.range?.toFixed(4)} V</li>
                    </ul>
                    <p className="mt-2">
                      <strong>Baseline:</strong> {channelMetrics.baseline?.toFixed(4)} V
                    </p>
                    <p>
                      <strong>Peaks:</strong> {channelMetrics.peaks?.count || 0}
                    </p>
                    {channelMetrics.heart_rate && (
                      <p>
                        <strong>Heart Rate:</strong> {channelMetrics.heart_rate.toFixed(2)} bpm
                      </p>
                    )}
                    <p>
                      <strong>SNR:</strong> {channelMetrics.snr?.toFixed(2)} dB
                    </p>
                    {channelMetrics.frequency && (
                      <p>
                        <strong>Dominant Frequency:</strong> {channelMetrics.frequency.dominant_frequency?.toFixed(2)} Hz
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {metrics.overall && (
            <div className="mt-4 p-4 border border-gray-300 rounded">
              <h4 className="font-semibold text-lg mb-2">Overall Metrics</h4>
              <ul className="ml-6 mt-2 list-disc">
                <li>Total Samples: {metrics.overall.total_samples}</li>
                <li>Duration: {metrics.overall.duration?.toFixed(2)} s</li>
                <li>Mean Amplitude: {metrics.overall.mean_amplitude?.toFixed(4)} V</li>
                <li>Std Amplitude: {metrics.overall.std_amplitude?.toFixed(4)} V</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
