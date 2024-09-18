import React from 'react';

interface KeyMistake {
  date: string;
  count: number;
}

interface HeatmapProps {
  keyMistakesData: KeyMistake[];
}

const Heatmap: React.FC<HeatmapProps> = ({ keyMistakesData }) => {
  
  const totalMistakes = keyMistakesData.reduce((total, mistake) => total + mistake.count, 0);

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const getColorForMistakes = (ratio: number): string => {
    const customColors = {
      green: '#00FF00',
      low:'#fff33b', 
      midLow:'#fdc70c',
      mid: '#f3903f',
      midHigh: '#ed683c',
      high: '#e93e3a',
    };
  
    if (ratio > 0.5) {
      return customColors.high;
    } else if (ratio > 0.4 && ratio <=0.5) {
      return customColors.midHigh;
    }
      else if(ratio >0.25 && ratio <=0.4){
      return customColors.mid;
      }
      else if (ratio <=0.25 && ratio >0.15){
        return customColors.midLow;
      }
      else if (ratio <=0.15 && ratio >0.05){
        return customColors.low;
      }
      else{
        return customColors.green;
      }
     
  };

  return (
    <div>
      <div className="keyboard">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((key, index) => {
              const lowerCaseKey = key.toLowerCase(); // Convert to lowercase
              const keyMistake = keyMistakesData.find((mistake) => mistake.date.toLowerCase() === lowerCaseKey);

             
              const ratio = keyMistake ? keyMistake.count / totalMistakes : 0;

            
              const color = getColorForMistakes(ratio);

              return (
                <div
                  key={index}
                  className="key"
                  style={{ backgroundColor: color }}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;