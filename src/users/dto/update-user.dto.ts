import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './signUp-user.dto';

export class UpdateUserDto extends PartialType(SignUpDto) {}
