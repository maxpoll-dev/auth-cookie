import { Injectable, NotFoundException } from '@nestjs/common'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async profile(userId: string) {
    const user = await this.repo.findById(userId)
    if (user === null) throw new NotFoundException({ code: 'USER_NOT_FOUND' })

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    }
  }
}
