import React, { useState } from 'react';
import { apiClient } from '@/app/api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface PsoParams {
  dimensions: number;
  num_particles: number;
  max_iterations: number;
}

interface PsoInput {
  params: PsoParams;
  data: number[];
}

interface StatusUpdate {
  iteration: number;
  best_fitness: number;
}

interface FinalResult {
  best_position: number[];
  best_fitness: number;
}

export default function PsoComponent() {
  const [params, setParams] = useState<PsoParams>({
    dimensions: 5,
    num_particles: 30,
    max_iterations: 100
  });
  
  const [dataInput, setDataInput] = useState<string>('1.0, 2.0, 3.0, 4.0, 5.0');
  const [status, setStatus] = useState<{ iteration: number; fitness: number }[]>([]);
  const [result, setResult] = useState<{ position: number[]; fitness: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDataInput(e.target.value);
  };

  const parseData = (input: string): number[] => {
    return input.split(',').map(str => parseFloat(str.trim())).filter(num => !isNaN(num));
  };

  const handleStartPso = () => {
    setError(null);
    const data = parseData(dataInput);
    
    if (data.length !== params.dimensions) {
      setError(`Data length (${data.length}) does not match dimensions (${params.dimensions})`);
      return;
    }

    setIsRunning(true);
    setStatus([]);
    setResult(null);

    const input: PsoInput = {
      params,
      data
    };

    apiClient.runPso(
      input,
      (statusUpdate: StatusUpdate) => {
        setStatus(prev => [...prev, { iteration: statusUpdate.iteration, fitness: statusUpdate.best_fitness }]);
      },
      (finalResult: FinalResult) => {
        setResult({ position: finalResult.best_position, fitness: finalResult.best_fitness });
        setIsRunning(false);
      },
      () => {
        setError("Error occurred during PSO execution");
        setIsRunning(false);
      }
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-black  ">
      <h1 className="text-2xl font-bold mb-4">PSO Algorithm Configuration</h1>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Parameters</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Dimensions</label>
            <input
              type="number"
              name="dimensions"
              value={params.dimensions}
              onChange={handleParamChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Particles</label>
            <input
              type="number"
              name="num_particles"
              value={params.num_particles}
              onChange={handleParamChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Iterations</label>
            <input
              type="number"
              name="max_iterations"
              value={params.max_iterations}
              onChange={handleParamChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Data</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Input Data (comma-separated numbers)
            </label>
            <textarea
              value={dataInput}
              onChange={handleDataChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter numbers separated by commas"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button 
        onClick={handleStartPso}
        disabled={isRunning}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
      >
        {isRunning ? 'Running PSO...' : 'Start PSO'}
      </button>

      {status.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Progress</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <LineChart width={600} height={300} data={status}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="iteration" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="fitness" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Final Result</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <p><strong>Best Position:</strong> {result.position.map(p => p.toFixed(4)).join(', ')}</p>
            <p><strong>Best Fitness:</strong> {result.fitness.toFixed(4)}</p>
          </div>
        </div>
      )}
    </div>
  );
}