import { useState } from "react";
import { useFarmerSupportContent } from "../../context/FarmerSupportContentContext.jsx";

function AdminFarmerSupport() {
  const {
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
  } = useFarmerSupportContent();

  const [trainingForm, setTrainingForm] = useState({ title: "", text: "" });
  const [benefitForm, setBenefitForm] = useState({ title: "", text: "" });
  const [serviceForm, setServiceForm] = useState({ title: "", text: "" });
  const [editingTrainingIndex, setEditingTrainingIndex] = useState(null);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState(null);
  const [editingServiceIndex, setEditingServiceIndex] = useState(null);

  const submitTraining = (event) => {
    event.preventDefault();
    if (!trainingForm.title.trim() || !trainingForm.text.trim()) return;

    if (editingTrainingIndex !== null) {
      updateTrainingProgram(editingTrainingIndex, trainingForm);
      setEditingTrainingIndex(null);
    } else {
      addTrainingProgram({ title: trainingForm.title.trim(), text: trainingForm.text.trim() });
    }

    setTrainingForm({ title: "", text: "" });
  };

  const submitBenefit = (event) => {
    event.preventDefault();
    if (!benefitForm.title.trim() || !benefitForm.text.trim()) return;

    if (editingBenefitIndex !== null) {
      updateProgramBenefit(editingBenefitIndex, benefitForm);
      setEditingBenefitIndex(null);
    } else {
      addProgramBenefit([benefitForm.title.trim(), benefitForm.text.trim()]);
    }

    setBenefitForm({ title: "", text: "" });
  };

  const submitService = (event) => {
    event.preventDefault();
    if (!serviceForm.title.trim() || !serviceForm.text.trim()) return;

    if (editingServiceIndex !== null) {
      updateVetService(editingServiceIndex, serviceForm);
      setEditingServiceIndex(null);
    } else {
      addVetService({ title: serviceForm.title.trim(), text: serviceForm.text.trim() });
    }

    setServiceForm({ title: "", text: "" });
  };

  const startTrainingEdit = (item, index) => {
    setEditingTrainingIndex(index);
    setTrainingForm({ title: item.title, text: item.text });
  };

  const startBenefitEdit = (item, index) => {
    setEditingBenefitIndex(index);
    setBenefitForm({ title: item[0], text: item[1] });
  };

  const startServiceEdit = (item, index) => {
    setEditingServiceIndex(index);
    setServiceForm({ title: item.title, text: item.text });
  };

  return (
    <div className="dash-stack">
      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Training Programs</h2>
        </div>

        <form className="dash-form-grid" onSubmit={submitTraining}>
          <label>
            <span>Title</span>
            <input
              value={trainingForm.title}
              onChange={(event) => setTrainingForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Program title"
            />
          </label>
          <label>
            <span>Description</span>
            <textarea
              value={trainingForm.text}
              onChange={(event) => setTrainingForm((prev) => ({ ...prev, text: event.target.value }))}
              placeholder="Program description"
              rows="3"
            />
          </label>
          <button className="dash-btn-small" type="submit">
            {editingTrainingIndex !== null ? "Update Program" : "Add Program"}
          </button>
        </form>

        <div className="dash-info-grid dash-admin-list">
          {trainingPrograms.map((program, index) => (
            <article key={`${program.title}-${index}`} className="dash-info-card">
              <h3>{program.title}</h3>
              <p>{program.text}</p>
              <div className="dash-actions">
                <button className="dash-btn-small" type="button" onClick={() => startTrainingEdit(program, index)}>
                  Edit
                </button>
                <button className="dash-btn-small dash-btn-danger" type="button" onClick={() => removeTrainingProgram(index)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Program Benefits</h2>
        </div>

        <form className="dash-form-grid" onSubmit={submitBenefit}>
          <label>
            <span>Benefit Title</span>
            <input
              value={benefitForm.title}
              onChange={(event) => setBenefitForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Benefit title"
            />
          </label>
          <label>
            <span>Benefit Description</span>
            <textarea
              value={benefitForm.text}
              onChange={(event) => setBenefitForm((prev) => ({ ...prev, text: event.target.value }))}
              placeholder="Benefit description"
              rows="3"
            />
          </label>
          <button className="dash-btn-small" type="submit">
            {editingBenefitIndex !== null ? "Update Benefit" : "Add Benefit"}
          </button>
        </form>

        <div className="dash-info-grid dash-admin-list">
          {programBenefits.map(([title, text], index) => (
            <article key={`${title}-${index}`} className="dash-info-card">
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="dash-actions">
                <button className="dash-btn-small" type="button" onClick={() => startBenefitEdit([title, text], index)}>
                  Edit
                </button>
                <button className="dash-btn-small dash-btn-danger" type="button" onClick={() => removeProgramBenefit(index)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Veterinary Support Services</h2>
        </div>

        <form className="dash-form-grid" onSubmit={submitService}>
          <label>
            <span>Service Name</span>
            <input
              value={serviceForm.title}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Service title"
            />
          </label>
          <label>
            <span>Description</span>
            <textarea
              value={serviceForm.text}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, text: event.target.value }))}
              placeholder="Service description"
              rows="3"
            />
          </label>
          <button className="dash-btn-small" type="submit">
            {editingServiceIndex !== null ? "Update Service" : "Add Service"}
          </button>
        </form>

        <div className="dash-info-grid dash-admin-list">
          {vetServices.map((service, index) => (
            <article key={`${service.title}-${index}`} className="dash-info-card">
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className="dash-actions">
                <button className="dash-btn-small" type="button" onClick={() => startServiceEdit(service, index)}>
                  Edit
                </button>
                <button className="dash-btn-small dash-btn-danger" type="button" onClick={() => removeVetService(index)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminFarmerSupport;
