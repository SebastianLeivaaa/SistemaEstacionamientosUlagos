export const getColorForStatus = (estado) => {
    switch (estado) {
      case 'LIBRE':
        return '#0082ff';
      case 'OCUPADO':
        return 'red';
      case 'RESERVADO':
        return '#36b139';
      case 'NO DISPONIBLE':
        return 'gray';
      default:
        return 'black'; 
    }
  };