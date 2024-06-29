export const formatTimeThree = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Añade ceros iniciales si es necesario
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = secs < 10 ? `0${secs}` : secs;

    // Si es menos de una hora, muestra mm:ss
    if (hours === 0) {
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Añade ceros iniciales a las horas si es necesario
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};