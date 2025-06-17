import React from 'react';

export default function Welcome({ message }) {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>🚀 Laravel + Inertia + React</h1>
            <p>{message}</p>
            <p>¡Tu aplicación híbrida está funcionando!</p>
        </div>
    );
}
