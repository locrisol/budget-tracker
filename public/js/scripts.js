fetch('/api/summary/by-category')
    .then(r => r.json())
    .then(data => {
        const labels = [];
        const totals = [];
        const backgroundColors = [];
        const borderColors = [];
        data.forEach(d => {
            const name = d.Category.name + ' (' + d.type + ')';
            labels.push(name);
            const total = parseFloat(d.dataValues ? d.dataValues.total : d.total) || 0;
            totals.push(total);
            const color = d.type === 'expense'
                ? 'rgba(255,99,132,0.7)'
                : 'rgba(54,162,235,0.7)';
            backgroundColors.push(color);
            borderColors.push(color.replace(/0\.7/, '1'));
        });
        new Chart(document.getElementById('byCategoryChart'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Amount (€)',
                    data: totals,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    });