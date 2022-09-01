import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sort', pure: true })
export class SortPipe implements PipeTransform {
  transform<T>(value: T[], by: keyof T, descending = false) {
    return value.slice().sort((a, b) => sort(a, b, by as string, descending));
  }
}

export function sort(a: any, b: any, by: string, descending?: boolean) {
  let aVal: any = a?.[by] ?? '';
  let bVal: any = b?.[by] ?? '';

  if (typeof aVal !== typeof bVal) {
    aVal = (aVal as Object).toString();
    bVal = (bVal as Object).toString();
  }
  if (typeof aVal === 'boolean') {
    aVal = +aVal;
    bVal = +bVal;
  }
  if (typeof aVal === 'object') {
    aVal = aVal.toString();
    bVal = bVal.toString();
  }

  let result = 0;
  if (typeof aVal === 'number') {
    result = aVal - bVal;
  } else if (typeof aVal === 'string') {
    result = aVal.localeCompare(bVal);
  }
  if (descending) {
    result *= -1;
  }
  return result;
}
