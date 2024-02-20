import React, { useState, useEffect } from 'react';

const FeeCalculator = ({ vehicleType, parkingSize, entryTime }) => {
  const [fee, setFee] = useState(0);

  useEffect(() => {
    const calculateFee = () => {
      // Implement fee calculation logic based on the given requirements
      const flatRate = 40;
      const exceedingRates = {
        0: 20, // Small parking (SP)
        1: 60, // Medium parking (MP)
        2: 100, // Large parking (LP)
      };

      const durationInHours = Math.ceil((new Date() - entryTime) / (1000 * 60 * 60)); // Round up to the nearest hour

      // Case: Vehicle returning within one hour
      if (durationInHours <= 1) {
        setFee(exceedingRates[parkingSize]);
        return;
      }

      // Calculate flat rate for the first 3 hours
      let totalFee = flatRate;

      // Calculate exceeding hourly rate beyond the initial 3 hours
      if (durationInHours > 3) {
        totalFee += exceedingRates[parkingSize] * (durationInHours - 3);
      }

      // Calculate fees for full 24-hour chunks
      totalFee += Math.floor(durationInHours / 24) * 5000;

      setFee(totalFee);
    };

    calculateFee();
  }, [vehicleType, parkingSize, entryTime]);

  return (
    <div>
      <h3>Fee Calculator</h3>
      <p>Vehicle Type: {vehicleType}</p>
      <p>Parking Size: {parkingSize}</p>
      <p>Fee: {fee} pesos</p>
    </div>
  );
};

export default FeeCalculator;
