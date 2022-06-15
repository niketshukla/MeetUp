import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const EventGenre = ({ events }) => {
    const [data, setData] = useState([]);
    const colors = ['#d0427f', '#f8a01f', '#528272', '#f15f4b', '#7dbeb8', '#5c69a0'];
    // eslint-disable-next-line
    useEffect(() => { setData(() => getData());}, [events]);
  
    const getData = () => {
      const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'AngularJS'];
      const data = genres.map((genre) => {
        const value = events.filter((event) => event.summary.split(' ').includes(genre)).length;
        return { name: genre, value: value };
      });
      return data;
    };

    return (
        <ResponsiveContainer height={400} >
            <PieChart width={400} height={400} >
                <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}`} >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index]} name={entry.name}/>)}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}

export default EventGenre;