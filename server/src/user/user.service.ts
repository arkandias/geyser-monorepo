import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByOidEmail(oid: number, email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { oid, email } });
  }
}
