import React, { useState } from 'react';
import { CountryCode } from './types';
import { DEFAULT_PLATE_BY_COUNTRY } from './core/country-registry';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PlateChecker } from './components/checker/PlateChecker';
import { DistrictDirectory } from './components/districts/DistrictDirectory';
import { PlateStudio } from './components/studio/PlateStudio';
import { PlateQuiz } from './components/quiz/PlateQuiz';
import { KnowledgeHub } from './components/knowledge/KnowledgeHub';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checker' | 'directory' | 'studio' | 'quiz' | 'knowledge'>('checker');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('DE');
  const [prefilledPlate, setPrefilledPlate] = useState<string>('B MW 1234 E');

  const handleCountryChange = (country: CountryCode) => {
    setSelectedCountry(country);
    const newPlate = DEFAULT_PLATE_BY_COUNTRY[country] || 'B MW 1234 E';
    setPrefilledPlate(newPlate);
  };

  const handleInspectFromDirectory = (plateText: string) => {
    setPrefilledPlate(plateText);
    setActiveTab('checker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchCountry = (country: CountryCode, query: string) => {
    setSelectedCountry(country);
    setPrefilledPlate(query);
    setActiveTab('checker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCountry={selectedCountry}
        setSelectedCountry={handleCountryChange}
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'checker' && (
          <PlateChecker
            key={`${selectedCountry}-${prefilledPlate}`}
            country={selectedCountry}
            initialValue={prefilledPlate}
            onSelectDistrict={(code) => handleInspectFromDirectory(`${code} AB 123`)}
            onSwitchCountry={handleSwitchCountry}
          />
        )}

        {activeTab === 'directory' && (
          <DistrictDirectory
            key={selectedCountry}
            country={selectedCountry}
            onInspectPlate={handleInspectFromDirectory}
            onSwitchCountry={handleCountryChange}
          />
        )}

        {activeTab === 'studio' && (
          <PlateStudio
            key={selectedCountry}
            country={selectedCountry}
            onCountryChange={handleCountryChange}
          />
        )}

        {activeTab === 'quiz' && (
          <PlateQuiz
            key={selectedCountry}
            country={selectedCountry}
            onCountryChange={handleCountryChange}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeHub
            key={selectedCountry}
            country={selectedCountry}
            onCountryChange={handleCountryChange}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
