export function isValidVietnamesePhone(phone: string): boolean {
  const regex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
  return regex.test(phone.trim());
}

export function validateTrialForm(data: { name: string; phone: string; age?: number }) {
  const errors: Record<string, string> = {};
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Họ và tên phải chứa ít nhất 2 ký tự';
  }
  if (!isValidVietnamesePhone(data.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ (Ví dụ: 0912345678)';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}