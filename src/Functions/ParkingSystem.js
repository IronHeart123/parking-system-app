import React, { useState } from 'react';
import FeeCalculator from './FeeCalculator';

const ParkingSystem = () => {
  const [parkedVehicles, setParkedVehicles] = useState({});
  const [parkingSlots, setParkingSlots] = useState([
    { id: 1, distance: [1, 4, 5], size: 0, available: true },
    { id: 2, distance: [3, 2, 3], size: 2, available: true },
    { id: 3, distance: [5, 5, 1], size: 1, available: true },
    { id: 4, distance: [2, 3, 4], size: 0, available: true },
    { id: 5, distance: [1, 2, 3], size: 2, available: true },
    { id: 6, distance: [4, 3, 2], size: 1, available: true },
    { id: 7, distance: [5, 4, 3], size: 0, available: true },
  ]);
  const [fees, setFees] = useState(null);

  const parkVehicle = (vehicleType) => {
    const selectedSlot = findClosestAvailableSlot(vehicleType);
    if (selectedSlot) {
      setParkingSlots((prev) =>
        prev.map((slot) =>
          slot.id === selectedSlot.id ? { ...slot, available: false } : slot
        )
      );
      setParkedVehicles((prev) => ({
        ...prev,
        [vehicleType + selectedSlot.id]: { ...selectedSlot, entryTime: new Date() },
      }));
    } else {
      alert(`No available parking slots for ${vehicleType}. Please try again later.`);
    }
  };

  const unparkVehicle = (vehicleType) => {
    // Find the vehicle to unpark by its unique key (vehicleType + slot.id)
    const vehicleKey = Object.keys(parkedVehicles).find(key => key.startsWith(vehicleType));
    if (vehicleKey) {
      const vehicle = parkedVehicles[vehicleKey];
      const { id, entryTime, size } = vehicle;

      // Update states accordingly
      setParkedVehicles((prev) => {
        const updatedVehicles = { ...prev };
        delete updatedVehicles[vehicleKey];
        return updatedVehicles;
      });

      setFees(
        <FeeCalculator
          key={vehicleKey}
          vehicleType={vehicleType}
          parkingSize={size}
          entryTime={entryTime}
        />
      );

      setParkingSlots((prev) =>
        prev.map((slot) => (slot.id === id ? { ...slot, available: true } : slot))
      );
    } else {
      alert(`No vehicle of type ${vehicleType} is currently parked.`);
    }
  };

  const findClosestAvailableSlot = (vehicleType) => {
    const availableSlots = parkingSlots.filter(
      (slot) =>
        slot.available === true &&
        ((vehicleType === 'S' && slot.size === 0) ||
          (vehicleType === 'M' && slot.size === 1) ||
          (vehicleType === 'L' && slot.size === 2))
    );

    if (availableSlots.length === 0) {
      return null;
    }

    const sortedSlots = availableSlots.sort(
      (a, b) => Math.min(...a.distance) - Math.min(...b.distance)
    );

    return sortedSlots[0];
  };

  return (
    <div>
      <h1>Parking System</h1>
      <div>
        <button onClick={() => parkVehicle('S')}>Park Small Vehicle</button>
        <button onClick={() => parkVehicle('M')}>Park Medium Vehicle</button>
        <button onClick={() => parkVehicle('L')}>Park Large Vehicle</button>
      </div>
      <div>
        <button onClick={() => unparkVehicle('S')}>Unpark Small Vehicle</button>
        <button onClick={() => unparkVehicle('M')}>Unpark Medium Vehicle</button>
        <button onClick={() => unparkVehicle('L')}>Unpark Large Vehicle</button>
      </div>
      <div>
        <h2>Parking Slots:</h2>
        <ul>
          {parkingSlots.map((slot, index) => (
            <li key={index}>
              Size: {slot.size}, Distance: {slot.distance.join(', ')} -{' '}
              {slot.available ? 'Available' : 'Full'}
            </li>
          ))}
        </ul>
      </div>
      {fees}
    </div>
  );
};

export default ParkingSystem;