import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top',
      color: `rgba(255, 255, 255, 1)`,
      labels: {
        color: `rgba(255, 255, 255, .95)`,
        fontSize: '20px',
      },
    },
    title: {
      display: true,
      text: 'Total Points',
      color: `rgba(255, 255, 255, 1)`,
    },
  },
  legend: {
    labels: {
      color: `rgba(255, 255, 255, .95)`,
      fontSize: '20px',
    },
  },
  scales: {
    x: {
      stacked: true,
      color: `rgba(255, 255, 255, 1)`,
    },
    y: {
      stacked: true,
      color: `rgba(255, 255, 255, 1)`,
    },
  },
  color: `rgba(255, 255, 255, 1)`,
};

export default function Tally() {
  const users = useSelector((state) => state.users);
  const failedVotes = useSelector((state) => state.failedVotes);
  const passedVotes = useSelector((state) => state.passedVotes);
  const room = useSelector((state) => state.room);

  useEffect(() => {
    room.send('resetTimer');
    toast('Time to tally your scores....');
  }, []);

  const clientIds = Object.keys(users);

  const allFailedVotes = clientIds.map((client) => {
    return failedVotes[client] * 75;
  });
  // console.log(allFailedVotes);
  const allPassedVotes = clientIds.map((client) => {
    return passedVotes[client] * 250;
  });

  /*
  create array of client usernames
   to be used as labels for chart
  */
  const labels = clientIds.map((client) => {
    return users[client].username;
  });

  /*
  below to be used after voting increments
  correctPoints and incorrectPoints
  */

  const correctPoints = clientIds.map((client) => {
    return users[client].correctPoints;
  });
  const incorrectPoints = clientIds.map((client) => {
    return users[client].incorrectPoints;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Fail score',
        data: incorrectPoints,
        backgroundColor: 'rgba(255, 99, 132, 0.75)',
        stack: 'Stack 0',
      },
      {
        label: 'Total Pass score',
        data: correctPoints,
        backgroundColor: 'rgba(53, 162, 235, 0.75)',
        stack: 'Stack 0',
      },
      {
        label: 'Current Round Pass Points',
        data: allPassedVotes,
        backgroundColor: 'rgba(44,126,155, 0.75)',
        stack: 'Stack 1',
      },
      {
        label: 'Current Round Fail Points',
        data: allFailedVotes,
        backgroundColor: 'rgba(168,49,20,0.75)',
        stack: 'Stack 1',
      },
    ],
  };

  return (
    <div className="tallyChart">
      <Bar options={options} data={data} height="140px" />{' '}
    </div>
  );
}
