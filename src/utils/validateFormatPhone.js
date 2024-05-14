export function validateFormatPhone(phone) {
    const regex = /^9\d{0,8}$/;
    return regex.test(phone);
  }