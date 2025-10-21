const search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');

// 1. Buscar en tiempo real
search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 25 + 's');
    });

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}

// 2. Ordenar columnas
table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        });

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    };
});

function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sort_asc
            ? first_row.localeCompare(second_row)
            : second_row.localeCompare(first_row);
    })
    .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

// 3. Exportar a PDF con nombre del paciente
const pdf_btn = document.querySelector('#toPDF');

pdf_btn.onclick = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nombrePaciente = document.querySelector('#nombre-paciente span').innerText;

    const table = document.querySelector('table');
    const headers = [];
    const data = [];

    // Encabezados
    table.querySelectorAll('thead th').forEach(th => {
        headers.push(th.innerText.trim());
    });

    // Filas visibles
    table.querySelectorAll('tbody tr:not(.hide)').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => {
            row.push(td.innerText.trim());
        });
        data.push(row);
    });

    doc.setFontSize(14);
    doc.text("Historial de Vacunas", 14, 15);
    doc.setFontSize(12);
    doc.text(`Nombres y Apellidos: ${nombrePaciente}`, 14, 22);

    doc.autoTable({
        head: [headers],
        body: data,
        startY: 30
    });

    doc.save('historial_vacunas.pdf');
};

// 4. Exportar a Excel solo con filas visibles y nombre del paciente
const excel_btn = document.querySelector('#toEXCEL');

excel_btn.onclick = () => {
    const table = document.querySelector('table');
    const headers = table.querySelector('thead').innerHTML;

    // Solo filas visibles
    const visibleRows = [...table.querySelectorAll('tbody tr:not(.hide)')];
    const rowsHTML = visibleRows.map(row => `<tr>${row.innerHTML}</tr>`).join('');

    const tableHTML = `<table>${headers}<tbody>${rowsHTML}</tbody></table>`;

    const nombrePaciente = document.querySelector('#nombre-paciente span').innerText;
    const pacienteInfoHTML = `<p><strong>Nombres y Apellidos:</strong> ${nombrePaciente}</p>`;

    const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:x="urn:schemas-microsoft-com:office:excel" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Historial</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
        </head>
        <body>
            <h2>Historial de Vacunas</h2>
            ${pacienteInfoHTML}
            ${tableHTML}
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_vacunas_filtrado.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
