import React from 'react';
import './ChartWidget.css';

export const ChartWidget = () => {
    // Sample data points for the chart
    const data = [
        { day: 'Mon', value: 45 },
        { day: 'Tue', value: 62 },
        { day: 'Wed', value: 55 },
        { day: 'Thu', value: 78 },
        { day: 'Fri', value: 85 },
        { day: 'Sat', value: 92 },
        { day: 'Sun', value: 68 }
    ];

    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="chart-widget">
            <div className="chart-header">
                <div>
                    <h3 className="chart-title">Response Trends</h3>
                    <p className="chart-subtitle">Daily poll responses this week</p>
                </div>
                <div className="time-range-selector">
                    <button className="time-btn active">7D</button>
                    <button className="time-btn">30D</button>
                    <button className="time-btn">90D</button>
                </div>
            </div>

            <div className="chart-container">
                <div className="chart-bars">
                    {data.map((point, index) => {
                        const heightPercent = (point.value / maxValue) * 100;
                        return (
                            <div key={index} className="chart-bar-wrapper">
                                <div className="chart-bar-container">
                                    <span className="bar-value">{point.value}</span>
                                    <div
                                        className="chart-bar"
                                        style={{ height: `${heightPercent}%` }}
                                    ></div>
                                </div>
                                <span className="bar-label">{point.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="chart-footer">
                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="legend-dot"></span>
                        <span className="legend-label">Total Responses</span>
                    </div>
                </div>
                <div className="chart-total">
                    <span className="total-label">Total:</span>
                    <span className="total-value">{data.reduce((sum, d) => sum + d.value, 0)}</span>
                </div>
            </div>
        </div>
    );
};
