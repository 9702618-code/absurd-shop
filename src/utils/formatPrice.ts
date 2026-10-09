/**
 * Форматирует цену для отображения.
 * Принимает число (обычные товары) или строку (редкие товары).
 * Числа форматируются с разделителями тысяч и двумя знаками после запятой.
 * Строки возвращаются как есть.
 */
export const formatPrice = (value: number | string): string => {
  if (typeof value === 'string') {
    return value;
  }
  return value.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Проверяет, является ли цена числом.
 */
export const isNumericPrice = (value: number | string): value is number => {
  return typeof value === 'number';
};