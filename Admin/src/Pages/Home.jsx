import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ArcElement, Tooltip, Legend);

const AnimatedCounter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(target);
        if (start === end) return;
        const duration = 800;
        const incrementTime = 10;
        const increment = Math.ceil(end / (duration / incrementTime));

        const timer = setInterval(() => {
            start += increment;
            if (start > end) {
                start = end;
                clearInterval(timer);
            }
            setCount(start);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [target]);

    return <span>{count}</span>;
};

const AdminHome = () => {
    const navigate = useNavigate();

    const quickLinks = [
        {
            title: "Add / Update Products",
            path: "/add",
            color: "#D0D7C5"
        },
        {
            title: "View Orders",
            path: "/orders",
            color: "#D0D7C5"
        },
        {
            title: "View Products",
            path: "/list",
            color: "#D0D7C5"
        }
    ];

    const stats = [
        { title: 'Total Orders', value: 12 },
        { title: 'Revenue', value: 5000 },
        { title: 'Users', value: 3 },
        { title: 'Products', value: 206 },
    ];

    const activityLog = [
        '✅ Order #3421 has been delivered.',
        '🆕 New user "john_doe" registered.',
        '⚠️ Product "Red T-shirt" is out of stock.',
        '💬 Customer reviewed "Black Sneakers".',
    ];

    const topProducts = [
        { name: "Melamine Faced MDF Antic Pine #AP", sold: 12 },
        { name: "Mahogany Squares #217M Melamine Faced MDF", sold: 9 },
        { name: "LA-type Full Overlay 110° Degree Opening Hinge", sold: 10 },
    ];

    const tips = [
        "📦 Keep stock levels updated.",
        "🔐 Check admin logs weekly.",
        "💰 Review sales trends weekly.",
    ];

    const announcements = [
        "🛠️ System maintenance on April 15, 2AM-4AM.",
        "🌟 New feature: Product Reviews coming soon.",
        "📁 Reminder: Backup your data weekly.",
    ];

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Weekly Sales',
            data: [120, 190, 500, 200, 800, 1000, 1500],
            backgroundColor: '#6a5acd80',
            borderColor: '#6a5acd',
            fill: true,
            tension: 0.4,
        }]
    };

    const doughnutData = {
        labels: ['MDF', 'Plywood', 'Aluminium Hardware', 'Flooring', 'Hardware'],
        datasets: [{
            label: 'Product Category Share',
            data: [45, 2, 50, 7, 87],
            backgroundColor: [
                '#6a5acd',
                '#d41243',
                '#ffa500',
                '#ff69b4',
                '#20b2aa'
            ],
            borderColor: '#fff',
            borderWidth: 2,
        }]
    };

    return (
        <div className="admin-home">
            <h1>👋 Welcome Back, Admin</h1>
            <p style={{ marginBottom: '50px' }}>Manage your store effectively and stay updated.</p>

            <div className="quick-links">
                {quickLinks.map((link, index) => (
                    <div
                        key={index}
                        className="link-card"
                        onClick={() => navigate(link.path)}
                    >
                        <h3>{link.title}</h3>
                    </div>
                ))}
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} style={{ flex: '1 1 200px', background: '#f9f9f9', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ color: '#555' }}>{stat.title}</h3>
                        <h2 style={{ color: '#6a5acd' }}>
                            <AnimatedCounter target={stat.value} />
                        </h2>
                    </div>
                ))}
            </div>

            <div className="charts">
                <h2>📊 Charts Overview</h2>
                <div className="charts-overview">
                    <div className="chart-box">
                        <h3 style={{ textAlign: 'center' }}> Weekly Sales</h3>
                        <Line data={chartData} />
                    </div>
                    <div className="chart-box-small">
                        <h3 style={{ textAlign: 'center' }}>Product Categories</h3>
                        <Doughnut data={doughnutData} />
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <div style={{ flex: '1 1 300px' }}>
                    <h3>🕒 Recent Activities</h3>
                    <ul>
                        {activityLog.map((log, i) => (
                            <li key={i}>{log}</li>
                        ))}
                    </ul>
                </div>

                <div style={{ flex: '1 1 300px' }}>
                    <h3>🔥 Top Selling Products</h3>
                    <ul>
                        {topProducts.map((p, i) => (
                            <li key={i}>{p.name} — {p.sold} sold</li>
                        ))}
                    </ul>
                </div>

                <div style={{ flex: '1 1 300px' }}>
                    <h3>💡 Admin Tips</h3>
                    <ul>
                        {tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="announcements">
                <h2>📢 Latest Announcements</h2>
                <ul>
                    {announcements.map((note, i) => (
                        <li key={i}>{note}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminHome;
