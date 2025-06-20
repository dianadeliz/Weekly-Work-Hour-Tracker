import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './App.css';

const weeks = [1, 2];
const daysPerWeek = 7;

function formatTotal(hours, minutes) {
  const totalHours = hours + Math.floor(minutes / 60);
  const totalMinutes = minutes % 60;
  return `${totalHours}h, ${totalMinutes.toString().padStart(2, '0')}min`;
}

const App = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [inputs, setInputs] = useState(
    weeks.map(() => 
      Array.from({ length: daysPerWeek }, () => ({ hours: '', minutes: '' }))
    )
  );

  const handleChange = (weekIndex, dayIndex, field, value) => {
    if (/^\d*$/.test(value)) {
      setInputs(prev => {
        const updated = [...prev];
        updated[weekIndex][dayIndex][field] = value;
        return updated;
      });
    }
  };

  const handleShowModal = () => setShowConfirmModal(true);
  const handleCloseModal = () => setShowConfirmModal(false);

  const handleResetInputs = () => {
    setInputs(
      weeks.map(() =>
        Array.from({ length: daysPerWeek }, () => ({ hours: '', minutes: '' }))
      )
    );
    handleCloseModal();
  };

  const calculateWeekTotal = (weekIndex) => {
    return inputs[weekIndex].reduce(
      (acc, cur) => {
        const h = parseInt(cur.hours) || 0;
        const m = parseInt(cur.minutes) || 0;
        return { hours: acc.hours + h, minutes: acc.minutes + m };
      },
      { hours: 0, minutes: 0 }
    );
  };

  const grandTotal = inputs.reduce(
    (acc, week) => {
      const weekTotal = week.reduce(
        (weekAcc, cur) => {
          const h = parseInt(cur.hours) || 0;
          const m = parseInt(cur.minutes) || 0;
          return { hours: weekAcc.hours + h, minutes: weekAcc.minutes + m };
        },
        { hours: 0, minutes: 0 }
      );
      return { hours: acc.hours + weekTotal.hours, minutes: acc.minutes + weekTotal.minutes };
    },
    { hours: 0, minutes: 0 }
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Weekly Work Hour Tracker</h2>
      
      {weeks.map((week, weekIndex) => (
        <div key={week} className="mb-5">
          <h3 className="mb-3 text-center">Week {week}</h3>
          <div className="row g-3 justify-content-center">
            {Array.from({ length: daysPerWeek }, (_, dayIndex) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg" key={dayIndex}>
                <div className="card mb-3 shadow-sm">
                  <div className="card-body p-2">
                    <h6 className="card-title text-center mb-2">Day {dayIndex + 1}</h6>
                    <div className="row g-1 align-items-center">
                      <div className="col-6">
                        <label className="form-label small mb-1 d-block text-center">Hr</label>
                        <input
                          type="text"
                          className="form-control form-control-sm text-center"
                          placeholder="0"
                          value={inputs[weekIndex][dayIndex].hours}
                          onChange={e => handleChange(weekIndex, dayIndex, 'hours', e.target.value)}
                          maxLength={2}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small mb-1 d-block text-center">Min</label>
                        <input
                          type="text"
                          className="form-control form-control-sm text-center"
                          placeholder="00"
                          value={inputs[weekIndex][dayIndex].minutes}
                          onChange={e => handleChange(weekIndex, dayIndex, 'minutes', e.target.value)}
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <h5>
              Week {week} Total:{' '}
              <span className="badge bg-light text-dark">
                {formatTotal(
                  calculateWeekTotal(weekIndex).hours,
                  calculateWeekTotal(weekIndex).minutes
                )}
              </span>
            </h5>
          </div>
        </div>
      ))}
      
      <div className="text-center mt-4 pt-4 border-top">
        <h4>
          Grand Total:{' '}
          <span className="badge bg-primary">
            {formatTotal(grandTotal.hours, grandTotal.minutes)}
          </span>
        </h4>
      </div>

      <div className="text-center mt-4">
        <Button variant="danger" onClick={handleShowModal}>
          Reset All
        </Button>
      </div>

      <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to clear all inputs? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleResetInputs}>
            Confirm Reset
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App; 