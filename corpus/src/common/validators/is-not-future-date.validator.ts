import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return new Date(value) <= new Date();
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} cannot be a future date`;
  }
}

export function IsNotFutureDate(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsNotFutureDateConstraint,
    });
  };
}
