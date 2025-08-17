import { apiClient } from '@/lib/api';
import { ApiResponse, PaginationParams } from '@/types/common';
import { Room, RoomType } from '../types/accommodation.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class RoomService {
  static async getRooms(params?: PaginationParams & { status?: string }): Promise<ApiResponse<Room[]>> {
    return apiClient.get(API_ENDPOINTS.ACCOMMODATION.ROOMS, { params });
  }

  static async getRoom(id: string): Promise<ApiResponse<Room>> {
    return apiClient.get(`${API_ENDPOINTS.ACCOMMODATION.ROOMS}/${id}`);
  }

  static async createRoom(data: Partial<Room>): Promise<ApiResponse<Room>> {
    return apiClient.post(API_ENDPOINTS.ACCOMMODATION.ROOMS, data);
  }

  static async updateRoom(id: string, data: Partial<Room>): Promise<ApiResponse<Room>> {
    return apiClient.put(`${API_ENDPOINTS.ACCOMMODATION.ROOMS}/${id}`, data);
  }

  static async deleteRoom(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.ACCOMMODATION.ROOMS}/${id}`);
  }

  static async updateRoomStatus(id: string, status: string): Promise<ApiResponse<Room>> {
    return apiClient.patch(`${API_ENDPOINTS.ACCOMMODATION.ROOMS}/${id}/status`, { status });
  }

  // Room Types
  static async getRoomTypes(): Promise<ApiResponse<RoomType[]>> {
    return apiClient.get(API_ENDPOINTS.ACCOMMODATION.ROOM_TYPES);
  }

  static async createRoomType(data: Partial<RoomType>): Promise<ApiResponse<RoomType>> {
    return apiClient.post(API_ENDPOINTS.ACCOMMODATION.ROOM_TYPES, data);
  }
}
