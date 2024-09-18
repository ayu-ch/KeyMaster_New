import { getDatabase, ref, push, onValue } from 'firebase/database';
import app from '@/firebase';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { useEffect,useState } from 'react';
import { Button } from 'react-bootstrap';
import Navbar from './Navbar';
import { useUserAuth} from "../context/UserAuthContext";
import { Navigate,useNavigate } from 'react-router-dom';
import Heatmap from './Heatmap';
Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip);
import { DataSnapshot,get } from 'firebase/database';



interface FirebaseData {
  [key: string]: {
    date: string; 
    wpm: number;
  }; 
}

interface HeatmapData {
  date: string;
  count: number; // Specify that the count property is of type number
}


export default function Profile() {
  const [keyMistakesData, setKeyMistakesData] = useState<HeatmapData[]>([]);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'WPM Over Time',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  });

  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const database = getDatabase(app);
    const userRef = ref(database, `users/${user?.uid}/tests`);

    onValue(userRef, (snapshot) => {
      const data: FirebaseData | null = snapshot.val();
      if (!data) {
        console.error('No data available');
        return;
      }

      const dates = Object.values(data).map((entry) => entry.date);
      const wpms = Object.values(data).map((entry) => entry.wpm);

      const newChartData = {
        labels: dates,
        datasets: [
          {
            label: 'WPM Over Time',
            data: wpms,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      };
      setChartData(newChartData);
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    const keyMistakesRef = ref(database, `users/${user?.uid}/keyMistakes`);
  get(keyMistakesRef).then((snapshot: DataSnapshot) => {
    const keyMistakesData: HeatmapData[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot: DataSnapshot) => {
        const date = (childSnapshot.key as string).toLowerCase(); // Convert to lowercase
        const count = childSnapshot.val() as number;
        keyMistakesData.push({ date, count });
      });
    }
    console.log('Key Mistakes Data:', keyMistakesData); // Log key mistakes data for debugging
    setKeyMistakesData(keyMistakesData);
  }).catch((error) => {
    console.error('Error fetching key mistakes data:', error);
  });

}, [user]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'WPM',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          precision: 0,
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
      },
    },
  };
  return (
    <>
      <Navbar />
      <Heatmap keyMistakesData={keyMistakesData} />
      <div className="p-12 m-12" style={{ height: '500px' }}>
        <Line data={chartData} options={options} />
      </div>
    </>
  );
}