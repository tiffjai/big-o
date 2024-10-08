import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { complexityData } from '../data/complexityData';

interface ComplexityChartProps {
  data: Array<{ n: number } & Record<string, number>>;
}

export const ComplexityChart: React.FC<ComplexityChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="n" label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Time', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        {complexityData.map((complexity) => (
          <Line
            key={complexity.name}
            type="monotone"
            dataKey={complexity.name}
            stroke={complexity.color}
            name={complexity.title}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};