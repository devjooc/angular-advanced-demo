import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * this validator compares 2 strings to check if they are equal
 * @param main
 * @param confirm
 */

export function confirmEqualValidator(main: string, confirm: string): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {

    // first check if the 2 fields exist (keys) in the ctrl
    if (!ctrl.get(main) || !ctrl.get(confirm)) {
      return {
        confirmEqual: 'Invalid control names'
      };
    }

    // get values and compare
    const mainValue = ctrl.get(main)!.value;
    const confirmValue = ctrl.get(confirm)!.value;

    // return null => means validation is correct
    // return object => validation failed
    return mainValue === confirmValue ? null : {
      confirmEqual: {
        main: mainValue,
        confirm: confirmValue
      }
    };
  };
}
