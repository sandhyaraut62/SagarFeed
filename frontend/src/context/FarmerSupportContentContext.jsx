import { createContext, useContext, useEffect, useMemo, useState } from "react";

const defaultTrainingPrograms = [
  {
    title: "Every 15 Days",
    text: "Orientation programs are conducted regularly across different regions to ensure continuous learning and support.",
  },
  {
    title: "Expert-Led Sessions",
    text: "All programs are led by experienced veterinarians and technical experts with deep industry knowledge.",
  },
  {
    title: "Practical Knowledge",
    text: "Focus on modern livestock management practices that can be immediately applied on farms.",
  },
];

const defaultProgramBenefits = [
  ["Improved Productivity", "Learn techniques to maximize livestock output and farm efficiency."],
  ["Risk Reduction", "Understand how to minimize operational and health risks in livestock farming."],
  ["Modern Practices", "Adopt scientifically proven methods for sustainable farming."],
];

const defaultVetServices = [
  {
    title: "Field Visits",
    text: "Our veterinary team conducts scheduled farm visits to monitor livestock health and catch issues early.",
  },
  {
    title: "Disease Prevention",
    text: "Guidance on vaccination schedules, biosecurity, and hygiene practices to keep your animals healthy.",
  },
  {
    title: "Emergency Consultation",
    text: "Reach out to our support team for urgent livestock health concerns and get guidance on next steps.",
  },
];

const FarmerSupportContentContext = createContext(null);

function getStoredValue(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function FarmerSupportContentProvider({ children }) {
  const [trainingPrograms, setTrainingPrograms] = useState(() =>
    getStoredValue("farmer-support-training-programs", defaultTrainingPrograms)
  );
  const [programBenefits, setProgramBenefits] = useState(() =>
    getStoredValue("farmer-support-program-benefits", defaultProgramBenefits)
  );
  const [vetServices, setVetServices] = useState(() =>
    getStoredValue("farmer-support-vet-services", defaultVetServices)
  );

  useEffect(() => {
    window.localStorage.setItem("farmer-support-training-programs", JSON.stringify(trainingPrograms));
  }, [trainingPrograms]);

  useEffect(() => {
    window.localStorage.setItem("farmer-support-program-benefits", JSON.stringify(programBenefits));
  }, [programBenefits]);

  useEffect(() => {
    window.localStorage.setItem("farmer-support-vet-services", JSON.stringify(vetServices));
  }, [vetServices]);

  const addTrainingProgram = (program) => {
    setTrainingPrograms((prev) => [...prev, program]);
  };

  const updateTrainingProgram = (index, updates) => {
    setTrainingPrograms((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...updates } : item)));
  };

  const removeTrainingProgram = (index) => {
    setTrainingPrograms((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const addProgramBenefit = (benefit) => {
    setProgramBenefits((prev) => [...prev, benefit]);
  };

  const updateProgramBenefit = (index, updates) => {
    setProgramBenefits((prev) => prev.map((item, itemIndex) => (itemIndex === index ? [updates.title, updates.text] : item)));
  };

  const removeProgramBenefit = (index) => {
    setProgramBenefits((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const addVetService = (service) => {
    setVetServices((prev) => [...prev, service]);
  };

  const updateVetService = (index, updates) => {
    setVetServices((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...updates } : item)));
  };

  const removeVetService = (index) => {
    setVetServices((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const value = useMemo(
    () => ({
      trainingPrograms,
      programBenefits,
      vetServices,
      addTrainingProgram,
      updateTrainingProgram,
      removeTrainingProgram,
      addProgramBenefit,
      updateProgramBenefit,
      removeProgramBenefit,
      addVetService,
      updateVetService,
      removeVetService,
    }),
    [trainingPrograms, programBenefits, vetServices]
  );

  return <FarmerSupportContentContext.Provider value={value}>{children}</FarmerSupportContentContext.Provider>;
}

export function useFarmerSupportContent() {
  const context = useContext(FarmerSupportContentContext);

  if (!context) {
    throw new Error("useFarmerSupportContent must be used within FarmerSupportContentProvider");
  }

  return context;
}
