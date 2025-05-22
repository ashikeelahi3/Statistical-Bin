"use client"
import React, { useState } from 'react';
import DistributionForm from "@/components/distribution/Form";
import Visualization from '@/components/distribution/Visualization';

export default function Home() {
  const [formData, setFormData] = useState<{ mu: number; sigma: number; x: number } | null>(null);

  const handleFormSubmit = (data: { mu: number; sigma: number; x: number }) => {
    setFormData(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <DistributionForm onSubmit={handleFormSubmit} />
      {formData && <Visualization {...formData} />}
    </div>
  );
}
