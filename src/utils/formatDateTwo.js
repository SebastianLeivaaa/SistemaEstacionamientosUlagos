export function formatDateTwo(currentDate) {
    const date = new Date(currentDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}