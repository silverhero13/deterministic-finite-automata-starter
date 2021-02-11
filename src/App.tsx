import React, { useRef } from 'react';
import './App.css';

import { geometry, Surface, Path, Text, Group, Circle } from '@progress/kendo-drawing';
const { Circle: GeomCircle } = geometry;

const getRandomIntInclusive = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

interface PointsMapping {
    [key: string]: [number, number];
}

const App: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);

    const states = ['0', '1', '2', '3'];
    const transition_function = ['0A1', '0B2', '1A3', '1B2', '2A1', '2B3', '3A1', '3B0'];
    const colours = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

    // Map each state to a random x-y coordinates
    const state_point_mappings: PointsMapping = states.reduce((prev, curr) => {
        const x = getRandomIntInclusive(0, 1000);
        const y = getRandomIntInclusive(0, 600);

        const mapping = {
            [curr]: [x, y],
        };
        return { ...prev, ...mapping };
    }, {});

    // Map each state to a specific colour
    const state_colour_mappings: { [key: string]: string } = states.reduce((prev, curr, idx) => {
        const mapping = {
            [curr]: colours[idx],
        };
        return { ...prev, ...mapping };
    }, {});

    // Create the circle representing each state
    const state_circles = states.map((state) => {
        const geometry = new GeomCircle(state_point_mappings[state], 20);

        return new Circle(geometry, {
            stroke: { color: state_colour_mappings[state], width: 1 },
        });
    });

    // Create the labels representing each state
    const state_circle_labels = states.map((state) => {
        return new Text(state, state_point_mappings[state], { font: 'bold 15px Arial' });
    });

    // Create the "arrow" from one state to another state
    const paths = transition_function.map((mapping) => {
        const [from, , to] = mapping.split('');

        const from_point = state_point_mappings[from];
        const to_point = state_point_mappings[to];

        return new Path({
            stroke: {
                color: state_colour_mappings[from],
                width: 1,
            },
        })
            .moveTo(...from_point)
            .lineTo(...to_point)
            .close();
    });

    // Create the labels representing the input that transitions one state to another state
    const path_labels = transition_function.map((mapping) => {
        const [from, input, to] = mapping.split('');

        const [from_x, from_y] = state_point_mappings[from];
        const [to_x, to_y] = state_point_mappings[to];

        return new Text(input, [(from_x + to_x) / 2, (from_y + to_y) / 2], { font: 'bold 15px Arial' });
    });

    React.useEffect(() => {
        const surface = Surface.create(ref.current as HTMLDivElement);
        const group = new Group();

        group.append(...state_circles, ...state_circle_labels, ...paths, ...path_labels);

        surface.draw(group);
    }, []);

    return (
        <div className="App">
            <div ref={ref} style={{ height: '100vh' }} />
        </div>
    );
};

export default App;
