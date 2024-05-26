import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatDate = (isoDate) => {
    console.log(isoDate);
    const date = parseISO(isoDate);

    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    console.log(adjustedDate);
    const formattedDate = format(adjustedDate, "EEEE dd 'de' MMMM 'del' yyyy", { locale: es });

    const parts = formattedDate.split(' ');
    parts[0] = capitalizeFirstLetter(parts[0]);
    parts[3] = capitalizeFirstLetter(parts[3]);

    return parts.join(' ');
};
