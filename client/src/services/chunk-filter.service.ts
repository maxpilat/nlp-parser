import { Injectable } from '@angular/core';
import { ChunkRoles } from '../models/chunk';

@Injectable({
  providedIn: 'root',
})
export class ChunkFilterService {
  private roles: { role: ChunkRoles; isSelected: boolean }[] = [];

  constructor() {
    const keys = Object.keys(ChunkRoles) as ChunkRoles[];
    keys.forEach((key) => {
      this.roles.push({
        role: key,
        isSelected: true,
      });
    });
  }

  getRoles() {
    return this.roles;
  }

  isSelected() {
    return this.roles.some((role) => !role.isSelected);
  }
}
